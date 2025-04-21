import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const savedLanguage = localStorage.getItem("selectedLanguage") || "en";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json"  // Ensure the path is correct
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    }
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("selectedLanguage", lng);
});

export default i18n;
