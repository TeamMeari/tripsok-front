import { reservation } from '../../types/reservation';
import styles from './TourHistoryCard.module.css'

const TourHistoryCard = ({ year, month, day, departure, time, party, state} : reservation) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>#월 #일 2#년의 여정</h2>
            <p className={`${styles.info} caption`}>강릉역 13:00 2명 출발</p>
            <h2 className={styles.state}>여행전</h2>
        </div>
    );
};

export default TourHistoryCard;