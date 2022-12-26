import React, { useState, useContext } from "react";
import { Form, Input } from "antd";
import { Button, Block } from "components";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthContext from "utils/Auth";
import { useHttp } from "hooks/http.hook";
import { openNotification } from "utils";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./LoginForm.scss";

const LoginForm = () => {
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const { t } = useTranslation();

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const changeHandlerLogin = (event) => {
    setFormLogin({ ...formLogin, [event.target.name]: event.target.value });
  };

  const loginHandler = async () => {
    try {
      const data = await request("/api/player/login", "POST", { ...formLogin });
      auth.login(data.token);
      openNotification({
        text: t("authorization_successful"),
        type: "success",
      });
      setTimeout(() => {
        history("/game");
      }, 1000);
    } catch (e) {
      openNotification({
        title: t("authorization_error"),
        text: t("invalid_username_or_password"),
        type: "error",
      });
    }
  };

  return (
    <section className="auth">
      <div className="auth__content">
        <div>
          <div className="auth__top">
            <h2>{t("sign_in")}</h2>
            <p>{t("please_sign_in")}</p>
          </div>
          <Block>
            <img className="background_auth" src={DotGrid}></img>
            <Form name="normal_login" className="login-form">
              <Form.Item hasFeedback>
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  type="email"
                  placeholder={t("e_mail")}
                  size="large"
                  name="email"
                  value={formLogin.email}
                  onChange={changeHandlerLogin}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder={t("password")}
                  size="large"
                  name="password"
                  value={formLogin.password}
                  onChange={changeHandlerLogin}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={loginHandler}
                  disabled={loading}
                >
                  {t("log_in")}
                </Button>
              </Form.Item>
              <Link className="auth register-link" to="/register">
                {t("register")}
              </Link>
            </Form>
          </Block>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;