import i18n from "../i18n";

// 이메일 인증
export const INVALID_EMAIL = () => i18n.t("invalidEmail");
export const EXISTING_EMAIL = () => i18n.t("existingAccount");

// 인증 코드
export const EXPIRED_CODE = () => i18n.t("expiredCode");
export const INVALID_CODE = () => i18n.t("codeMismatch");

// 비밀번호
export const PASSWORD_VALIDATION_WARNING = (password: string) => {
    if (password.length < 8) {
        return i18n.t("passwordTooShort");
    }
    const notExisting = [];
    if (!password.match(/[a-zA-Z]/)) {
        notExisting.push(i18n.t("letterRequired"));
    }
    if (!password.match(/[0-9]/)) {
        notExisting.push(i18n.t("numberRequired"));
    }
    if (!password.match(/[@$!%*#?&]/)) {
        notExisting.push(i18n.t("specialCharRequired"));
    }
    if (notExisting.length > 0) {
        return i18n.t("passwordValidationWarning", { condition: notExisting.join(", ") });
    }
    return "";
};

export const PASSWORD_CONFIRM_ERROR = () => i18n.t("passwordMismatch");
