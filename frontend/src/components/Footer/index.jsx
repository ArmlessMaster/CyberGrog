import React from "react";
import { useTranslation } from "react-i18next";

import "./Footer.scss";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <div className="footer__wrapper">
        <ul className="footer__menu">
          <li>{t("about_us")}</li>
          <li>{t("contacts")}</li>
          <li>{t("support")}</li>
        </ul>
      </div>
      <small className="footer__copy">{t("llc")}</small>
    </div>
  );
};

export default Footer;