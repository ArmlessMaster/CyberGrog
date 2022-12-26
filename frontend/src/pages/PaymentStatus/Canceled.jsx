import { React } from "react";
import { useTranslation } from "react-i18next";
import { Form, Result } from "antd";
import { Button, Block } from "components";
import { useNavigate } from "react-router-dom";

import { useHttp } from "hooks/http.hook";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./Status.scss";

const Canceled = () => {
  const history = useNavigate();
  const { loading } = useHttp();
  const { t } = useTranslation();

  const canceledHandler = () => {
    history("/subscribe");
  };

  return (
    <section className="canceled">
      <div className="canceled__content">
        <div>
          <Block>
            <img className="background_canceled" src={DotGrid}></img>
            <Form name="normal_login" className="login-form">
              <Result
                status="error"
                title={t("canceled_your_purchase")}
                subTitle={t("something_went_wrong")}
                extra={[
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    onClick={canceledHandler}
                    disabled={loading}
                  >
                    {t("back")}
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

export default Canceled;