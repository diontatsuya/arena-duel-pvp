import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./router/AppRoutes"; // ganti App menjadi AppRoutes
import { WalletProvider } from "./context/WalletContext"; // pastikan path-nya benar
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletProvider>
      <AppRoutes />
    </WalletProvider>
  </React.StrictMode>
);
