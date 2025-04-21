import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setTimeout(() => {
      window.location.reload(); // Force reload to ensure translations are applied
    }, 100);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      value={selectedLanguage}
      className="ml-4 p-2 border rounded"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="gu">ગુજરાતી</option>
    </select>
  );
};

export default LanguageSwitcher;
