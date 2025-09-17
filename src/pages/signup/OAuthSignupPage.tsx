import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css";
import { useSignupStore } from "../../stores/signupStores";
import { ChevronRightIcon } from "lucide-react";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import CheckBox from "../../components/common/CheckBox";
import Input from "../../components/common/Input";
import { useApi } from "../../hooks/useApi";
import OAuthLoginUrl from "../../utils/OAuthLoginUrl";

const OAuthSignupPage = () => {
    const navigate = useNavigate();
    const { socialSignUpToken } = useSignupStore();

    const { apiCall: nicknameValidateApiCall, isLoading: nicknameValidateIsLoading } = useApi();
    const { apiCall: submitApiCall, isLoading: submitIsLoading } = useApi();

    const { nickname: nicknameStore, setNickname: setNicknameStore, reset, setTermsChecked, setPrivacyChecked, termsChecked, privacyChecked, setRoutingSignupComplete } = useSignupStore();

    const NICKNAME_MAX_LENGTH = 15;
    const [nickname, setNickname] = useState(nicknameStore);
    const [nicknameError, setNicknameError] = useState("");

    const handleNicknameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value.slice(0, NICKNAME_MAX_LENGTH));
    }, []);

    const [termAndPrivacyVisible, setTermAndPrivacyVisible] = useState(nickname !== "");

    const handleTermsChecked = useCallback(() => setTermsChecked(!termsChecked), []);
    const handlePrivacyChecked = useCallback(() => setPrivacyChecked(!privacyChecked), []);

    const handleSubmit = useCallback(() => {
        submitApiCall("/auth/signup/oauth2", "POST", { socialSignUpToken, nickname }).then(response => {
            if (response.status === 200 || response.status === 201) {
                window.location.href = OAuthLoginUrl;
                reset();
                setRoutingSignupComplete();
            }
        });
    }, [nickname, navigate]);

    const nicknameValid = nickname.length > 0 && nickname.length <= NICKNAME_MAX_LENGTH;
    const validateInfo = nicknameValid && termsChecked && privacyChecked;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (nickname.length > 0 && nickname.length <= NICKNAME_MAX_LENGTH) {
                nicknameValidateApiCall("/auth/validate/nickname", "POST", { nickname }).then(response => {
                    if (response.status === 200) {
                        if (response.data && typeof response.data === 'object' && 'available' in response.data && response.data.available === true) {
                            setNicknameError("");
                            setNicknameStore(nickname);
                            setTermAndPrivacyVisible(true);
                    } else {
                        setNicknameError('existingNickname');
                    }
                    }
                });
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [nickname]);

    // redirect
    useEffect(() => {
        if (!socialSignUpToken) navigate("/login", { replace: true });
    }, [socialSignUpToken, navigate]);

    return (<div className={styles.step}>
        <p className={styles.message}>
            {t("emailVerified")}
        </p>
        <div className={styles.content}>
            <div className={styles.inputContainer}>
                <Input
                    onChange={handleNicknameChange}
                    value={nickname}
                    placeholder={t("nicknameRule")}
                    maxLength={NICKNAME_MAX_LENGTH}
                />
                {nicknameError && <p className={styles.error}>{t(nicknameError)}</p>}
            </div>

            {termAndPrivacyVisible && (
                <div className={styles.checkboxContainer}>
                    <div className={styles.checkboxItem}>
                        <CheckBox checked={termsChecked} disabled={false} onClick={handleTermsChecked} />
                        <button onClick={() => navigate("/signup/terms")} className={styles.documentButton}>
                            <label>{t("termsRequired")}</label>
                            <ChevronRightIcon color="#ABB0BA" size={16} />
                        </button>
                    </div>
                    <div className={styles.checkboxItem}>
                        <CheckBox checked={privacyChecked} disabled={false} onClick={handlePrivacyChecked} />
                        <button onClick={() => navigate("/signup/privacy")} className={styles.documentButton}>
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
    </div>)
};

export default OAuthSignupPage;