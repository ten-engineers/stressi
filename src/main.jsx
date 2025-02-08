import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto";
import "./index.css";
import App from "./App.jsx";

// ✅ Register Service Worker for PWA Offline Support
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content is available. Refresh now?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("The app is ready to work offline.");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);