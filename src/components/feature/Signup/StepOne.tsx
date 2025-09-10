import { useCallback, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import styles from "../../../pages/SignupPage.module.css";
import { INVALID_EMAIL, EXISTING_EMAIL } from "../../../types/signupErrors";
import { validateEmail } from "../../../utils/validation";
import ValidationBtn from "../../common/Button/ValidationBtn";
import Input from "../../common/Input";
import { useApi } from "../../../hooks/useApi";

interface StepOneProps {
    onSubmit: (email: string) => void;
}

const StepOne = ({ onSubmit }: StepOneProps) => {
    const { t } = useTranslation();
    const { apiCall, isLoading } = useApi();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // 이메일 입력 인증
    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError(validateEmail(newEmail) ? "" :INVALID_EMAIL);
    }, []);

    // 이메일 코드 보내기
    const handleEmailVerification = useCallback(() => {
        apiCall("/auth/email/send", "POST", { email }).then(response => {
            if (response.status === 200) {
                onSubmit(email);
            } else {
                setEmailError(EXISTING_EMAIL);
            }
        });
    }, [email, onSubmit]);

    return (
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
                                <a href="/login" className={styles.link}>
                                    {t("login")}
                                </a>
                            )}
                        </div>
                    )}
                </div>
                <ValidationBtn
                    isDisabled={!validateEmail(email) || isLoading}
                    onClick={handleEmailVerification}
                >
                    {t("emailVerification")}
                </ValidationBtn>
            </div>
        </div>
    );
};

export default StepOne;
