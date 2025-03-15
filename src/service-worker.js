import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';

const cacheLogStore = {
  logs: [],
  maxEntries: 100
};

const logCacheOperation = async (operation, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    operation,
    details
  };
  
  cacheLogStore.logs.push(logEntry);
  if (cacheLogStore.logs.length > cacheLogStore.maxEntries) {
    cacheLogStore.logs.shift();
  }
  
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'CACHE_LOG',
      payload: logEntry
    });
  });
  
  console.log(`[SW] ${operation}:`, details);
};

self.addEventListener('message', async (event) => {
  if (!event.data) return;
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      logCacheOperation('SKIP_WAITING', 'Service worker skipping waiting phase');
      break;
      
    case 'GET_CACHE_LOGS':
      // Respond with all cached logs
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({
          type: 'CACHE_LOGS_RESPONSE',
          payload: cacheLogStore.logs
        });
      } else {
        // If no MessageChannel, send to all clients
        const client = await self.clients.get(event.source.id);
        if (client) {
          client.postMessage({
            type: 'CACHE_LOGS_RESPONSE',
            payload: cacheLogStore.logs
          });
        }
      }
      break;
      
    case 'CLEAR_CACHE':
      try {
        const cacheName = event.data.cacheName;
        if (cacheName) {
          await caches.delete(cacheName);
          logCacheOperation('CACHE_CLEARED', { cacheName });
        } else {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          logCacheOperation('ALL_CACHES_CLEARED', { count: cacheNames.length });
        }
        
        // Respond to the client
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      } catch (error) {
        logCacheOperation('CACHE_CLEAR_ERROR', { error: error.message });
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: false, error: error.message });
        }
      }
      break;
  }
});

// Take control of all clients as soon as the service worker activates
clientsClaim();

// Set cache name details
setCacheNameDetails({
  prefix: 'app',
  suffix: 'v1',
  precache: 'install-time',
  runtime: 'run-time',
});

// Clean up outdated caches
cleanupOutdatedCaches();

// Handle version changes for main.js and other important files
self.addEventListener('activate', async (event) => {
  // Log activation
  logCacheOperation('ACTIVATE', 'Service worker activated');
  
  // Clean up old caches when a new service worker activates
  event.waitUntil(async function() {
    // Get all cache names
    const cacheNames = await caches.keys();
    logCacheOperation('CACHE_CLEANUP_START', { cacheCount: cacheNames.length });
    
    // Get all cache entries for javascript files
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      logCacheOperation('CACHE_PROCESSING', { 
        cacheName, 
        entryCount: requests.length 
      });
      
      // Group requests by base filename (without version hash)
      const fileGroups = {};
      
      for (const request of requests) {
        const url = new URL(request.url);
        // Match files like main.js?v=123456 or chunks/main.123456.js
        const mainJsMatch = url.pathname.match(/\/assets\/js\/([^\/]+)\.js/) || 
                           url.pathname.match(/\/assets\/js\/chunks\/([^\/]+)\.[^\.]+\.js/);
        
        if (mainJsMatch) {
          const baseName = mainJsMatch[1];
          if (!fileGroups[baseName]) {
            fileGroups[baseName] = [];
          }
          fileGroups[baseName].push({ request, url });
        }
      }
      
      // For each group, keep only the newest version
      for (const [baseName, files] of Object.entries(fileGroups)) {
        if (files.length >= 1) {
          // Sort by querystring version or filename hash (newer = higher)
          files.sort((a, b) => {
            const versionA = a.url.search.match(/v=([^&]+)/) || a.url.pathname.match(/\.([^\.]+)\.js/);
            const versionB = b.url.search.match(/v=([^&]+)/) || b.url.pathname.match(/\.([^\.]+)\.js/);
            
            if (versionA && versionB) {
              return versionB[1].localeCompare(versionA[1]);
            }
            return 0;
          });
          
          // Keep the newest version (first after sorting) and delete the rest
          for (let i = 0; i < files.length; i++) {
            await cache.delete(files[i].request);
            logCacheOperation('DELETE_OUTDATED_FILE', {
              cacheName,
              baseName,
              url: files[i].url.pathname + files[i].url.search,
              totalVersions: files.length,
              keptVersion: files[0].url.pathname + files[0].url.search
            });
          }
        }
      }
    }
    
    logCacheOperation('CACHE_CLEANUP_COMPLETE', { success: true });
  }());
});

// Log for each cache hit/miss
const createStrategyWithLogging = (strategy, strategyName) => {
  return {
    async handle(options) {
      const request = options.request;
      const url = request.url;
      
      try {
        const response = await strategy.handle(options);
        
        logCacheOperation('CACHE_HIT', {
          strategy: strategyName,
          url,
          status: response.status,
          type: request.destination || 'unknown'
        });
        
        return response;
      } catch (error) {
        logCacheOperation('CACHE_MISS', {
          strategy: strategyName,
          url,
          error: error.message,
          type: request.destination || 'unknown'
        });
        throw error;
      }
    }
  };
};

// Precache and route setup - this line will be replaced with the precache manifest
// during the build process by the InjectManifest plugin
self.addEventListener('install', (event) => {
  logCacheOperation('INSTALL', 'Service worker installed');
});

precacheAndRoute(self.__WB_MANIFEST);

// Cache for all main app shell files
registerRoute(
  /\/$/,
  createStrategyWithLogging(
    new StaleWhileRevalidate({
      cacheName: 'app-shell',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'StaleWhileRevalidate-AppShell'
  )
);

// Cache for CSS, JS, and other static resources
registerRoute(
  ({ request }) =>
    request.destination === "script" ||
    request.destination === "style",
  createStrategyWithLogging(
    new CacheFirst({
      cacheName: "static-resources",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
          purgeOnQuotaError: true // Delete if storage quota is exceeded
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'CacheFirst-StaticResources'
  )
);

registerRoute(
  ({ url }) => 
    url.pathname.includes('/assets/js/main.js') || 
    url.pathname.includes('/assets/js/chunks/'),
  createStrategyWithLogging(
    new CacheFirst({
      cacheName: "javascript-files",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60,
          purgeOnQuotaError: true
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'CacheFirst-JSFiles'
  )
);

registerRoute(
  ({ url }) =>
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/),
  createStrategyWithLogging(
    new CacheFirst({
      cacheName: "static-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
          purgeOnQuotaError: true
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'CacheFirst-StaticAssets'
  )
);

registerRoute(
  ({ url }) => url.pathname.endsWith('.js') || url.pathname.includes("/assets/js/"),
  createStrategyWithLogging(
    new CacheFirst({
      cacheName: "javascript-files",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
          purgeOnQuotaError: true
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'CacheFirst-JavaScript'
  )
);

registerRoute(
  ({ url }) => url.pathname.includes("node_modules") ||
    url.pathname.includes("react") ||
    url.pathname.includes("three") ||
    url.pathname.includes("chart") ||
    url.pathname.includes("firebase") ||
    url.pathname.includes("lodash") ||
    url.pathname.includes("framer-motion"),
  createStrategyWithLogging(
    new CacheFirst({
      cacheName: "libraries",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 90 * 24 * 60 * 60,
          purgeOnQuotaError: true
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'CacheFirst-Libraries'
  )
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  createStrategyWithLogging(
    new NetworkFirst({
      cacheName: "api-responses",
      networkTimeoutSeconds: 5,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,
          purgeOnQuotaError: true
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'NetworkFirst-API'
  )
);

registerRoute(
  ({ request }) => request.mode === 'navigate',
  createStrategyWithLogging(
    new NetworkFirst({
      cacheName: "navigation",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60,
          purgeOnQuotaError: true
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'NetworkFirst-Navigation'
  )
);

registerRoute(
  /.*/,
  createStrategyWithLogging(
    new StaleWhileRevalidate({
      cacheName: "others",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 14 * 24 * 60 * 60,
          purgeOnQuotaError: true
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'StaleWhileRevalidate-Others'
  )
);

setCatchHandler(async ({ event }) => {
  logCacheOperation('FALLBACK_TRIGGERED', {
    url: event.request.url,
    mode: event.request.mode
  });
  
  if (event.request.mode === 'navigate') {
    return caches.match('/offline.html') || Response.error();
  }
  
  return Response.error();
});