// 이메일 인증
export const INVALID_EMAIL = "invalidEmail";
export const EXISTING_EMAIL = "existingAccount";

// 인증 코드
export const EXPIRED_CODE = "expiredCode";
export const INVALID_CODE = "codeMismatch";

// 비밀번호
export const PASSWORD_VALIDATION_WARNING = (password: string): { error: string, conditions: string[] } => {
    if (password.length < 8) {
        return { error: "passwordTooShort", conditions: [] };
    }
    const notExisting = [];
    if (!password.match(/[a-zA-Z]/)) {
        notExisting.push("letterRequired");
    }
    if (!password.match(/[0-9]/)) {
        notExisting.push("numberRequired");
    }
    if (!password.match(/[@$!%*#?&]/)) {
        notExisting.push("specialCharRequired");
    }
    if (notExisting.length > 0) {
        return { error: "passwordValidationWarning", conditions: notExisting };
    }
    return { error: "", conditions: [] };
};

export const PASSWORD_CONFIRM_ERROR = "passwordMismatch";
