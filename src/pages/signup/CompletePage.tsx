import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useTranslation, Trans } from "react-i18next";
import Button from "../../components/common/Button/CommonBtn";
import HashtagButton from "../../components/common/HashtagBtn";
import HashtagBtnSkeleton from "../../components/common/HashtagBtnSkeleton";
import { useApi } from "../../hooks/useApi";
import { Tag } from "../../types/Tag";
import styles from "./SignupPage.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const SignupCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 회원가입 완료 페이지 접근 경로 체크
  useEffect(() => {
    const prevPath = location.state?.from;
    if (prevPath !== '/signup/email/3' && prevPath !== '/signup/oauth2') {
      navigate('/', { replace: true });
    }
  }, []);

  const { t, i18n } = useTranslation();
  const { apiCall: fetchApiCall, isLoading: fetchIsLoading } = useApi();
  const { apiCall: patchApiCall } = useApi();
  const [hashtags, setHashtags] = useState<Tag[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const { isLoggedIn, nickname } = useAuthStore();

  const fetchHashtags = () => {
    fetchApiCall("/theme" + `?locale=${i18n.language.toUpperCase()}`, "GET").then((response) => {
      if (response.status === 200) {
        setHashtags(response.data as Tag[]);
      }
    });
  };

  const patchHashtags = useCallback(() => {
    if (selectedIds.size === 0) return;
    patchApiCall("/user/interest-themes", "PATCH", {
      interestThemeIds: Array.from(selectedIds),
    });
  }, [patchApiCall, selectedIds]);

  const handleHashtagClick = useCallback((hashtagId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(hashtagId)) next.delete(hashtagId);
      else next.add(hashtagId);
      return next;
    });
  }, []);

  // 해시태그 클릭 핸들러 메모이제이션(해당 항목만 리렌더링)
  const clickHandlersById = useMemo(() => {
    const handlers: Record<number, () => void> = {};
    hashtags.forEach((h) => {
      handlers[h.id] = () => handleHashtagClick(h.id);
    });
    return handlers;
  }, [hashtags, handleHashtagClick]);

  const HashtagItem = memo((props: {
    id: number;
    label: string;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    return (
      <HashtagButton
        label={props.label}
        isSelected={props.isSelected}
        onClick={props.onClick}
      />
    );
  });

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
    }, 800);
    return () => clearTimeout(timer);
  }, [patchHashtags]);

  return (
    <div className={styles.page}>
      <div className={styles.step}>
        <p className={styles.message}>
          <Trans
            i18nKey="welcomeNickname"
            components={{ br: <br />, span: <span /> }}
            values={{ name: nickname || "" }}
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
                <HashtagItem
                  key={hashtag.id}
                  id={hashtag.id}
                  label={hashtag.type}
                  isSelected={selectedIds.has(hashtag.id)}
                  onClick={clickHandlersById[hashtag.id]}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.buttonFixedTab}>
          <Link to="/">
            <Button borderRadius="12px" size="large">
              {t("home")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupCompletePage;
