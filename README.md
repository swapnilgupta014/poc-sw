# Service Worker with Workbox and React - Proof of Concept (PoC)

## What is this PoC?

This Proof of Concept (PoC) demonstrates how to integrate **Workbox** with a **React** application to enable advanced service worker capabilities, such as **offline support**, **caching strategies**, and **runtime caching**. It uses **Webpack** for bundling and **Workbox's `InjectManifest`** plugin to allow custom service worker logic while leveraging Workbox's precaching and runtime caching features.

## Why?

Modern web applications often require **offline functionality**, **fast loading times**, and **efficient resource caching**. Service workers are a key technology to achieve this, but managing them manually can be complex. This PoC shows how to:

- Use **Workbox** to simplify service worker implementation.
- Implement **custom caching strategies** for different types of assets (e.g., static files, APIs, libraries).
- Ensure the app works **offline** and provides a seamless user experience.
- Automatically **precache assets** during the build process.
- Handle **service worker updates** gracefully.

## How?

### Webpack Configuration:
- Uses `InjectManifest` from `workbox-webpack-plugin` to inject precache manifest into a custom service worker.
- Configures caching strategies for static assets, JavaScript files, libraries, and API responses.

### Custom Service Worker:
- Written in `src/service-worker.js`, it defines runtime caching strategies for different types of resources.
- Handles precaching, offline fallback, and cache expiration.

### React App:
- Registers the service worker and handles network status changes (online/offline).
- Displays notifications when the network status changes.

### Build Process:
- Webpack generates the final `service-worker.js` with precached assets and custom logic.
- The app is optimized for production with code splitting, minification, and cache-friendly file naming.


## Key Features

- **Offline Support**: The app works offline by caching critical resources.
- **Custom Caching Strategies**: Different strategies for static assets, libraries, and API calls.
- **Service Worker Updates**: Handles updates gracefully with `skipWaiting` and `clients.claim()`.
- **Network Status Notifications**: Displays real-time notifications for online/offline status.

## How to Run

1. Clone the repository
2. npm run build
3. serve -s dist
