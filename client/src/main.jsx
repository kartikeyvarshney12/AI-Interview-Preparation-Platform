import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/responsive.css";
import "./styles/dashboard.css";
import "./styles/cards.css";
import "./styles/chart.css";
import "./styles/table.css";
import "./styles/result.css";
import "./styles/loading.css";
import "./styles/auth.css";
import "./styles/upload.css";
import "./styles/interview.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);