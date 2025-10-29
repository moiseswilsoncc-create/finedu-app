import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 🧩 Renderizado institucional
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("❌ No se encontró el elemento raíz 'root' en index.html");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
