import React from "react";
import { Form, Input } from "antd";

const FormField = ({ name, placeholder, icon, type }) => {
  return (
    <Form.Item>
      <Input
        prefix={icon}
        type={type}
        placeholder={placeholder}
        size="large"
        name={name}
      />
    </Form.Item>
  );
};

export default FormField;