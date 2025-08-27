import { ChevronRightIcon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { PASSWORD_VALIDATION_WARNING, PASSWORD_CONFIRM_ERROR } from "../../../types/signupErrors";
import CheckBox from "../../common/CheckBox";
import Input from "../../common/Input";
import styles from "../../../pages/SignupPage.module.css";
import PasswordInput from "../Input/PasswordInput";
import ValidationBtn from "../../common/Button/ValidationBtn";
import { validatePassword } from "../../../utils/validation";

interface StepThreeProps {
    onSubmit: (nickname: string) => void;
    emailVerifyToken: string;
    goStepFour: () => void;
    goStepFive: () => void;
}

const StepThree = ({ onSubmit, emailVerifyToken, goStepFour, goStepFive }: StepThreeProps) => {
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
    const [nicknameVisible, setNicknameVisible] = useState(false);
    const [termAndPrivacyVisible, setTermAndPrivacyVisible] = useState(false);
    
    // 비밀번호
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value.trim());
    }, [])

    const handlePasswordConfirmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(e.target.value.trim());
    }, []);

    const passwordConfirmSuccess = password !== "" && password === passwordConfirm;

    // 닉네임
    const NICKNAME_MAX_LENGTH = 15;
    const [nickname, setNickname] = useState("");
    const [nicknameError, setNicknameError] = useState("");

    const handleNicknameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value.slice(0, NICKNAME_MAX_LENGTH));
    }, []);

    // 약관 동의
    const [termsChecked, setTermsChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);

    const handleTermsChecked = useCallback(() => {
        setTermsChecked(prev => !prev);
    }, []);
    const handlePrivacyChecked = useCallback(() => {
        setPrivacyChecked(prev => !prev);
    }, []);

    // 회원가입 제출
    const handleSubmit = useCallback(() => {
        // 회원가입 api 요청
        onSubmit(nickname);
    }, [nickname]);

    const passwordValid = validatePassword(password);
    const passwordConfirmValid = passwordConfirm !== "" && password === passwordConfirm;
    const nicknameValid = nickname.length > 0 && nickname.length <= NICKNAME_MAX_LENGTH;

    const validateInfo =
        passwordValid &&
        passwordConfirmValid &&
        nicknameValid &&
        termsChecked && privacyChecked;

    useEffect(() => {
        const passwordError = PASSWORD_VALIDATION_WARNING(password);
        setPasswordError(passwordError);
        if (passwordConfirm !== "" && password !== passwordConfirm) {
            setPasswordConfirmError(PASSWORD_CONFIRM_ERROR);
        }
        if (passwordError === "") {
            setPasswordConfirmVisible(true);
        }
    }, [password])

    useEffect(() => {
        if (passwordConfirm !== "" && password !== passwordConfirm) {
            setPasswordConfirmError(PASSWORD_CONFIRM_ERROR);
        } else {
            setPasswordConfirmError("");
            setNicknameVisible(true);
        }
    }, [passwordConfirm])

    useEffect(() => {
        if (nickname.length > 0 && nickname.length <= NICKNAME_MAX_LENGTH) {
            setNicknameError("");
            setTermAndPrivacyVisible(true);
        }
    }, [nickname])
    
    return <div className={styles.step}>
        <p className={styles.message}>이메일 인증에 성공했어요.<br />가입을 이어갈게요</p>
        <div className={styles.content}>
            <div className={styles.inputContainer}>
                <PasswordInput onChange={handlePasswordChange} placeholder="비밀번호를 입력하세요."/>
                {password ? 
                (passwordError ? <p className={styles.error}>{passwordError}</p> : <p className={styles.success}>필수 조건 만족</p>)
                : <p className={styles.guide}>영문, 숫자, 특수문자 포함 8 - 20자</p>}
            </div>
            {passwordConfirmVisible && <div className={styles.inputContainer}>
                <PasswordInput onChange={handlePasswordConfirmChange} placeholder="비밀번호를 다시 입력하세요." />
                {passwordConfirmError !== "" && <p className={styles.error}>{passwordConfirmError}</p>}
                {passwordConfirmSuccess && <p className={styles.success}>비밀번호 일치</p>}
            </div>}
            {nicknameVisible && <div className={styles.inputContainer}>
                <Input onChange={handleNicknameChange} value={nickname} placeholder="15자 이내 문자, 숫자 닉네임"/>
                {nicknameError && <p className={styles.error}>{nicknameError}</p>}
            </div>}
            {termAndPrivacyVisible && <div className={styles.checkboxContainer}>
                <div className={styles.checkboxItem}>
                    <CheckBox checked={termsChecked} disabled={false} onClick={handleTermsChecked} />
                    <button onClick={goStepFour} className={styles.documentButton}><label>(필수) 이용 약관 동의</label><ChevronRightIcon color="#ABB0BA" size={16} /></button>
                </div>
                <div className={styles.checkboxItem}>
                    <CheckBox checked={privacyChecked} disabled={false} onClick={handlePrivacyChecked} />
                    <button onClick={goStepFive} className={styles.documentButton}><label>(필수) 개인정보 수집 및 이용 동의</label><ChevronRightIcon color="#ABB0BA" size={16} /></button>
                </div>
            </div>}
            <div className={styles.buttonFixedTab}>
                <ValidationBtn isDisabled={!validateInfo} onClick={handleSubmit}>회원가입</ValidationBtn>
            </div>
        </div>
    </div>
}

export default StepThree;