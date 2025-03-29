import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "thirdweb/react";
import App from "./App.tsx";
import { AuthContextProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
