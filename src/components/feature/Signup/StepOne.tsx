import { useCallback, useState } from "react";
import styles from "../../../pages/SignupPage.module.css";
import { INVALID_EMAIL, EXISTING_EMAIL } from "../../../types/signupErrors";
import { validateEmail } from "../../../utils/validation";
import ValidationBtn from "../../common/Button/ValidationBtn";
import Input from "../../common/Input";

interface StepOneProps {
    onSubmit: (email: string) => void;
}

const StepOne = ({ onSubmit }: StepOneProps) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // 이메일 입력 인증
    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError(validateEmail(newEmail) ? "" : INVALID_EMAIL);
    }, []);

    // 이메일 코드 보내기
    const handleEmailVerification = useCallback(() => {
        // 이메일 인증 api 요청
        if (email === "meari@gmail.com") {
            setEmailError(EXISTING_EMAIL);
        } else {
            onSubmit(email);
        }
    }, [email]);

    return <div className={styles.step}>
        <p className={styles.message}>나만의 여정을 저장할<br />계정을 만들게요</p>
        <div className={styles.content}>
            <div className={styles.inputContainer}>
                <Input onChange={handleEmailChange} value={email} placeholder="이메일 주소를 입력하세요." maxLength={320}/>
                {emailError && <div className={styles.errorContainer}>
                    <p className={styles.error}>{emailError}</p>
                    {emailError === EXISTING_EMAIL && <a href="/login" className={styles.link}>로그인</a>}
                </div>}
            </div>
            <ValidationBtn isDisabled={!validateEmail(email)} onClick={handleEmailVerification}>이메일 인증</ValidationBtn>
        </div>
    </div>;
};

export default StepOne;