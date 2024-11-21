import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDatos, fetchData } from "../services/catalog.service";
import ListVehicle from "../catalog/components/catalog";
import { VehicleType } from "../common/vehicle.type";
import Menu from "./menu";

const Home: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [datos, setDatos] = useState<VehicleType[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData().then(() => {
      setDatos(getDatos());
    });
  }, [navigate]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDataChange = () => {
    setReload(!reload);
  };

  const filteredData = datos.filter((item: VehicleType) => {
    const color = item.color?.toLowerCase() || '';
    const estado = item.estado?.toLowerCase() || '';
  
    return color.includes(searchText.toLowerCase()) || estado.includes(searchText.toLowerCase());
  });

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-200">
        <Menu />
      </div>
      <div className="flex-grow flex flex-col items-center p-4">
        <div className="w-2/3 min-h-[809px]">
          <ListVehicle data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default Home;
