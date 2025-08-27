import styles from "./LoginPage.module.css";
import Input from "../components/common/Input";
import { useState } from "react";
import PasswordInput from "../components/feature/Input/PasswordInput";
import ValidationBtn from "../components/common/Button/ValidationBtn";
import { NOT_EXISTING_EMAIL, INCORRECT_PASSWORD } from "../types/loginErrors";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const isLoginValid = email !== "" && password !== "";

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError("");
    };

    const handleLogin = () => {
        // 로그인 로직
        setEmailError(NOT_EXISTING_EMAIL);
        setPasswordError(INCORRECT_PASSWORD);
    };
    
    return <div className={styles.page}>
        <h2 className={styles.message}>
            투앙으로 더 편하게<br />
            강릉을 여행해요
        </h2>
        <div className={styles.barLogin}>
            <div className={styles.inputContainer}>
                <Input onChange={handleEmailChange}  placeholder="touang@example.com" maxLength={320} />
                {emailError && <p className={styles.error}>{emailError}</p>}
            </div>
            <div className={styles.inputContainer}>
                <PasswordInput onChange={handlePasswordChange} placeholder="영문, 숫자, 특수문자 포함 8 - 20자" />
                {passwordError && <p className={styles.error}>{passwordError}</p>}
            </div>
            <ValidationBtn isDisabled={!isLoginValid} onClick={handleLogin}>로그인</ValidationBtn>
        </div>
        <div className={styles.linkContainer}>
            <a href="#" className={styles.link}>비밀번호 재설정</a>
            <div className={styles.divider} />
            <a href="/signup" className={styles.link}><span>회원가입</span></a>
        </div>
        <div className={styles.orContainer}>
            <div className={styles.divider} />
            <span>or</span>
            <div className={styles.divider} />
        </div>
        <div className={styles.googleButtonContainer}>
            <button className={styles.googleButton}>
                <img src="/googleSignupButton.png" alt="google" />
            </button>
        </div>
    </div>
};

export default LoginPage;