import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GrupoProvider } from './context/GrupoContext';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GrupoProvider>
        <App />
      </GrupoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
