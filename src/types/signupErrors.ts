// 이메일 인증
export const INVALID_EMAIL = "존재하지 않는 메일 형식입니다."
export const EXISTING_EMAIL = "기존 계정이 존재합니다."

// 인증 코드
export const EXPIRED_CODE = "유효한 시간이 지났습니다."
export const INVALID_CODE = "인증 코드가 일치하지 않습니다."

// 비밀번호
export const PASSWORD_VALIDATION_WARNING = (password: string) => {
    if (password.length < 8) {
        return "비밀번호는 8자 이상이어야 합니다."
    }
    const notExisting = [];
    if (!password.match(/[a-zA-Z]/)) {
        notExisting.push("영문");
    }
    if (!password.match(/[0-9]/)) {
        notExisting.push("숫자");
    }
    if (!password.match(/[@$!%*#?&]/)) {
        notExisting.push("특수문자");
    }
    if (notExisting.length > 0) {
        return `필수 조건 필요 - ${notExisting.join(", ")} 필수`
    }
    return "";
}
export const PASSWORD_CONFIRM_ERROR = "비밀번호가 일치하지 않습니다."