import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { NotificationProvider } from "./Context/NotificationProvider";

// Open the connection to the API server while the app bundle is still booting
try {
  const apiOrigin = new URL(import.meta.env.VITE_API_BASE, window.location.href).origin;
  if (apiOrigin !== window.location.origin) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = apiOrigin;
    link.crossOrigin = "";
    document.head.appendChild(link);
  }
} catch {
  /* VITE_API_BASE missing/invalid - nothing to preconnect */
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NotificationProvider>
  </React.StrictMode>,
);
