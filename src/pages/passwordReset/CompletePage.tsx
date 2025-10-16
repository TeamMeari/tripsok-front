import styles from "./passwordReset.module.css";
import { Trans, useTranslation } from "react-i18next";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import { useNavigate } from "react-router-dom";

const PasswordResetCompletePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClickLogin = () => {
        navigate("/login");
    }

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