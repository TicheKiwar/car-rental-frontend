import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./sign-in/page/sign-in";
import Menu from "./Home/menu";
import ListVehicle from "./catalog/components/catalog";
import VehicleManagement from "./Vehicles/vehicles";
import ModelManagement from "./Model/model";
import Login from "./auth/login";
import ForgotPassword from "./auth/forgotPassword";
import ResetPassword from "./auth/resetPassword";
import Home from "./Home/home"
function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Menu  />} /> */}
        <Route path="/" element={<Login/>} />
        <Route path="/" element={<Menu  />} />
        
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/password_reset" element={<ForgotPassword/>} />
        <Route path="/reset_password/:token" element={<ResetPassword/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/vehicle-management" element={<VehicleManagement />} />
        <Route path="/model-management" element={<ModelManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
