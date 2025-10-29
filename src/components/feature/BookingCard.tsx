import { Trans, useTranslation } from 'react-i18next';
import { Booking } from '../../types/booking';
import styles from './BookingCard.module.css'
import { useNavigate } from 'react-router-dom';

interface BookingCardProps extends Booking {
    isLoading?: false;
}

interface BookingCardLoadingProps {
    isLoading: true;
}

const BookingCard = (props: | BookingCardProps | BookingCardLoadingProps) => {
    if (props.isLoading) return <div className={styles.cardSkeleton}>
            <div className={`${styles.titleSkeleton} skeleton`}></div>
            <div className={`${styles.infoSkeleton} skeleton`}></div>
            <div className={`${styles.stateSkeleton} skeleton`}></div>
    </div>

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [year, month, day] = props.tripDate.split("-").map(Number);
    const time = props.startTime.split(":").slice(0, 2).join(":")

    const handleClickCard = () => {
        navigate('/myplan-detail/' + props.bookingId);
    }

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
        <div className={styles.card} onClick={handleClickCard}>
            <h2 className={styles.title}>
                <Trans
                    values={{ year, month, day }}
                    i18nKey="booking.title"
                />
            </h2>
            <p className={`${styles.info} caption`}>
                <Trans
                    values={{ departure: t('locations.gangneungStation'), time: time, party: getStringPersonCount(props.numberOfPeople) }}
                    i18nKey="booking.caption"
                />
            </p>
            <h2 className={styles.state}>
                {t(`booking.state.${props.status}`)}
            </h2>
        </div>
    );
};

export default BookingCard;