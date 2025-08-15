import styles from "./Card.module.css";
import '../../styles/skeleton.css'
import { useNavigate } from "react-router-dom";

interface CardProps {
    id: number;
    image?: string;
    title?: string;
    description?: string;
    isLoading?: boolean;
    rank?: number | null;
}

const Card = ({
    id,
    image = "https://via.placeholder.com/150",
    title,
    description,
    isLoading = false,
    rank = null,
}: CardProps) => {
    const navigate = useNavigate();
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
                <div className={`${styles.cardTitle} skeleton`}></div>
                <div className={`${styles.cardDesc} skeleton`}></div>
                <div className={`${styles.cardDesc} skeleton`}></div>
            </div>
        </div>
    }
  return (
    <div className={styles.card} onClick={() => navigate(`/content/${id}`)}>
        { RankBadge() }
        <div className={styles.cardImageContainer}>
            <img src={image} alt={title} />
        </div>
        <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>{title}</h5>
            <p className={styles.cardDesc}>{description}</p>
        </div>
    </div>
  )
}

export default Card