import React, { useCallback, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Form, Result } from "antd";
import { Button, Block } from "components";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "utils";
import { useHttp } from "hooks/http.hook";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./Status.scss";

const Success = () => {
  const history = useNavigate();
  const { loading, request } = useHttp();
  const { t } = useTranslation();
  const { time, dayOfSubscribe, key } = useParams();
  const timeNow = new Date().getTime();
  const auth = useContext(AuthContext);

  const fetchAccount = useCallback(async () => {
    try {
      if (
        time &&
        key &&
        (key.length === 100) & (timeNow - time < 3600000) &&
        dayOfSubscribe < 366
      ) {
        await request("/api/player/me", "GET", null, {
          Authorization: `Bearer ${auth.token}`,
        }).then(async (res) => {
          const paymentKeys = res.player.paymentKeys;
          const allPaymentKeys = res.player.allPaymentKeys;
          if (!paymentKeys.includes(key) && allPaymentKeys.includes(key)) {
            await request(
              "/api/player/subscription",
              "PUT",
              { dayOfSubscribe: dayOfSubscribe, key: key },
              {
                Authorization: `Bearer ${auth.token}`,
              }
            );
          }
        });
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const successHandler = () => {
    history("/game");
  };

  return (
    <section className="canceled">
      <div className="canceled__content">
        <div>
          <Block>
            <img className="background_canceled" src={DotGrid}></img>
            <Form name="normal_login" className="login-form">
              <Result
                status="success"
                title={t("purchase_request")}
                subTitle={t("something_went_wrong")}
                extra={[
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    onClick={successHandler}
                    disabled={loading}
                  >
                    {t("continue")}
                  </Button>,
                ]}
              />
            </Form>
          </Block>
        </div>
      </div>
    </section>
  );
};

export default Success;