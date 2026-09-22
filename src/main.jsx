import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./i18n";
import "./index.css";

import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: "http://localhost:8085/realms/academiax",
  client_id: "academiax-frontend",
  redirect_uri: "http://localhost:5173",
  post_logout_redirect_uri: "http://localhost:5173"
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <ThemeProvider>
        <LanguageProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
