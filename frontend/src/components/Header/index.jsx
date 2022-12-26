import { React } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Account, Languages } from "components";
import "./Header.scss";

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className="header">
      <div className="header__wrapper">
        <div className="header__logo">
          <Link to="/main">CG</Link>
        </div>
        <ul className="header__menu">
          <li>
            <Link to="/subscribe">CyberGrog+</Link>
          </li>
          <li>
            <Link to="/game">{t("game")}</Link>
          </li>
          <li>
            <Link to="/manual">{t("manual")}</Link>
          </li>
        </ul>
        <div className="header__btns">
          <Languages />
          <Account />
        </div>
      </div>
    </div>
  );
};

export default Header;