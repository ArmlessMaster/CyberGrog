import { React, useState } from "react";
import { useTranslation } from "react-i18next";

const Languages = () => {
  const { t } = useTranslation();

  const languages = [
    { value: "en", text: t("english") },
    { value: "ru", text: t("russian") },
    { value: "uk", text: t("ukrainian") },
  ];

  const handleChange = (e) => {
    setLang(e.target.value);
    const url = window.location.href;
    window.location.replace(
      url.substring(0, url.lastIndexOf("?")) + "?lng=" + e.target.value
    );
  };

  const [lang, setLang] = useState(
    localStorage.getItem("i18nextLng").length > 0
      ? localStorage.getItem("i18nextLng")
      : "en"
  );

  return (
    <div className="header__btns-wrapper language-btn">
      <select className="language-select" value={lang} onChange={handleChange}>
        {languages.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Languages;