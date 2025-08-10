import styles from "./Card.module.css";
import '../../styles/skeleton.css'

interface CardProps {
    image?: string;
    title?: string;
    description?: string;
    isLoading?: boolean;
    rank?: number | null;
    onClick?: () => void;
}

const Card = ({
    image = "https://via.placeholder.com/150",
    title,
    description,
    isLoading = false,
    rank = null,
    onClick,
}: CardProps) => {

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
    <div className={styles.card} onClick={onClick}>
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