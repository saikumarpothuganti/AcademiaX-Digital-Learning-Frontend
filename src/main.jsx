import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "flatpickr/dist/flatpickr.css";
import "jsvectormap/dist/jsvectormap.css";
import "simplebar-react/dist/simplebar.min.css";
import "swiper/swiper-bundle.css";
import App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
