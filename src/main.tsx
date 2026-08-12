import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';

const buildTarget = import.meta.env.VITE_BUILD_TARGET;

const RootComponent = buildTarget === 'admin' 
  ? lazy(() => import('./AdminApp'))
  : buildTarget === 'mobile'
  ? lazy(() => import('./MobileApp'))
  : lazy(() => import('./App'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={
      <div className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center p-4 font-serif text-sm">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p>حلقہ عثمانیہ آفیشل - Loading Application...</p>
      </div>
    }>
      <RootComponent />
    </Suspense>
  </StrictMode>,
);

// Register Service Worker for offline access
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
} else if ('serviceWorker' in navigator) {
  // Also register in dev mode if supported for full feature simulator verification, but allow dynamic updates
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registered in development mode: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed in dev: ', error);
      });
  });
}

