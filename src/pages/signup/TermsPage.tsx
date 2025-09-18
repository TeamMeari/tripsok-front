import { useCallback, useEffect, useState } from "react";
import styles from "./SignupPage.module.css";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import { useSignupStore } from "../../stores/signupStores";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const TermsPage = () => {
    const { t, i18n } = useTranslation();
    const { emailVerifyToken, socialSignUpToken, setTermsChecked } = useSignupStore();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const onClickAgree = useCallback(() => {
        setTermsChecked(true);
        navigate(-1);
    }, [setTermsChecked, navigate]);

    // redirect
    useEffect(() => {
        if (!emailVerifyToken && !socialSignUpToken) navigate("/signup/email/1");
    }, [emailVerifyToken, navigate]);

    useEffect(() => {
        fetch(`/termAndPrivacy/terms_${i18n.language}.md`)
      .then(res => res.text())
      .then(setContent);
    }, [i18n.language]);

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <p className={styles.message}>{t("termsRequired")}</p>
                <p className={styles.documentContent}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </p>
                <div className={styles.buttonFixedTab}>
                    <ValidationBtn onClick={onClickAgree} isDisabled={false}>{t("agree")}</ValidationBtn>
                </div>
            </div>
        </div>
    );
}

export default TermsPage;