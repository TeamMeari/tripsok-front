const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

export const validateEmail = (email: string) => {
    return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
    return passwordRegex.test(password);
};