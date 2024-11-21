import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./sign-in/page/sign-in";
import Login from "./login/login";
import Menu from "./Home/menu";
import ListVehicle from "./catalog/components/catalog";
import VehicleManagement from "./Vehicles/vehicles";
import BrandManagement from "./Brand/brand";
import ModelManagement from "./Model/model";
import Home from "./Home/home";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ModelManagement  />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
