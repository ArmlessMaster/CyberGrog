import React, { useContext } from "react";
import { Button } from "components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthContext from "utils/Auth";
import { useHttp } from "hooks/http.hook";
import { MainBackground } from "images";

import "./Main.scss";

const Main = () => {
  const history = useNavigate();
  const { loading } = useHttp();
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  
  const startHandler = () => {
    auth.token !== null ? history("/game") : history("/login");
  };

  return (
    <section>
      <img className="background_main" src={MainBackground}></img>
      <div className="container_main">
        <div className="logo_main">
          <p>
            <span>{t("welcome")}</span>
          </p>
        </div>
        <div className="container_information_main">
          <div className="information_text_main">
            <p>
              <span>{t("idol_and_apostle")}</span>
            </p>
          </div>
          <div className="information_text_main">
            <p>
              <span>{t("gameplay_to_improve_their_productivity")}</span>
            </p>
          </div>
          <div className="information_text_main">
            <p>
              <span>{t("roll_out_your_barrel")}</span>
            </p>
          </div>
        </div>
        <div className="container_button_main">
          <div className="button_main">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              onClick={startHandler}
              disabled={loading}
            >
              {t("get_start")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;