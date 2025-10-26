import { useEffect, useState } from "react";
import styles from './MyPage.module.css'
import TourHistoryCard from "../../components/feature/TourHistoryCard";
import { Reservation } from "../../types/reservation";
import { LucideIcon, ChevronRight, Heart, Briefcase, Lock, MessageSquareWarning, FileSearch } from "lucide-react";
import MenuApp from "../../components/MenuApp";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { Trans, useTranslation } from "react-i18next";

const recentReservationExample: Reservation = {
    year: 2025,
    month: 10,
    day: 26,
    departure: "강릉역",
    time: "13:00",
    party: 2,
    state: "BEFORE_TRAVEL"
}

const MyPage = () => {
    const { t } = useTranslation();
    const [recentReservation, setRecentReservation] = useState<Reservation | null>(null);
    const { nickname } = useAuthStore();

    useEffect(() => {
        setRecentReservation(recentReservationExample)
    }, [])

    return (
        <div className={styles.page}>
            {  
                recentReservation &&
                <div className={styles.recentReservationContainer}>
                    <h2 className={styles.title}>
                        <Trans values={{ name: nickname }} i18nKey="reservationTitle"/>
                    </h2>
                    <TourHistoryCard
                        {...recentReservation}
                    />
                </div>
            }
            <div className={styles.menuContainer}>
                <h2 className={styles.title}>{t("reservationManagementTitle")}</h2>
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