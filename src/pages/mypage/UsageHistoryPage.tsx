import styles from './MyPage.module.css';
import { Booking } from "../../types/booking";
import { useTranslation } from 'react-i18next';
import BookingCard from '../../components/feature/BookingCard';
import Button from '../../components/common/Button/CommonBtn';
import MenuApp from '../../components/MenuApp';
import { useApi } from '../../hooks/useApi';
import { useEffect, useState } from 'react';

const UsageHistoryPage = () => {
    const { t } = useTranslation();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const { apiCall, isLoading } = useApi();
    
    const fetchBookings = () => {
        apiCall<Booking[]>('/booking/list', "POST", (response: { status: number; data: any; }) => {
            if (response.status === 200) {
                setBookings(response.data);
            }
        })
    }

    useEffect(() => {
        fetchBookings();
    }, [])

    return (
        <div className={styles.page}>
            <div className={styles.part}>
                <h2 className={styles.title}>{t("usageHistory")}</h2>
                {
                    isLoading ? 
                        Array(4).fill(null).map((_, idx) => (
                            <div className={styles.bookingCardWithButton} key={idx}>
                                <BookingCard isLoading />
                            </div>
                        )) : bookings.length === 0 ? <p className='caption'>예약 내역이 없습니다.</p> : bookings.map(booking => 
                        <div className={styles.bookingCardWithButton} key={booking.bookingId}>
                            <BookingCard {...booking} />
                            {/* <Button borderRadius="12px" style={{ width: "100%" }}>고객센터 문의</Button>s */}
                        </div>
                    )
                }
            </div>
            <MenuApp />
        </div>
    );
};

export default UsageHistoryPage;