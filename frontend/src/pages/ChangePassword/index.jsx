import React, { useState, useContext } from "react";
import { Form, Input } from "antd";
import { Button, Block } from "components";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AuthContext from "utils/Auth";
import { openNotification } from "utils";
import { useHttp } from "hooks/http.hook";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./ChangePassword.scss";

const ChangePassword = () => {
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const { t } = useTranslation();

  const [changePassword, setChangePassword] = useState({
    password: "",
    new_password: "",
    new_password_repeat: "",
  });

  const changePasswordHandler = (event) => {
    setChangePassword({
      ...changePassword,
      [event.target.name]: event.target.value,
    });
  };

  const changePasswordButtonHandler = async () => {
    try {
      if (changePassword.new_password !== changePassword.new_password_repeat) {
        openNotification({
          title: t("password_change_error"),
          text: t("passwords_do_not_match"),
          type: "error",
        });
      } else {
        await request(
          "api/player/update/password",
          "PUT",
          {
            password: changePassword.password,
            new_password: changePassword.new_password,
          },
          { Authorization: `Bearer ${auth.token}` }
        );
        openNotification({
          text: t("successful_password_change"),
          type: "success",
        });
        setTimeout(() => {
          history("/account");
        }, 1000);
      }
    } catch (e) {
      openNotification({
        title: t("password_change_error"),
        text: t("old_password_entered_incorrectly"),
        type: "error",
      });
    }
  };

  return (
    <section className="password">
      <div className="password_content">
        <div className="password__top">
          <h2>{t("change_password")}</h2>
          <p>{t("you_can_change_your_old_password_if_necessary")}</p>
        </div>
        <Block>
          <img className="background_auth" src={DotGrid}></img>
          <Form name="normal_password" className="password-form">
            <Form.Item>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder={t("password")}
                size="large"
                name="password"
                value={changePassword.password}
                onChange={changePasswordHandler}
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder={t("password_repeat")}
                size="large"
                name="new_password"
                value={changePassword.new_password}
                onChange={changePasswordHandler}
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder={t("new_password_repeat")}
                size="large"
                name="new_password_repeat"
                value={changePassword.new_password_repeat}
                onChange={changePasswordHandler}
              />
            </Form.Item>
            <div>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={changePasswordButtonHandler}
                disabled={loading}
              >
                {t("change_password")}
              </Button>
            </div>
          </Form>
        </Block>
      </div>
    </section>
  );
};

export default ChangePassword;