import styles from "../../../pages/SignupPage.module.css";
import Button from "../../common/Button/CommonBtn";
import { useTranslation, Trans } from "react-i18next";

interface CompleteProps {
    nickname: string;
}

const Complete = ({ nickname }: CompleteProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.step}>
            <p
                className={styles.message}
            >
                <Trans i18nKey="welcomeNickname" components={{ br: <br />, span: <span /> }} values={{ name: nickname }} />
            </p>
            <div className={styles.buttonFixedTab}>
                <a href="/">
                    <Button borderRadius="12px" size="large">{t("home")}</Button>
                </a>
            </div>
        </div>
    );
};

export default Complete;
