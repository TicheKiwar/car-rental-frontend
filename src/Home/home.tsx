import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import Menu from "./menu";
import VehicleCatalog from "../catalog/components/catalog";

const Home: React.FC = () => {

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-200">
        <Menu />
      </div>
      <div className="flex-grow flex flex-col items-center p-4">
        <div className="w-2/3 min-h-[809px]">
          <VehicleCatalog />
        </div>
      </div>
    </div>
  );
};

export default Home;
