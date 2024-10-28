// validations.js
export const validatePhone = (_, value) => {
    const regex = /^09\d{8}$/;
    return !value || regex.test(value) ? Promise.resolve() : Promise.reject('El teléfono debe tener 10 dígitos y comenzar con 09');
};

export const validateName = (_, value) => {
    const regex = /^[a-zA-Z\s]+$/;
    return !value || regex.test(value) ? Promise.resolve() : Promise.reject('El nombre solo puede contener letras');
};
