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
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({
          type: 'CACHE_LOGS_RESPONSE',
          payload: cacheLogStore.logs
        });
      } else {
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

clientsClaim();
setCacheNameDetails({
  prefix: 'app',
  suffix: 'v1',
  precache: 'install-time',
  runtime: 'run-time',
});

cleanupOutdatedCaches();

self.addEventListener('activate', async (event) => {
  logCacheOperation('ACTIVATE', 'Service worker activated');
    event.waitUntil(async function() {
    const cacheNames = await caches.keys();
    logCacheOperation('CACHE_CLEANUP_START', { cacheCount: cacheNames.length });
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      logCacheOperation('CACHE_PROCESSING', { 
        cacheName, 
        entryCount: requests.length 
      });
      
      const fileGroups = {};
      
      for (const request of requests) {
        const url = new URL(request.url);
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
      
      for (const [baseName, files] of Object.entries(fileGroups)) {
        if (files.length > 1) {
          files.sort((a, b) => {
            const versionA = a.url.search.match(/v=([^&]+)/) || a.url.pathname.match(/\.([^\.]+)\.js/);
            const versionB = b.url.search.match(/v=([^&]+)/) || b.url.pathname.match(/\.([^\.]+)\.js/);
            
            if (versionA && versionB) {
              return versionB[1].localeCompare(versionA[1]);
            }
            return 0;
          });
          
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


self.addEventListener('install', (event) => {
  logCacheOperation('INSTALL', 'Service worker installed');
});

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  /\/$/,
  createStrategyWithLogging(
    new StaleWhileRevalidate({
      cacheName: 'app-shell',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 60 * 24 * 60 * 60 
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
    'StaleWhileRevalidate-AppShell'
  )
);

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
          maxAgeSeconds: 60 * 24 * 60 * 60, 
          purgeOnQuotaError: true
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
          maxAgeSeconds: 60 * 24 * 60 * 60,
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