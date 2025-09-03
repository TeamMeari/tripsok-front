import { useCallback, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import styles from "../../../pages/SignupPage.module.css";
import { INVALID_EMAIL, EXISTING_EMAIL } from "../../../types/signupErrors";
import { validateEmail } from "../../../utils/validation";
import ValidationBtn from "../../common/Button/ValidationBtn";
import Input from "../../common/Input";

interface StepOneProps {
    onSubmit: (email: string) => void;
}

const StepOne = ({ onSubmit }: StepOneProps) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // 이메일 입력 인증
    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailError(validateEmail(newEmail) ? "" : t(INVALID_EMAIL));
    }, [t]);

    // 이메일 코드 보내기
    const handleEmailVerification = useCallback(() => {
        if (email === "meari@gmail.com") {
            setEmailError(t(EXISTING_EMAIL));
        } else {
            onSubmit(email);
        }
    }, [email, onSubmit, t]);

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
                            <p className={styles.error}>{emailError}</p>
                            {emailError === t(EXISTING_EMAIL) && (
                                <a href="/login" className={styles.link}>
                                    {t("login")}
                                </a>
                            )}
                        </div>
                    )}
                </div>
                <ValidationBtn
                    isDisabled={!validateEmail(email)}
                    onClick={handleEmailVerification}
                >
                    {t("emailVerification")}
                </ValidationBtn>
            </div>
        </div>
    );
};

export default StepOne;
