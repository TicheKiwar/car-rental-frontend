export const validatePhone = (_, value) => {
    const regex = /^09\d{8}$/;
    return !value || regex.test(value) ? Promise.resolve() : Promise.reject('El número telefonico no es válido');
};

export const validateName = (_, value) => {
    const regex = /^[a-zA-Z\s]+$/;
    return !value || regex.test(value) ? Promise.resolve() : Promise.reject('Ingrese un nombre válido');
};