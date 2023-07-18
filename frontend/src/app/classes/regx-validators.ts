export const VALIDATORS_REGX = {
    phoneNumber: /[1-9][0-9]{9}/,
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+))$/,
    name: /[a-zA-z]{2}/, // min length 2 for names
    password: /^(.{8,})$/ // minimum 8 characters
};
