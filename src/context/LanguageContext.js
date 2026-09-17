import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
export const AVAILABLE_LANGUAGES = [
    { code: "en", name: "English", dir: "ltr" },
    { code: "ar", name: "العربية", dir: "rtl" },
    { code: "es", name: "Español", dir: "ltr" },
    { code: "de", name: "Deutsch", dir: "ltr" },
];
const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children, }) => {
    const { i18n } = useTranslation();
    const [language, setLanguageState] = useState(() => {
        const currentLng = (i18n.resolvedLanguage || i18n.language || "en");
        return AVAILABLE_LANGUAGES.some((lang) => lang.code === currentLng)
            ? currentLng
            : "en";
    });
    const currentLanguage = AVAILABLE_LANGUAGES.find((lang) => lang.code === language) ||
        AVAILABLE_LANGUAGES[0];
    const dir = currentLanguage.dir;
    useEffect(() => {
        const handleLanguageChanged = (lng) => {
            const matched = AVAILABLE_LANGUAGES.find((l) => l.code === lng);
            if (matched && matched.code !== language) {
                setLanguageState(matched.code);
            }
        };
        i18n.on("languageChanged", handleLanguageChanged);
        return () => {
            i18n.off("languageChanged", handleLanguageChanged);
        };
    }, [i18n, language]);
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = dir;
        localStorage.setItem("i18nextLng", language);
        localStorage.setItem("language", language);
    }, [language, dir]);
    const setLanguage = (code) => {
        i18n.changeLanguage(code);
        setLanguageState(code);
    };
    return (_jsx(LanguageContext.Provider, { value: {
            language,
            currentLanguage,
            dir,
            setLanguage,
            availableLanguages: AVAILABLE_LANGUAGES,
        }, children: children }));
};
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
