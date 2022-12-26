import React, { useState, useContext, useCallback, useEffect } from "react";
import { Form, Input } from "antd";
import { Button, Block, Loader } from "components";
import { UserOutlined, CloudServerOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthContext from "utils/Auth";
import { useHttp } from "hooks/http.hook";
import { openNotification } from "utils";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./ChangeData.scss";

const ChangeData = () => {
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const fetchAccount = useCallback(async () => {
    try {
      await request("/api/player/me", "GET", null, {
        Authorization: `Bearer ${auth.token}`,
      }).then((res) => {
        setFormData({
          nickname: res?.player?.nickname,
          region: res?.player?.region,
        });
        setIsLoading(true);
      });
    } catch (e) {
      setIsLoading(true);
    }
  }, [request, auth]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const [formData, setFormData] = useState({
    nickname: "",
    region: "",
  });

  const changeHandlerData = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const dataHandler = async () => {
    try {
      await request(
        "/api/player/update",
        "PUT",
        { ...formData },
        { Authorization: `Bearer ${auth.token}` }
      );
      openNotification({ text: t("successful_data_change"), type: "success" });
      setTimeout(() => {
        history("/account");
      }, 1000);
    } catch (e) {
      openNotification({
        title: t("dsta_change_error"),
        text: t("something_went_wrong_try_again"),
        type: "error",
      });
    }
  };

  return isLoading ? (
    <section className="change">
      <div className="change__content">
        <div>
          <div className="change__top">
            <h2>{t("сhange_data")}</h2>
            <p>{t("Сhange_of_nickname_and_server")}</p>
          </div>
          <Block>
            <img className="background_change" src={DotGrid}></img>
            <Form name="normal_login" className="login-form">
              <Form.Item hasFeedback>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  type="nickname"
                  placeholder={t("nickname")}
                  size="large"
                  name="nickname"
                  value={formData.nickname}
                  onChange={changeHandlerData}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={
                    <CloudServerOutlined className="site-form-item-icon" />
                  }
                  type="region"
                  placeholder={t("server")}
                  size="large"
                  name="region"
                  value={formData.region}
                  onChange={changeHandlerData}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={dataHandler}
                  disabled={loading}
                >
                  {t("change")}
                </Button>
              </Form.Item>
              <Link className="auth register-link" to="/account">
                {t("back")}
              </Link>
            </Form>
          </Block>
        </div>
      </div>
    </section>
  ) : (
    <Loader />
  );
};

export default ChangeData;