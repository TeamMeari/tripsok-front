import { useCallback, useEffect } from "react";
import styles from "./SignupPage.module.css";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import { useSignupStore } from "../../stores/signupStores";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
    const { t } = useTranslation();
    const { emailVerifyToken, socialSignUpToken, setPrivacyChecked } = useSignupStore();
    const navigate = useNavigate();
    const onClickAgree = useCallback(() => {
        setPrivacyChecked(true);
        navigate(-1);
    }, [setPrivacyChecked, navigate]);

    // redirect
    useEffect(() => {
        if (!emailVerifyToken && !socialSignUpToken) navigate("/signup/email/1");
    }, [emailVerifyToken, navigate]);

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <p className={styles.message}>{t("privacyRequired")}</p>
                <p className={styles.documentContent}>{t("privacyContent")}</p>
                <div className={styles.buttonFixedTab}>
                    <ValidationBtn onClick={onClickAgree} isDisabled={false}>{t("agree")}</ValidationBtn>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPage;