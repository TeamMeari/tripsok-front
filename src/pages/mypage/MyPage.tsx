import { useEffect, useState } from "react";
import styles from './MyPage.module.css'
import BookingCard from "../../components/feature/BookingCard";
import { Booking } from "../../types/booking";
import { LucideIcon, ChevronRight, Heart, Briefcase, Lock, MessageSquareWarning, FileSearch } from "lucide-react";
import MenuApp from "../../components/tabbar/MenuApp";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { Trans, useTranslation } from "react-i18next";
import { useApi } from "../../hooks/useApi";

const MyPage = () => {
    const { t } = useTranslation();
    const [latestBooking, setlatestBooking] = useState<Booking | null>(null);
    const { nickname } = useAuthStore();
    const { apiCall } = useApi();

    // 최근 예약 불러오기
    const fetchLatestBooking = () => {
        apiCall<Booking>('/booking/latest', "POST").then(response => {
            if (response.status === 200) {
                setlatestBooking(response.data);
            }
        })
    }
    
    useEffect(() => {
        fetchLatestBooking();
    }, [])

    return (
        <div className={styles.page}>
            <div className={styles.part}>
                {  
                    latestBooking ? <div className={styles.latestBookingContainer}>
                        <h2 className={styles.title}>
                            <Trans values={{ name: nickname }} i18nKey="bookingTitle"/>
                        </h2>
                        <BookingCard {...latestBooking} />
                    </div> : null
                }
                <div className={styles.menuContainer}>
                    <h2 className={styles.title}>{t("bookingManagementTitle")}</h2>
                    <MenuItem Icon={Heart} text={t("myLikePlace")} link="/my/like"/>
                    <MenuItem Icon={Briefcase} text={t("usageHistory")} link="/my/usage-history"/>
                </div>

                <div className={styles.menuContainer}>
                    <h2 className={styles.title}>{t("accountManagementTitle")}</h2>
                    <MenuItem Icon={Lock} text={t("passwordReset")} link="/password/reset/email"/>
                    <MenuItem Icon={MessageSquareWarning} text={t("myInterest")} link="/my/interest"/>
                    <MenuItem Icon={FileSearch} text={t("terms")} link="/terms"/>
                    <MenuItem Icon={FileSearch} text={t("privacy")} link="/privacy"/>
                </div>
            </div>
            <MenuApp />
        </div>
    );
};

const MenuItem = ({Icon, text, link}: {Icon: LucideIcon, text: string, link: string}) => { 
    const navigate = useNavigate();
    return (
        <div className={styles.menuItem} onClick={() => navigate(link)}>
            <Icon size={16} color="#666666" />
            <p className="body">{text}</p>
            <ChevronRight size={18} color="#666666" />
        </div>
    )
}

export default MyPage;