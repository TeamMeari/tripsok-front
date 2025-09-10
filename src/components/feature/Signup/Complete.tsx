import styles from "../../../pages/SignupPage.module.css";
import Button from "../../common/Button/CommonBtn";
import { useTranslation, Trans } from "react-i18next";
import { Tag } from "../../../types/Tag";
import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import HashtagButton from "../../common/HashtagBtn";
import HashtagBtnSkeleton from "../../common/HashtagBtnSkeleton";
interface CompleteProps {
    nickname: string;
}

const Complete = ({ nickname }: CompleteProps) => {
    const { t } = useTranslation();
    const { apiCall, isLoading } = useApi();
    const [hashtags, setHashtags] = useState<Tag[]>([]);

    const fetchHashtags = () => {
        apiCall('/theme', 'GET').then(response => {
            if (response.status === 200) {
                setHashtags(response.data as Tag[]);
            }
        });
    }

    useEffect(() => {
        fetchHashtags();
    }, []);

    return (
        <div className={styles.step}>
            <p
                className={styles.message}
            >
                <Trans i18nKey="welcomeNickname" components={{ br: <br />, span: <span /> }} values={{ name: nickname }} />
            </p>
            <div className={styles.content}>
                {
                    isLoading ? (
                        <div className={styles.hashtagsContainer}>
                            {[...Array(10)].map((_, i) => (
                                <HashtagBtnSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.hashtagsContainer}>
                            {hashtags.map(hashtag => (
                                <HashtagButton key={hashtag.id} label={hashtag.type} />
                            ))}
                        </div>
                    )
                }
                
            </div>
            <div className={styles.buttonFixedTab}>
                <a href="/">
                    <Button borderRadius="12px" size="large">{t("home")}</Button>
                </a>
            </div>
        </div>
    );
};

export default Complete;
