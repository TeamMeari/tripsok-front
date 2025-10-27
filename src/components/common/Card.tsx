import styles from "./Card.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import placePlaceholder from "../../assets/image/place-placeholder.png";
import { PlaceType } from "../../types/menuTabs";

interface CardProps {
    id?: number;
    image?: string;
    title?: string;
    description?: string;
    isLoading?: boolean;
    rank?: number | null;
    type?: PlaceType;
    onClick?:() => void;
}

const Card = ({
    id,
    image = placePlaceholder,
    title,
    description,
    isLoading = false,
    rank = null,
    type,
    onClick,
}: CardProps) => {
    console.log(type);
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
    <div className={styles.card} onClick={() => {
        console.log(type);
        navigate(`/content/${type || "tour"}/${id}`)
        }}>
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