import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../utils/utils.util";
import { login } from "../services/login.service";
import { getUserById } from "../services/user.service";

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data }: { data: any } = await login(values);
      localStorage.setItem('authToken', data.data.accessToken);
      const userId = getUserId();
      
      if(userId != null){
        const dataUser: any = await getUserById(userId);
        
        if(dataUser){
        message.success('Inicio de sesión exitoso');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
