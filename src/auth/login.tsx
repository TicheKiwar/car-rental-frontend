import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../utils/utils.util";
import { login } from "../services/login.service";
import { getUserById } from "../services/user.service";
import Logo from "../assets/logo-car.png";

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data }: { data: any } = await login(values);
      localStorage.setItem("authToken", data.accessToken);
      const userId = getUserId();
      if (userId != null) {
        const dataUser: any = await getUserById(userId);
        console.log(dataUser.data.role);
        localStorage.setItem("userRole",JSON.stringify(dataUser.data.role))
        if (dataUser) {
          message.success("Inicio de sesión exitoso");
          if (dataUser.data.role.roleId === 3) {
            navigate("/home");
          } if (dataUser.data.role.roleId === 1) {
            navigate("/vehicle-management");
          } else {
            message.warning("No tienes acceso como cliente.");
          }
        }
      }
    } catch (error: any) {
      const errorMessage ="El usuario o la contraseña son incorrectos";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f9f9f9",
      }}
    >
      <div
        style={{
          width: 400,
          padding: 32,
          border: "1px solid #f0f0f0",
          borderRadius: 12,
          boxShadow: "0px 6px 16px rgba(0,0,0,0.1)",
          background: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: 130, marginBottom: 16 }}
          />
          <Title level={3} style={{ marginBottom: 0 }}>
            Iniciar Sesión
          </Title>
          <Text type="secondary">Bienvenido, inicia sesión para continuar</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              {
                required: true,
                message: "Por favor ingrese su correo electrónico",
                type: "email",
              },
            ]}
          >
            <Input placeholder="Ingresa tu correo electrónico" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "Por favor ingrese su contraseña" }]}
          >
            <Input.Password placeholder="Ingresa tu contraseña" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Recordarme</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
            >
              Iniciar sesión
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Link
              onClick={() => navigate("/password_reset")}
              style={{ fontSize: "14px" }}
            >
              Olvidé mi contraseña
            </Link>
          </div>

          <div style={{ textAlign: "center" }}>
            <Text>¿No tienes cuenta?</Text>{" "}
            <Link onClick={() => navigate("/register")}>Regístrate</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
