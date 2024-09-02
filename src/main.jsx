import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './components/styles/index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
          .then(registration => {
              console.log('Service Worker registrado con éxito:', registration.scope);
          }).catch(error => {
              console.log('Registro de Service Worker fallido:', error);
          });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
