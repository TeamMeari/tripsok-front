import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import Button from "../../components/common/Button/CommonBtn";
import HashtagButton from "../../components/common/HashtagBtn";
import HashtagBtnSkeleton from "../../components/common/HashtagBtnSkeleton";
import { useApi } from "../../hooks/useApi";
import { Tag } from "../../types/Tag";
import styles from "./SignupPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
const SignupCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { nickname?: string } | undefined;

  const { nickname } = state || {};
  const { t } = useTranslation();
  const { apiCall: fetchApiCall, isLoading: fetchIsLoading } = useApi();
  const { apiCall: patchApiCall } = useApi();
  const [hashtags, setHashtags] = useState<Tag[]>([]);
  const { isLoggedIn } = useAuthStore();

  const fetchHashtags = () => {
    fetchApiCall("/theme", "GET").then((response) => {
      if (response.status === 200) {
        setHashtags(response.data as Tag[]);
      }
    });
  };

  const patchHashtags = () => {
    patchApiCall("/user/interest-themes", "PATCH", {
      interestThemeIds: hashtags.map((hashtag) => hashtag.id)
    })
  }

  useEffect(() => {
    // redirect
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
    // fetch hashtags
    fetchHashtags();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      patchHashtags();
    }, 1000);

    return () => clearTimeout(timer);
  }, [hashtags.length]);

  return (
    <div className={styles.page}>
      <div className={styles.step}>
        <p className={styles.message}>
          <Trans
            i18nKey="welcomeNickname"
            components={{ br: <br />, span: <span /> }}
            values={{ name: nickname }}
          />
        </p>
        <div className={styles.content}>
          {fetchIsLoading ? (
            <div className={styles.hashtagsContainer}>
              {[...Array(10)].map((_, i) => (
                <HashtagBtnSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className={styles.hashtagsContainer}>
              {hashtags.map((hashtag) => (
                <HashtagButton key={hashtag.id} label={hashtag.type} />
              ))}
            </div>
          )}
        </div>
        <div className={styles.buttonFixedTab}>
          <a href="/">
            <Button borderRadius="12px" size="large">
              {t("home")}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupCompletePage;
