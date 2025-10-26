import { useEffect, useState } from "react";
import styles from './MyPage.module.css'
import TourHistoryCard from "../../components/feature/TourHistoryCard";
import { reservation } from "../../types/reservation";
import { LucideIcon, ChevronRight, Heart, Briefcase, Lock, MessageSquareWarning, Volume } from "lucide-react";
import MenuApp from "../../components/MenuApp";
import { useNavigate } from "react-router-dom";

const recentReservationExample: reservation = {
    year: 2025,
    month: 10,
    day: 26,
    departure: "강릉역",
    time: "13:00",
    party: 2,
    state: "여행전"
}

const MyPage = () => {
    const [recentReservation, setRecentReservation] = useState<reservation | null>(null);

    useEffect(() => {
        setRecentReservation(recentReservationExample)
    }, [])

    return (
        <div className={styles.page}>
            {  
                recentReservation &&
                <div className={styles.recentReservationContainer}>
                    <h2 className={styles.title}>메아리님의 가장 최근 예약</h2>
                    <TourHistoryCard
                        {...recentReservation}
                    />
                </div>
            }
            <div className={styles.menuContainer}>
                <h2 className={styles.title}>예약 관리</h2>
                <MenuItem Icon={Heart} text="내가 찜한 장소" link="/my/like"/>
                <MenuItem Icon={Briefcase} text="이용 내역" link="/my/usage-history"/>
            </div>

            <div className={styles.menuContainer}>
                <h2 className={styles.title}>계정 관리</h2>
                <MenuItem Icon={Lock} text="비밀번호 재설정" link="/password/reset/email"/>
                <MenuItem Icon={MessageSquareWarning} text="나의 관심 분야" link="/my/interest"/>
                <MenuItem Icon={Volume} text="이용 약관" link="/terms"/>
                <MenuItem Icon={Volume} text="개인정보 수집 및 이용" link="/privacy"/>
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