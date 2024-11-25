import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./sign-in/page/sign-in";
import VehicleManagement from "./Vehicles/vehicles";
import ModelManagement from "./Model/model";
import Login from "./auth/login";
import ForgotPassword from "./auth/forgotPassword";
import ResetPassword from "./auth/resetPassword";
import Home from "./Home/home";
import MainLayout from "./layout/MainLayout"

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas protegidas dentro del MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/password_reset" element={<ForgotPassword />} />
          <Route path="/reset_password/:token" element={<ResetPassword />} />
          <Route path="/vehicle-management" element={<VehicleManagement />} />
          <Route path="/model-management" element={<ModelManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
