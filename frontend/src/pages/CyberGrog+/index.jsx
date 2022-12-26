import React, { useCallback, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "antd";

import { Button, Block, Loader } from "components";
import { AuthContext } from "utils";
import { useHttp } from "hooks/http.hook";

import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./CyberGrog+.scss";

const Subscribe = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [isLoading, setIsLoading] = useState(false);

  const randGen = () => {
    const abc =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let random = "";
    while (random.length < 100) {
      random += abc[Math.floor(Math.random() * abc.length)];
    }
    return random;
  };

  const fetchAccount = useCallback(async () => {
    try {
      await request("/api/player/me", "GET", null, {
        Authorization: `Bearer ${auth.token}`,
      }).then((res) => {
        setIsLoading(true);
      });
    } catch (e) {
      setIsLoading(true);
    }
  }, [request, auth]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const subscriptionHandler = async (dayOfSubscribe, price, name, key) => {
    try {
      await request(
        "/api/player/payment",
        "PUT",
        {
          ...{ dayOfSubscribe, price, name, key },
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      ).then(async (res) => {
        window.location.href = res.data;
      });
    } catch (e) {}
  };

  return isLoading ? (
    <section className="subscribe">
      <Form className="subscribe_content">
        <div className="auth__top">
          <h2>HEADER</h2>
        </div>
        <div className="row_subscribe">
          <img className="background_subscribe" src={DotGrid}></img>
          <Block>
            <div className="subscribe_block">
              <h2 className="subscribe_block-month">1 {t("month")}</h2>
              <h3>
                280<span>₴</span>
              </h3>
              <p>{t("more_detailed")}</p>
              <p>{t("blood_pressure")}</p>
              <Button
                onClick={() => {
                  subscriptionHandler(30, 280, "Subscribe", randGen());
                }}
              >
                {t("buy")}
              </Button>
            </div>
          </Block>
          <Block>
            <div className="subscribe_block">
              <h2 className="subscribe_block-halfyear">6 {t("months")}</h2>
              <h3>
                1500<span>₴</span>
              </h3>
              <p>{t("more_detailed")}</p>
              <p>{t("blood_pressure")}</p>
              <Button
                onClick={() => {
                  subscriptionHandler(180, 1500, "Subscribe", randGen());
                }}
              >
                {t("buy")}
              </Button>
            </div>
          </Block>
          <Block>
            <div className="subscribe_block">
              <h2 className="subscribe_block-year">1 {t("year")}</h2>
              <h3>
                2800<span>₴</span>
              </h3>
              <p>{t("more_detailed")}</p>
              <p>{t("blood_pressure")}</p>
              <Button
                onClick={() => {
                  subscriptionHandler(365, 2800, "Subscribe", randGen());
                }}
              >
                {t("buy")}
              </Button>
            </div>
          </Block>
        </div>
      </Form>
    </section>
  ) : (
    <Loader />
  );
};

export default Subscribe;