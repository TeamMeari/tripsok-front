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
                <Input
                    onChange={handleEmailChange} 
                    placeholder="touang@example.com"
                    maxLength={320}
                    value={email}
                    rightElement={email && <ResetButton onClick={() => setEmail("")}/>}
                />
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

const ResetButton = ({ onClick }: { onClick: () => void }) => {
    return <button className={styles.resetButton} onClick={onClick}>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.46875 16.9297C7.35417 16.9297 6.3099 16.7188 5.33594 16.2969C4.36198 15.8802 3.50521 15.3021 2.76562 14.5625C2.02604 13.8229 1.44531 12.9661 1.02344 11.9922C0.606771 11.0182 0.398438 9.97396 0.398438 8.85938C0.398438 7.74479 0.606771 6.70052 1.02344 5.72656C1.44531 4.7474 2.02604 3.89062 2.76562 3.15625C3.50521 2.41667 4.36198 1.83854 5.33594 1.42188C6.3099 1 7.35417 0.789062 8.46875 0.789062C9.58333 0.789062 10.6276 1 11.6016 1.42188C12.5807 1.83854 13.4401 2.41667 14.1797 3.15625C14.9193 3.89062 15.4974 4.7474 15.9141 5.72656C16.3359 6.70052 16.5469 7.74479 16.5469 8.85938C16.5469 9.97396 16.3359 11.0182 15.9141 11.9922C15.4974 12.9661 14.9193 13.8229 14.1797 14.5625C13.4401 15.3021 12.5807 15.8802 11.6016 16.2969C10.6276 16.7188 9.58333 16.9297 8.46875 16.9297ZM6.10938 12.5859C6.27083 12.5859 6.40104 12.5521 6.5 12.4844C6.59896 12.4167 6.71094 12.2943 6.83594 12.1172L8.42969 9.82812H8.46875L10.0469 12.1172C10.1667 12.2943 10.2786 12.4167 10.3828 12.4844C10.487 12.5521 10.6146 12.5859 10.7656 12.5859C10.9844 12.5859 11.1615 12.5234 11.2969 12.3984C11.4375 12.2682 11.5078 12.099 11.5078 11.8906C11.5078 11.7135 11.4427 11.5417 11.3125 11.375L9.42188 8.79688L11.3281 6.21875C11.4583 6.04688 11.5234 5.8724 11.5234 5.69531C11.5234 5.4974 11.4557 5.33594 11.3203 5.21094C11.1849 5.08073 11.013 5.01562 10.8047 5.01562C10.6536 5.01562 10.5234 5.04948 10.4141 5.11719C10.3047 5.1849 10.2005 5.30469 10.1016 5.47656L8.5625 7.76562H8.51562L6.94531 5.46875C6.83073 5.30208 6.71875 5.1849 6.60938 5.11719C6.50521 5.04948 6.3724 5.01562 6.21094 5.01562C6.00781 5.01562 5.83333 5.08333 5.6875 5.21875C5.54688 5.35417 5.47656 5.52083 5.47656 5.71875C5.47656 5.90104 5.54688 6.08594 5.6875 6.27344L7.50781 8.76562L5.58594 11.3984C5.46615 11.5703 5.40625 11.7422 5.40625 11.9141C5.40625 12.1068 5.47135 12.2682 5.60156 12.3984C5.73698 12.5234 5.90625 12.5859 6.10938 12.5859Z" fill="#666666"/>
        </svg>
    </button>
}

export default LoginPage;