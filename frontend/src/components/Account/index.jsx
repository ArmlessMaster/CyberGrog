import React, { useContext } from "react";
import {
  UserOutlined,
  PoweroffOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { openNotification } from "utils";
import AuthContext from "utils/Auth";

const Account = () => {
  const auth = useContext(AuthContext);
  const history = useNavigate();
  const { t } = useTranslation();

  const loginHandler = async () => {
    try {
      history("/login");
    } catch (e) {}
  };

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history("/main");
    openNotification({
      title: t("logged_out"),
      type: "info",
    });
  };

  const items = [
    {
      key: "1",
      label: (
        <Link to="/account">
          <UserOutlined className="icon" />
          {" " + t("account")}
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/password">
          <LockOutlined className="icon" />
          {" " + t("change_password")}
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link onClick={logoutHandler}>
          <PoweroffOutlined className="icon" />
          {" " + t("logout")}
        </Link>
      ),
    },
  ];

  return (
    <div className="header__btns-wrapper account-btn">
      {auth.token !== null ? (
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Button
            className="account__icon"
            type="link"
            shape="circle"
            icon={
              <UserOutlined style={{ fontSize: "1.3vw", color: "white" }} />
            }
          />
        </Dropdown>
      ) : (
        <Button
          className="account__icon"
          type="link"
          shape="circle"
          icon={<UserOutlined style={{ fontSize: "1.3vw", color: "white" }} />}
          onClick={loginHandler}
        />
      )}
    </div>
  );
};

export default Account;