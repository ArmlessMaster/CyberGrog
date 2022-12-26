import React from "react";
import { useTranslation } from "react-i18next";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./Manual.scss";

const Main = () => {
  const { t } = useTranslation();

  return (
    <section>
      <img className="background_manual" src={DotGrid}></img>
      <div className="container_manual">
        <div className="logo_manual">
          <p>{t("manual_for_the_use_of_sensors")}</p>
        </div>
        <div className="rectangl_manual"></div>
        <div className="container_information_manual">
          <div className="information_logo_manual">
            <p>1. {t("purchase")};</p>
            <p>2. {t("сonnect")};</p>
            <p>3. {t("put_on_the_sensors")};</p>
            <p>4. {t("after_the_end")};</p>
            <p>*{t("please_note_that_data")}.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;