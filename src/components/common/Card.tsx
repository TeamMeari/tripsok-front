import styles from "./Card.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import placePlaceholder from "../../assets/image/place-placeholder.png";

interface CardProps {
    id?: number;
    image?: string;
    title?: string;
    description?: string;
    isLoading?: boolean;
    rank?: number | null;
    type?: "restaurant" | "tour" | "accommodation";
}

const Card = ({
    id,
    image = placePlaceholder,
    title,
    description,
    isLoading = false,
    rank = null,
    type,
}: CardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const RankBadge = () => {
        if (rank) return <div className={styles.rankBadge}>{rank}</div>
        return null;
    }
    if (isLoading) {
        return <div className={styles.card}>
            { RankBadge() }
            <div className={`${styles.cardImageContainer} skeleton`}>
            </div>
            <div className={styles.cardBody}>
                <div className={`${styles.cardTitleSkeleton} skeleton`}></div>
                <div className={`${styles.cardDescSkeleton} skeleton`}></div>
                <div className={`${styles.cardDescSkeleton} skeleton`}></div>
            </div>
        </div>
    }
  return (
    <div className={styles.card} onClick={() => navigate(`/content/${type}/${id}`)}>
        { RankBadge() }
        <div className={styles.cardImageContainer}>
            <img src={image} alt={title} onError={(e) => {e.currentTarget.src = placePlaceholder;}}/>
        </div>
        <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>{title}</h5>
            <p className={styles.cardDesc}>{description === t("emptySummary") ? t("substituteSummary") : description}</p>
        </div>
    </div>
  )
}

export default Card