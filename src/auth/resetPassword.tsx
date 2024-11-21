import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { recoverPassword } from "../services/login.service";

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("Token no válido o faltante");
      }

      await recoverPassword(
        token,
        values.password
      );

      message.success("Contraseña restablecida correctamente.");
      navigate("/");
    } catch (error: any) {
      console.error("Error al restablecer la contraseña:", error);
      message.error(error.response?.data?.message || "No se pudo restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Error en el formulario:", errorInfo);
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
          <Title level={3}>Restablecer Contraseña</Title>
          <Text>Introduce tu nueva contraseña para tu cuenta.</Text>
        </div>

        <Form
          name="reset-password"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="password"
            label="Nueva Contraseña"
            rules={[
              { required: true, message: "Por favor ingresa tu nueva contraseña" },
              { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
            ]}
          >
            <Input.Password placeholder="Ingresa tu nueva contraseña" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Por favor confirma tu nueva contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Las contraseñas no coinciden."));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirma tu nueva contraseña" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
            >
              Restablecer Contraseña
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
