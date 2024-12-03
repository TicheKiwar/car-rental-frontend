
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
        { validator: validateGreaterThanZero },
    ],
    capacity: [
        { required: true, message: "Ingrese la capacidad" },
        { validator: validateGreaterThanZero },
    ],
    maxSpeed: [
        { required: true, message: "Ingrese la velocidad máxima" },
        { validator: validateGreaterThanZero },
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
        { validator: validateGreaterThanZero },
    ],
    lastRevisionDate: [{ required: true, message: "Ingrese la fecha de última revisión" }],
    costDayDelay: [
        { required: true, message: "Ingrese el costo por día de retraso" },
        {
            validator: (rule, value, callback) => {
                if (value < 10) {
                    callback("El valor debe ser mayor o igual a 10");
                } else if (value > 100) {
                    callback("El valor debe ser menor o igual a 100");
                } else {
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