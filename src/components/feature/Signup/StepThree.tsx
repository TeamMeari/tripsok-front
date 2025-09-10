import { ChevronRightIcon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { PASSWORD_VALIDATION_WARNING, PASSWORD_CONFIRM_ERROR } from "../../../types/signupErrors";
import CheckBox from "../../common/CheckBox";
import Input from "../../common/Input";
import styles from "../../../pages/SignupPage.module.css";
import PasswordInput from "../Input/PasswordInput";
import ValidationBtn from "../../common/Button/ValidationBtn";
import { validatePassword } from "../../../utils/validation";
import { useTranslation } from "react-i18next";
import { PASSWORD_VALIDATION_WARNING } from "../../../types/signupErrors";
import { useApi } from "../../../hooks/useApi";

interface StepThreeProps {
    onSubmit: (nickname: string) => void;
    emailVerifyToken: string;
    goStepFour: () => void;
    goStepFive: () => void;
}

const StepThree = ({ onSubmit, emailVerifyToken, goStepFour, goStepFive }: StepThreeProps) => {
    const { t } = useTranslation();
    const { apiCall: nicknameValidateApiCall, isLoading: nicknameValidateIsLoading } = useApi();
    const { apiCall: submitApiCall, isLoading: submitIsLoading } = useApi();
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
    const [nicknameVisible, setNicknameVisible] = useState(false);
    const [termAndPrivacyVisible, setTermAndPrivacyVisible] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value.trim());
    }, []);

    const handlePasswordConfirmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(e.target.value.trim());
    }, []);

    const NICKNAME_MAX_LENGTH = 15;
    const [nickname, setNickname] = useState("");
    const [nicknameError, setNicknameError] = useState("");

    const handleNicknameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value.slice(0, NICKNAME_MAX_LENGTH));
    }, []);

    const [termsChecked, setTermsChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);

    const handleTermsChecked = useCallback(() => setTermsChecked(prev => !prev), []);
    const handlePrivacyChecked = useCallback(() => setPrivacyChecked(prev => !prev), []);

    const handleSubmit = useCallback(() => {
        submitApiCall("/auth/signup", "POST", { emailVerifyToken, nickname, password }).then(response => {
            if (response.status === 200) {
                onSubmit(nickname);
            }
        });
    }, [nickname, onSubmit]);

    const passwordValid = validatePassword(password);
    const passwordConfirmValid = password !== "" && passwordConfirm !== "" && password === passwordConfirm;
    const nicknameValid = nickname.length > 0 && nickname.length <= NICKNAME_MAX_LENGTH;
    const validateInfo = passwordValid && passwordConfirmValid && nicknameValid && termsChecked && privacyChecked;

    useEffect(() => {
        const passwordError = PASSWORD_VALIDATION_WARNING(password);
        setPasswordError(passwordError);
        if (passwordError === "") {
            setPasswordConfirmVisible(true);
        }
    }, [password])

    useEffect(() => {
        if (passwordConfirm !== "") {
            if (password !== passwordConfirm) {
                setPasswordConfirmError(PASSWORD_CONFIRM_ERROR);
            } else {
                setPasswordConfirmError("");
                if (passwordError === "") setNicknameVisible(true);
            }
        } else {
            setPasswordConfirmError("");
        }
    }, [passwordConfirm, password, t]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (nickname.length > 0 && nickname.length <= NICKNAME_MAX_LENGTH) {
                nicknameValidateApiCall("/auth/validate/nickname", "POST", { nickname }).then(response => {
                    if (response.status === 200) {
                        if (response.data && typeof response.data === 'object' && 'available' in response.data && response.data.available === true) {
                            setNicknameError("");
                            if (passwordError === "" && passwordConfirmError === "") setTermAndPrivacyVisible(true);
                    } else {
                        setNicknameError('existingNickname');
                    }
                    }
                });
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [nickname]);

    return (
        <div className={styles.step}>
            <p className={styles.message} dangerouslySetInnerHTML={{ __html: t("emailVerified") }} />
            <div className={styles.content}>
                <div className={styles.inputContainer}>
                    <PasswordInput onChange={handlePasswordChange} placeholder={t("enterPassword")} />
                    {password ?
                        (passwordError ? <p className={styles.error}>{passwordError}</p> : <p className={styles.success}>{t("passwordValid")}</p>)
                        : <p className={styles.guide}>{t("passwordRule")}</p>
                    }
                </div>

                {passwordConfirmVisible && (
                    <div className={styles.inputContainer}>
                        <PasswordInput onChange={handlePasswordConfirmChange} placeholder={t("reEnterPassword")} />
                        {passwordConfirmError && <p className={styles.error}>{passwordConfirmError}</p>}
                        {passwordValid && passwordConfirmValid && <p className={styles.success}>{t("passwordMatch")}</p>}
                    </div>
                )}

                {nicknameVisible && (
                    <div className={styles.inputContainer}>
                        <Input
                            onChange={handleNicknameChange}
                            value={nickname}
                            placeholder={t("nicknameRule")}
                            maxLength={NICKNAME_MAX_LENGTH}
                        />
                        {nicknameError && <p className={styles.error}>{t(nicknameError)}</p>}
                    </div>
                )}

                {termAndPrivacyVisible && (
                    <div className={styles.checkboxContainer}>
                        <div className={styles.checkboxItem}>
                            <CheckBox checked={termsChecked} disabled={false} onClick={handleTermsChecked} />
                            <button onClick={goStepFour} className={styles.documentButton}>
                                <label>{t("termsRequired")}</label>
                                <ChevronRightIcon color="#ABB0BA" size={16} />
                            </button>
                        </div>
                        <div className={styles.checkboxItem}>
                            <CheckBox checked={privacyChecked} disabled={false} onClick={handlePrivacyChecked} />
                            <button onClick={goStepFive} className={styles.documentButton}>
                                <label>{t("privacyRequired")}</label>
                                <ChevronRightIcon color="#ABB0BA" size={16} />
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.buttonFixedTab}>
                    <ValidationBtn isDisabled={!validateInfo || nicknameValidateIsLoading || submitIsLoading} onClick={handleSubmit}>{t("signup")}</ValidationBtn>
                </div>
            </div>
        </div>
    );
};

export default StepThree;