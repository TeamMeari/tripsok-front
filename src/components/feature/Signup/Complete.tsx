import styles from "../../../pages/SignupPage.module.css";
import Button from "../../common/Button/CommonBtn";
import { useTranslation } from "react-i18next";

interface CompleteProps {
    nickname: string;
}

const Complete = ({ nickname }: CompleteProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.step}>
            <p
                className={styles.message}
                dangerouslySetInnerHTML={{ __html: t("welcomeNickname", { name: nickname }) }}
            />
            <div className={styles.buttonFixedTab}>
                <a href="/">
                    <Button borderRadius="12px" size="large">{t("home")}</Button>
                </a>
            </div>
        </div>
    );
};

export default Complete;
