export interface IRental {
    rentalId: number;
    initialStatus: string;
    finalStatus: string | null;
    initialFuelLevel: number | null;
    finalFuelLevel: number | null;
    initialMileage: number;
    finalMileage: number | null;
    totalDays: number | null;
    totalCost: string;
    status: string;
  }