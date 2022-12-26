import React, { useState, useContext } from "react";
import { Form, Input } from "antd";
import { Button, Block } from "components";
import { LockOutlined, MailOutlined, UserOutlined, CloudServerOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthContext from "utils/Auth";
import { useHttp } from "hooks/http.hook";
import { openNotification } from "utils";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./RegisterForm.scss";

const RegisterForm = () => {
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const { t } = useTranslation();

  const [formRegister, setFormRegister] = useState({
    email: "",
    password: "",
    nickname: "",
    region: ""
  });

  const [formRegisterPasswordRepeat, setFormRegisterPasswordRepeat] = useState({
    password_2: "",
  });

  const changeHandlerRegister = (event) => {
    setFormRegister({
      ...formRegister,
      [event.target.name]: event.target.value,
    });
  };

  const changeHandlerRegisterPasswordRepeat = (event) => {
    setFormRegisterPasswordRepeat({
      ...formRegisterPasswordRepeat,
      [event.target.name]: event.target.value,
    });
  };

  const registerHandler = async () => {
    try {
      if (formRegisterPasswordRepeat.password_2 !== formRegister.password) {
        openNotification({
          title: t("registration_error"),
          text: t("the_entered_passwords_do_not_match"),
          type: "error",
        });
      } else {
        const data = await request("/api/player/register", "POST", {
          ...formRegister,
        });
        auth.login(data.token);
        openNotification({
          text: t("registration_successful"),
          type: "success",
        });
        setTimeout(() => {
          history("/game");
        }, 1000);
      }
    } catch (e) {
      openNotification({
        title: t("registration_error"),
        text: t("all_fields_must_be_filled"),
        type: "error",
      });
    }
  };

  return (
    <section className="auth">
      <div className="auth__content">
        <div>
          <div className="auth__top">
            <h2>{t("register")}</h2>
            <p>{t("to_join_the_project_you_need_to_register")}</p>
          </div>
          <Block>
            <img className="background_auth" src={DotGrid}></img>
            <Form>
              <Form.Item hasFeedback>
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  name="email"
                  placeholder={t("e_mail")}
                  type="email"
                  icon={<MailOutlined />}
                  value={formRegister.email}
                  onChange={changeHandlerRegister}
                />
              </Form.Item>
              <Form.Item hasFeedback>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  name="nickname"
                  placeholder={t("nickname")}
                  type="nickname"
                  icon={<UserOutlined />}
                  value={formRegister.nickname}
                  onChange={changeHandlerRegister}
                />
              </Form.Item>
              <Form.Item hasFeedback>
                <Input
                  prefix={<CloudServerOutlined className="site-form-item-icon" />}
                  name="region"
                  placeholder={t("server")}
                  type="server"
                  icon={<CloudServerOutlined />}
                  value={formRegister.region}
                  onChange={changeHandlerRegister}
                />
              </Form.Item>
              <Form.Item hasFeedback>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  name="password"
                  placeholder={t("password")}
                  type="password"
                  icon={<LockOutlined />}
                  value={formRegister.password}
                  onChange={changeHandlerRegister}
                />
              </Form.Item>
              <Form.Item hasFeedback>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  name="password_2"
                  placeholder={t("password_repeat")}
                  type="password"
                  icon={<LockOutlined />}
                  value={formRegisterPasswordRepeat.password_2}
                  onChange={changeHandlerRegisterPasswordRepeat}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={registerHandler}
                  disabled={loading}
                >
                  {t("register")}
                </Button>
              </Form.Item>
              <Link className="auth register-link" to="/login">
                {t("log_in")}
              </Link>
            </Form>
          </Block>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;