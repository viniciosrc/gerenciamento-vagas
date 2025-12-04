import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SocketProvider } from "./context/socket/provider";

import App from "./App";

import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <SocketProvider address="ws://localhost:3000">
    <App />
  </SocketProvider>,
);
