import { message } from "antd";

export const validatePhone = (_, value) => {
    const regex = /^09\d{8}$/;
    return !value || regex.test(value) ? Promise.resolve() : Promise.reject('El número telefonico no es válido');
};

export const validateName = (_, value) => {
    const regex = /^[a-zA-Z\s]+$/;
    return !value || regex.test(value) ? Promise.resolve() : Promise.reject('Ingrese un nombre válido');
};

export const validateDni = (dni: string) => {
    if (dni.length !== 10) return false;
    if (dni === "2222222222") return false;
    const digits = dni.split('').map(Number);
    const lastDigit = digits.pop()!;

    const sum = digits.reduce((acc, val, idx) => {
        return acc + (idx % 2 === 0 ? (val * 2 > 9 ? val * 2 - 9 : val * 2) : val);
    }, 0);
    const validator = 10 - (sum % 10);
    return lastDigit === (validator === 10 ? 0 : validator);
};

export const validateEmailOrDni = (emailExists: boolean, dniExists: boolean): boolean => {
    if (emailExists) {
        message.error('El correo electrónico ya está en uso. Por favor elige otro.');
        return true;
    }

    if (dniExists) {
        message.error('El C.I. ya está en uso. Por favor elige otro.');
        return true;
    }
    return false;
};

export const validateMotorOrChasis = (motorExists: boolean, chasisExists: boolean): boolean => {
    if (motorExists) {
        message.error('El motor ya está en uso por otro vehículo. Por favor elige otro.');
        return true;
    }

    if (chasisExists) {
        message.error('El chasis ya está en uso por otro vehículo. Por favor elige otro.');
        return true;
    }
    return false;
};

export const validatePlate = (plateExists: boolean): boolean => {
    if (plateExists) {
        message.error('Ya existe un vehículo con esta placa. Por favor elige otra.');
        return true;
    }

    return false;
};