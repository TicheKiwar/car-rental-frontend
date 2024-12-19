export interface Rental {
    rental_id: number;
    reservation_id: number;
    employee_id: number;
    initial_status: string;
    initial_mileage: number;
    final_mileage: number;
    total_days: number;
    total_cost: number;
    rental_status: string;
    final_fuel_level: number;
    final_status: string;
    initial_fuel_level: number;
  }
  