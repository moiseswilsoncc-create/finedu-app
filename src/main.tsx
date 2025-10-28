import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("✅ main.tsx ejecutado");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
