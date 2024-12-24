import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import Link from "antd/es/typography/Link";
import { useNavigate } from "react-router-dom";
import { forgotPasswordEmail } from "../services/login.service";

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      console.log("Email enviado a:", values.email);
      await forgotPasswordEmail(values.email);
      message.success("Se ha enviado un enlace de recuperación a tu correo.");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al enviar el enlace. Inténtalo de nuevo.";
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
        backgroundColor: "#f9f9f9",
      }}
    >
      <div
        style={{
          width: 400,
          padding: 32,
          borderRadius: 12,
          background: "#ffffff",
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Recuperar Contraseña</Title>
          <Text>Introduce tu correo electrónico para recibir un enlace de recuperación.</Text>
        </div>

        <Form
          name="forgot-password"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: "Por favor ingresa tu correo electrónico" },
              { type: "email", message: "Por favor ingresa un correo válido" },
            ]}
          >
            <Input placeholder="Ingresa tu correo electrónico" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
            >
              Enviar enlace de recuperación
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text>
            ¿Recordaste tu contraseña?{" "}
            <Link onClick={() => navigate("/")}>Inicia Sesión</Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;