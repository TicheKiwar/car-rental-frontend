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
    motor_number: string;//nuevo
    chasis_number: string;//nuevo

    //Reservation

    rental_date: string;//modificado
    rental_days: number;//modificado

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
    //Vehicle
    model_id: number;
    model_name: string;
    brand_name: string;
    
    //Vehicle_Detail
    vehicle_id_detail: number;
    scratches:boolean;
    dents:boolean;
    lights:boolean;
    tires:boolean;
    windshield:boolean;
    mirrors:boolean;
    foreign_fluids:boolean;
    brakes:boolean;
    documents:boolean;
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
    //totalDays: number;
    rentalStatus: string;
    finalFuelLevel: number;
    //finalStatus: string;
    vehicleStatus: string;
    fuelCost: number;
    costDayDelay: number;
    costPerDamages: number;
    //vehicle status
    scratches: boolean;
    dents: boolean;
    lights: boolean;
    tires: boolean;
    windshield: boolean;
    mirrors: boolean;
    foreign_fluids: boolean;
    brakes: boolean;
    documents: boolean;
  }

  export interface ReturnCosts {
    returnId: number;
    cost_day_delay: number;
    cost_per_damages: number;
    returnDate: string; // Si se requiere una fecha, puede ser Date en vez de string.
    fuel_cost: number;
    observations: string;
    rentalId: number;
    rentalStatus: string;
    vehicleId: number;
    clientId: number;
    clientDni: string;
    clientFirstName: string;
    clientLastName: string;
    clientPhone: string;
    clientAddress: string;
    mileage: number;
    motor_number: string;
    chasis_number: string;
    scratches: boolean;
    dents: boolean;
    lights: boolean;
    tires: boolean;
    windshield: boolean;
    mirrors: boolean;
    foreignFluids: boolean;
    brakes: boolean;
    documents: boolean;
}