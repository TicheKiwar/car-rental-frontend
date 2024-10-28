import React from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: { email: string; password: string }) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Form
        name="login"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ width: 300, padding: 24, border: "1px solid #f0f0f0", borderRadius: 8, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Title level={3} style={{ textAlign: "center" }}>Iniciar sesión</Title>

        <Form.Item
          name="email"
          rules={[{ required: true, message: "Por favor ingrese su correo electrónico", type: "email" }]}
        >
          <Input placeholder="Correo electrónico" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Por favor ingrese su contraseña" }]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Recordarme</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Iniciar sesión
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Link href="#">Olvidé mi contraseña</Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text>¿No tienes cuenta?</Text>{" "}
          <Link onClick={() => navigate("/register")}>Regístrate</Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
