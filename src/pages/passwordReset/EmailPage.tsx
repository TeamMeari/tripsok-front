import styles from "./passwordReset.module.css";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { validateEmail } from "../../utils/validation";
import { EXISTING_EMAIL, INVALID_EMAIL } from "../../types/signupErrors";
import { Link } from "react-router-dom";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import { useState, useCallback } from "react";
import Input from "../../components/common/Input";
import { usePasswordResetStore } from "../../stores/passwordResetStore";

const PasswordResetEmailPage = () => {
    const { t } = useTranslation();
    const { apiCall, isLoading } = useApi();
    const { email, setEmail } = usePasswordResetStore();
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
                navigate("/password/reset/code", {
                    state: { from: location.pathname },
                });
            } else {
                setEmailError(EXISTING_EMAIL);
            }
        });
    }, [email, navigate]);

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <h2 className={styles.message}>
                    <Trans i18nKey="emailForPasswordReset" components={{ br: <br /> }} />
                </h2>
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
                                <p className={`caption ${styles.error}`}>{t(emailError)}</p>
                                {emailError === EXISTING_EMAIL && (
                                    <Link to="/login" className={`caption ${styles.link}`}>
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
};

export default PasswordResetEmailPage;