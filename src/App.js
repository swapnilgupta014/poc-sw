import React, { useState, useEffect, useCallback, useRef } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Wifi, WifiOff, X, Activity, Server, Trash, Download, FileDown } from "lucide-react"

import Home from "./pages/Home"
import About from "./pages/About"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Contact from "./pages/Contact"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import Header from "./components/Header"
import Footer from "./components/Footer"

const App = () => {
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState("Initializing")
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOfflineNotification, setShowOfflineNotification] = useState(false)
  const [showOnlineNotification, setShowOnlineNotification] = useState(false)
  const [cacheLogs, setCacheLogs] = useState([])
  const [showCacheLogs, setShowCacheLogs] = useState(false)
  const swRegistrationRef = useRef(null)
  const [cacheStats, setCacheStats] = useState({
    totalCaches: 0,
    totalSize: 0,
    cacheDetails: []
  })

  const sendMessageToSW = useCallback((message) => {
    return new Promise((resolve, reject) => {
      if (!swRegistrationRef.current || !swRegistrationRef.current.active) {
        reject(new Error("No active service worker"));
        return;
      }
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
      swRegistrationRef.current.active.postMessage(message, [messageChannel.port2]);
    });
  }, []);

  const initServiceWorker = useCallback(async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        swRegistrationRef.current = registration;
        setServiceWorkerStatus("Registered");
        
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_LOG') {
            setCacheLogs(logs => {
              const newLogs = [event.data.payload, ...logs];
              return newLogs.slice(0, 100);
            });
          } else if (event.data && event.data.type === 'CACHE_LOGS_RESPONSE') {
            setCacheLogs(event.data.payload);
          }
        });
        
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              navigator.serviceWorker.addEventListener(
                "controllerchange",
                async () => {
                  window.location.reload();
                },
                { once: true }
              );
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });

        return registration;
      } catch (error) {
        setServiceWorkerStatus("Registration Failed");
        console.error('Service worker registration failed:', error);
        return null;
      }
    } else {
      setServiceWorkerStatus("Not Supported");
      return null;
    }
  }, []);

  const handleNetworkChange = useCallback(() => {
    const online = navigator.onLine

    if (online && !isOnline) {
      setShowOnlineNotification(true)
      setShowOfflineNotification(false)
    } else if (!online && isOnline) {
      setShowOfflineNotification(true)
      setShowOnlineNotification(false)
    }

    setIsOnline(online)
  }, [isOnline])
  
  const fetchCacheLogs = useCallback(async () => {
    try {
      await sendMessageToSW({ type: 'GET_CACHE_LOGS' });
    } catch (error) {
      console.error('Error fetching cache logs:', error);
    }
  }, [sendMessageToSW]);
  
  const clearAllCaches = useCallback(async () => {
    try {
      if (window.confirm("Are you sure you want to clear all caches? The app may temporarily work offline until resources are re-cached.")) {
        const result = await sendMessageToSW({ type: 'CLEAR_CACHE' });
        if (result && result.success) {
          alert("All caches cleared successfully");
          fetchCacheStats();
        } else {
          alert("Failed to clear caches: " + (result?.error || "Unknown error"));
        }
      }
    } catch (error) {
      console.error('Error clearing caches:', error);
      alert("Error clearing caches: " + error.message);
    }
  }, [sendMessageToSW]);
  
  const fetchCacheStats = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await window.caches.keys();
        const details = [];
        let totalSize = 0;
        
        for (const name of cacheNames) {
          const cache = await window.caches.open(name);
          const requests = await cache.keys();
          const cacheDetail = {
            name,
            entries: requests.length,
            urls: requests.slice(0, 5).map(req => req.url)
          };
          details.push(cacheDetail);
        }
        
        setCacheStats({
          totalCaches: cacheNames.length,
          totalSize: totalSize,
          cacheDetails: details
        });
      } catch (error) {
        console.error('Error fetching cache stats:', error);
      }
    }
  }, []);

  useEffect(() => {
    initServiceWorker()

    window.addEventListener("online", handleNetworkChange)
    window.addEventListener("offline", handleNetworkChange)
    
    fetchCacheLogs();
    fetchCacheStats();
    
    const statsInterval = setInterval(fetchCacheStats, 30000);
    
    return () => {
      window.removeEventListener("online", handleNetworkChange)
      window.removeEventListener("offline", handleNetworkChange)
      clearInterval(statsInterval);
    }
  }, [initServiceWorker, handleNetworkChange, fetchCacheLogs, fetchCacheStats])

  const NetworkNotification = ({ isOffline, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-6 right-6 max-w-sm w-full rounded-lg shadow-lg z-50 overflow-hidden ${
                isOffline ? "bg-gray-800" : "bg-gray-800"
            }`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className={`flex-shrink-0 p-2 rounded-full ${isOffline ? "bg-red-100" : "bg-green-100"}`}>
                {isOffline ? (
                    <WifiOff size={20} className="text-red-500" />
                ) : (
                    <Wifi size={20} className="text-green-500" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-white">{isOffline ? "You're offline" : "You're back online"}</h3>
                <p className="mt-1 text-sm text-gray-300">
                  {isOffline
                      ? "Your network connection was lost, but the app is still working."
                      : "Your network connection has been restored."}
                </p>
              </div>
              <button onClick={onClose} className="ml-4 flex-shrink-0 text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className={`h-1 ${isOffline ? "bg-red-500" : "bg-green-500"}`}></div>
        </motion.div>
    )
  }

  const NetworkStatus = () => {
    return (
        <div className="fixed bottom-6 left-6 z-40 flex flex-col space-y-2">
          <div
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-md border border-gray-200"
              title={isOnline ? "Online" : "Offline"}
          >
            {isOnline ? (
                <>
                  <Wifi size={16} className="text-green-500" />
                  <span className="text-xs font-medium text-gray-700">Network Connected</span>
                </>
            ) : (
                <>
                  <WifiOff size={16} className="text-red-500" />
                  <span className="text-xs font-medium text-gray-700">Offline</span>
                </>
            )}
          </div>
          
          <button
            onClick={() => setShowCacheLogs(prev => !prev)}
            className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-md border border-gray-200"
            title="Service Worker Logs"
          >
            <Activity size={16} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-700">Cache Logs</span>
          </button>
          
          <button
            onClick={clearAllCaches}
            className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-md border border-gray-200"
            title="Clear Cache"
          >
            <Trash size={16} className="text-red-500" />
            <span className="text-xs font-medium text-gray-700">Clear Cache</span>
          </button>
        </div>
    )
  }
  
  const CacheLogsPanel = () => {
    if (!showCacheLogs) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-24 left-6 z-40 bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-3xl max-h-96 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between bg-gray-100 p-3 border-b border-gray-200">
          <div className="flex items-center">
            <Server size={16} className="text-blue-500 mr-2" />
            <h3 className="font-medium">Service Worker Cache Logs</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={fetchCacheLogs} 
              className="p-1 rounded hover:bg-gray-200" 
              title="Refresh logs"
            >
              <FileDown size={16} className="text-blue-500" />
            </button>
            <button 
              onClick={fetchCacheStats} 
              className="p-1 rounded hover:bg-gray-200" 
              title="Refresh cache stats"
            >
              <Download size={16} className="text-green-500" />
            </button>
            <button 
              onClick={() => setShowCacheLogs(false)} 
              className="p-1 rounded hover:bg-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex-shrink-0 p-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 p-2 rounded border border-blue-100">
              <p className="text-xs text-blue-700 font-medium">Caches</p>
              <p className="text-lg font-semibold">{cacheStats.totalCaches}</p>
            </div>
            <div className="bg-green-50 p-2 rounded border border-green-100">
              <p className="text-xs text-green-700 font-medium">Service Worker</p>
              <p className="text-sm font-semibold">{serviceWorkerStatus}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded border border-purple-100">
              <p className="text-xs text-purple-700 font-medium">Log Entries</p>
              <p className="text-lg font-semibold">{cacheLogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto p-3">
          <h4 className="font-medium text-sm mb-2">Cache Operations Log:</h4>
          {cacheLogs.length > 0 ? (
            <div className="space-y-2">
              {cacheLogs.map((log, index) => (
                <div key={index} className="text-xs p-2 bg-gray-50 rounded border border-gray-100">
                  <div className="flex justify-between">
                    <span className={`font-medium ${getOperationColor(log.operation)}`}>
                      {log.operation}
                    </span>
                    <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="mt-1 text-gray-700 overflow-x-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No cache operations logged yet.</p>
          )}
        </div>
        
        <div className="flex-shrink-0 p-3 bg-gray-50 border-t border-gray-200">
          <h4 className="font-medium text-sm mb-2">Cache Details:</h4>
          {cacheStats.cacheDetails.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cacheStats.cacheDetails.map((cache, index) => (
                <div key={index} className="text-xs p-2 bg-white rounded border border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-600">{cache.name}</span>
                    <span className="text-gray-500">{cache.entries} entries</span>
                  </div>
                  {cache.urls.length > 0 && (
                    <div className="mt-1">
                      <p className="text-gray-500">Sample entries:</p>
                      <ul className="pl-4 list-disc text-gray-600">
                        {cache.urls.map((url, idx) => (
                          <li key={idx} className="truncate w-full">
                            {new URL(url).pathname}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No caches detected</p>
          )}
        </div>
      </motion.div>
    );
  };
  
  const getOperationColor = (operation) => {
    switch (operation) {
      case 'CACHE_ADDED':
        return 'text-green-600';
      case 'CACHE_UPDATED':
        return 'text-blue-600';
      case 'CACHE_DELETED':
        return 'text-red-600';
      case 'CACHE_ERROR':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        
        <Footer />
        
        <NetworkStatus />
        <CacheLogsPanel />
        
        <AnimatePresence>
          {showOfflineNotification && (
            <NetworkNotification 
              isOffline={true} 
              onClose={() => setShowOfflineNotification(false)} 
            />
          )}
          
          {showOnlineNotification && (
            <NetworkNotification 
              isOffline={false} 
              onClose={() => setShowOnlineNotification(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;