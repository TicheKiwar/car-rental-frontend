export const validateGreaterThanZero = (_, value) => {
    if (value <= 0) {
        return Promise.reject(new Error("El valor debe ser mayor a 0"));
    }
    return Promise.resolve();
};

export const validationRules = {
    licensePlate: [
        {
            required: true,
            message: "Ingrese la placa"
        },
        {
            pattern: /^[A-Za-z]{3}-\d{4}$/,
            message: "La placa debe tener el formato 'AAA-0001'"
        }
    ],
    type: [{ required: true, message: "Ingrese el tipo de vehículo" }],
    status: [{ required: true, message: "Seleccione el estado del vehículo" }],
    dailyRate: [
        { required: true, message: "Ingrese la tarifa diaria" },
        { 
            validator: (rule, value) => {
                if (value < 20 || value > 500) {
                    return Promise.reject(new Error("La tarifa diaria debe estar entre 20 y 500"));
                }
                return Promise.resolve();
            }
        },
        
    ],
    capacity: [
        { required: true, message: "Ingrese la capacidad" },
        { 
            validator: (rule, value) => {
                if (value < 1 || value > 20) {
                    return Promise.reject(new Error("La capacidad debe estar entre 1 y 20 personas"));
                }
                return Promise.resolve();
            }
        },
        
    ],
    maxSpeed: [
        { required: true, message: "Ingrese la velocidad máxima" },
        { 
            validator: (rule, value) => {
                if (value < 40 || value > 300) {
                    return Promise.reject(new Error("La velocidad máxima debe estar entre 0 y 300"));
                }
                return Promise.resolve();
            }
        },
        
    ],
    color: [{ required: true, message: "Ingrese el color del vehículo" }],
    transmission: [{ required: true, message: "Seleccione la transmisión" }],
    doorCount: [
        { required: true, message: "Ingrese el número de puertas" },
        {
            validator: (rule, value, callback) => {
                // Verificamos si hay un valor (no está vacío)
                if (value) {
                    if (value < 2 || value > 7) {
                        callback("El número de puertas debe ser entre 2 y 7");
                    } else {
                        callback(); // No hay error
                    }
                } else {
                    callback(); // No hacer nada si el campo está vacío
                }
            },
        },
    ],
    fuelType: [{ required: true, message: "Seleccione el tipo de combustible" }],
    mileage: [
        { required: true, message: "Ingrese el kilometraje" },
        { 
            validator: (rule, value) => {
                if (value < 0) {
                    return Promise.reject(new Error("El kilometraje debe ser un número positivo"));
                }
                return Promise.resolve();
            }
        },
    ],
    lastRevisionDate: [{ required: true, message: "Ingrese la fecha de última revisión" }],
    costDayDelay: [
        { required: true, message: "Ingrese el costo por día de retraso" },
        {
            validator: (rule, value, callback) => {
                if (value < 2 || value > 7) {
                    callback("El costo debe estra entre 20  a 500");
                }else {
                    callback(); // Validación correcta
                }
            }
        }
    ],
    modelId: [{ required: true, message: "Seleccione un modelo" }],
};

/*
<Form.Item
            label="Color"
            name="color"
            rules={validationRules.color}
          >
            <Select>
              <Option value="Red" style={{ backgroundColor: '#FF0000', color: '#FFFFFF' }}>Red</Option>
              <Option value="Blue" style={{ backgroundColor: '#0000FF', color: '#FFFFFF' }}>Blue</Option>
              <Option value="Green" style={{ backgroundColor: '#00FF00', color: '#000000' }}>Green</Option>
              <Option value="Yellow" style={{ backgroundColor: '#FFFF00', color: '#000000' }}>Yellow</Option>
              <Option value="Black" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>Black</Option>
              <Option value="White" style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>White</Option>
              <Option value="Orange" style={{ backgroundColor: '#FFA500', color: '#000000' }}>Orange</Option>
              <Option value="Purple" style={{ backgroundColor: '#800080', color: '#FFFFFF' }}>Purple</Option>
            </Select>
          </Form.Item>
*/ 