import styles from "./passwordReset.module.css";
import { Trans, useTranslation } from "react-i18next";
import PasswordInput from "../../components/feature/Input/PasswordInput";
import { useCallback, useState, useEffect } from "react";
import { PASSWORD_VALIDATION_WARNING } from "../../types/signupErrors";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import { useApi } from "../../hooks/useApi";
import { useNavigate, useLocation } from "react-router-dom";
import { usePasswordResetStore } from "../../stores/passwordResetStore";

const PasswordResetPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { apiCall, isLoading } = useApi();
    const { emailVerifyToken, reset } = usePasswordResetStore();
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordErrorCondition, setPasswordErrorCondition] = useState<string[]>([]);
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
    const [nickname, setNickname] = useState("");

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value.trim();
        setPassword(newPassword);
        const { error, conditions } = PASSWORD_VALIDATION_WARNING(newPassword);
        setPasswordError(error);
        setPasswordErrorCondition(conditions);
        if (!error) setPasswordConfirmVisible(true);
    }, [t]);

    const handlePasswordConfirmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newPasswordConfirm = e.target.value.trim();
        setPasswordConfirm(newPasswordConfirm);
        setPasswordConfirmError(newPasswordConfirm !== password ? t("passwordNotMatch") : "");
    }, [password, t]);

    const handlePasswordReset = useCallback(() => {
        if (!password || !passwordConfirm) return;
        apiCall("/auth/reset/password", "POST", { password, emailVerifyToken }).then(response => {
            if (response.status === 200 && response.data && typeof response.data === 'object' && 'nickname' in response.data) {
                navigate("/password/reset/complete", {state: { nickname: (response.data as { nickname: string }).nickname , from: location.pathname }});
            } 
        });
    }, [password, passwordConfirm]);

    // 잘못된 접근 redirect
    useEffect(() => {
        const prevPath = location.state?.from;
        if (prevPath !== '/password/reset/code' || emailVerifyToken === "") {
            navigate('/password/reset/email', { replace: true });
        }

        () => {
            reset();
        }
    }, [])

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <h2 className={styles.message}>
                    <Trans i18nKey="enterNewPassword" components={{ br: <br /> }} />
                </h2>
                <div className={styles.content}>
                    <div className={styles.inputContainer}>
                        <PasswordInput onChange={handlePasswordChange} placeholder={t("enterPassword")} value={password} />
                        {password ?
                            (passwordError ?
                                <p className={`caption ${styles.error}`}>
                                    <Trans i18nKey={passwordError} values={{ condition: passwordErrorCondition.map(condition => t(condition)).join(", ") }}/>
                                </p> :
                                <p className={`caption ${styles.success}`}>{t("passwordValid")}</p>)
                            : <p className="caption">{t("passwordRule")}</p>
                        }
                    </div>

                    {passwordConfirmVisible && (
                        <div className={styles.inputContainer}>
                            <PasswordInput onChange={handlePasswordConfirmChange} placeholder={t("reEnterPassword")} value={passwordConfirm || ""} />
                            {passwordConfirmError ? <p className={`caption ${styles.error}`}>{passwordConfirmError}</p>
                            : passwordConfirm === "" ? null : <p className={`caption ${styles.success}`}>{t("passwordMatch")}</p>}
                        </div>
                    )}

                    <div className={styles.buttonFixedTab}>
                        <ValidationBtn
                            isDisabled={password === "" || passwordConfirm === "" || Boolean(passwordError) || Boolean(passwordConfirmError) || isLoading}
                            onClick={handlePasswordReset}
                        >
                            {t("passwordReset")}
                        </ValidationBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetPage;