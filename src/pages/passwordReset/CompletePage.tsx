import styles from "./passwordReset.module.css";
import { Trans, useTranslation } from "react-i18next";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const PasswordResetCompletePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleClickLogin = () => {
        navigate("/login");
    }

    // 잘못된 접근 redirect
    useEffect(() => {
        const prevPath = location.state?.from;
        if (prevPath !== '/password/reset/new') {
            navigate('/password/reset/email', { replace: true });
        }
    }, [])

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <p className={styles.message} style={{ paddingBottom: "16px" }}>
                    <Trans i18nKey="passwordResetComplete"
                    components={{ br: <br />, span: <span /> }} />
                </p>
                <p className={styles.guide} style={{ color: "black"}}>{t("retryLoginGuide")}</p>
                <div className={styles.buttonFixedTab}>
                    <ValidationBtn
                        onClick={handleClickLogin}
                        isDisabled={false}
                    >
                        {t("login")}
                    </ValidationBtn>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetCompletePage;