import { useCallback, useEffect, useState } from "react";
import styles from "./SignupPage.module.css";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import { useSignupStore } from "../../stores/signupStores";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const PrivacyPage = () => {
    const { t, i18n } = useTranslation();
    const { emailVerifyToken, socialSignUpToken, setPrivacyChecked } = useSignupStore();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const onClickAgree = useCallback(() => {
        setPrivacyChecked(true);
        navigate(-1);
    }, [setPrivacyChecked, navigate]);

    // redirect
    useEffect(() => {
        if (!emailVerifyToken && !socialSignUpToken) navigate("/signup/email/1");
    }, [emailVerifyToken, navigate]);

    useEffect(() => {
        fetch(`/termAndPrivacy/privacy_${i18n.language}.md`)
      .then(res => res.text())
      .then(setContent);
    }, [i18n.language]);

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <p className={styles.message}>{t("privacyRequired")}</p>
                <ReactMarkdown>{content}</ReactMarkdown>
                <div className={styles.buttonFixedTab}>
                    <ValidationBtn onClick={onClickAgree} isDisabled={false}>{t("agree")}</ValidationBtn>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPage;