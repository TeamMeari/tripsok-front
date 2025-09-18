import { useState, useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import Input from "../../components/common/Input";
import { useApi } from "../../hooks/useApi";
import { INVALID_EMAIL, EXISTING_EMAIL } from "../../types/signupErrors";
import { validateEmail } from "../../utils/validation";
import { useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css";
import { useSignupStore } from "../../stores/signupStores";
import { Link } from "react-router-dom";

const EmailPage = () => {
    const { t } = useTranslation();
    const { apiCall, isLoading } = useApi();
    const { email, setEmail } = useSignupStore();
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();
    
    // 이메일 입력 인증
    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError(validateEmail(newEmail) ? "" :INVALID_EMAIL);
    }, []);

    // 이메일 코드 보내기
    const handleEmailVerification = useCallback(() => {
        if (!email) return;
        apiCall("/auth/email/send", "POST", { email }).then(response => {
            if (response.status === 204) {
                navigate("/signup/email/2");
            } else {
                setEmailError(EXISTING_EMAIL);
            }
        });
    }, [email, navigate]);

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <p className={styles.message}>
                    <Trans i18nKey="createAccount" components={{ br: <br /> }} />
                </p>
                <div className={styles.content}>
                    <div className={styles.inputContainer}>
                        <Input
                            onChange={handleEmailChange}
                            value={email}
                            placeholder={t("emailAddress")}
                            maxLength={320}
                        />
                        {emailError && (
                            <div className={styles.errorContainer}>
                                <p className={styles.error}>{t(emailError)}</p>
                                {emailError === EXISTING_EMAIL && (
                                    <Link to="/login" className={styles.link}>
                                        {t("login")}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    <ValidationBtn
                        isDisabled={!validateEmail(email || "") || isLoading}
                        onClick={handleEmailVerification}
                    >
                        {t("emailVerification")}
                    </ValidationBtn>
                </div>
            </div>
        </div>
    );
}

export default EmailPage;