import { Trans, useTranslation } from 'react-i18next';
import { Reservation } from '../../types/reservation';
import styles from './TourHistoryCard.module.css'

const TourHistoryCard = ({ year, month, day, departure, time, party, state} : Reservation) => {
    const { t, i18n } = useTranslation();

    const getStringPersonCount = (count: number) => {
        const lang = i18n.language;
        switch (lang) {
            case 'ko':
            return `${count}명`;
            case 'en':
            return `${count} ${count === 1 ? 'person' : 'people'}`;
            case 'ja':
            return `${count}人`;
            case 'cn':
            return `${count}人`;
            default:
            return `${count} people`;
        }
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>
                <Trans
                    values={{ year, month, day }}
                    i18nKey="reservation.title"
                />
            </h2>
            <p className={`${styles.info} caption`}>
                <Trans
                    values={{ departure, time, party: getStringPersonCount(party) }}
                    i18nKey="reservation.caption"
                />
            </p>
            <h2 className={styles.state}>
                {t(`reservation.state.${state}`)}
            </h2>
        </div>
    );
};

export default TourHistoryCard;