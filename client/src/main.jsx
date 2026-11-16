
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./services/socket";
import "./index.css";

import App from "./App.jsx";

import { EventProvider } from "./context/EventContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EventProvider>
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </EventProvider>
  </StrictMode>
);
