export interface ReturnDetails {

    rental_id: number;
    rental_status: string;
    inital_fuel_level: number;
    //Vehicle:
    vehicle_id: number;
    license_plate: string;
    color: string;
    status: string;
    image: string;
    daily_rate: number;
    cost_day_delay: number;
    mileage:number;
    //Reservation
    reservation_id: number;
    reservation_date: string;
    reservation_days: number;

    //Clientes
    client_id: number;
    client_dni: string;
    client_first_name: string;
    client_last_name: string;
    client_phone: string;
    client_address: string;
    //Employes
    employe_rental_id: number;
    employee_dni: string;
    employee_first_name: string;
    employee_last_name: string;
    employee_phone: string;
    model_id: number;
    model_name: string;
    brand_name: string;
}
// Definimos la interfaz ReturnDetails con las propiedades correspondientes
export interface InsertReturn {
    rentalId: number;
    employeeId: number;
    vehicleId: number;
    returnDate: string;
    returnTime: string;
    observations: string;
    finalMileage: number;
    totalDays: number;
    rentalStatus: string;
    finalFuelLevel: number;
    finalStatus: string;
    vehicleStatus: string;
    fuelCost: number;
    costDayDelay: number;
    costPerDamages: number;
  }
  