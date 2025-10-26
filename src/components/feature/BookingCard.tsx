import { Trans, useTranslation } from 'react-i18next';
import { Booking } from '../../types/booking';
import styles from './BookingCard.module.css'

interface BookingCardProps extends Omit<Booking, 'bookingId'> {
    isLoading?: boolean;
}

const BookingCard = ({ tripDate, startTime, numberOfPeople, status, isLoading = false }: BookingCardProps) => {
    const { t, i18n } = useTranslation();
    const [year, month, day] = tripDate.split("-").map(Number);

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

    if (isLoading) return <div className={styles.cardSkeleton}>
            <div className={`${styles.titleSkeleton} skeleton`}></div>
            <div className={`${styles.infoSkeleton} skeleton`}></div>
            <div className={`${styles.stateSkeleton} skeleton`}></div>
    </div>
    

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>
                <Trans
                    values={{ year, month, day }}
                    i18nKey="booking.title"
                />
            </h2>
            <p className={`${styles.info} caption`}>
                <Trans
                    values={{ departure: "", time: startTime, party: getStringPersonCount(numberOfPeople) }}
                    i18nKey="booking.caption"
                />
            </p>
            <h2 className={styles.state}>
                {t(`booking.state.${status}`)}
            </h2>
        </div>
    );
};

export default BookingCard;