import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GrupoProvider } from './context/GrupoContext';

console.log("✅ main.tsx ejecutado");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GrupoProvider>
        <App />
      </GrupoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
