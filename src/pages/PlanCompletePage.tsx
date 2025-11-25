import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import KakaoMap from "../components/KakaoMap";
import styles from "./PlanCompletePage.module.css";
import { useApi } from "../hooks/useApi";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PersonIcon from "/public/InfoIcon/person.svg";
import DateIcon from "/public/InfoIcon/date.svg";
import FlagIcon from "/public/InfoIcon/flag.svg";
import StartTimeIcon from "/public/InfoIcon/starttimeIcon.svg";
import Button from "../components/common/Button/CommonBtn";
import ButtonTabBar from "../components/tabbar/ButtonTabBar";

interface BookingSpot {
    placeId: number;
    placeName: string;
    address: string;
    lat: number;
    lng: number;
    orderIndex: number;
    memo: string | null;
}

interface BookingDetail {
    bookingId: number;
    tripDate: string;
    startTime: string;
    numberOfPeople: number;
    status: string;
    bookingSpotSet: BookingSpot[];
}

export default function PlanCompletePage() {
    const navigate = useNavigate();
    const { apiCall } = useApi();
    const { t } = useTranslation();

    const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);

    const INITIAL_HEIGHT = 200;
    const MIN_HEIGHT = 42;
    const MAX_HEIGHT = window.innerHeight * 0.8;
    const [sheetHeight, setSheetHeight] = useState(INITIAL_HEIGHT);
    const startY = useRef(0);
    const startHeight = useRef(100);
    const { bookingId } = useParams();
    useEffect(() => {

        const fetchBooking = async () => {
            try {
                const res = await apiCall<BookingDetail>(`/booking/detail/${bookingId}`, "POST");
                setBookingDetail(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBooking();
    },  [bookingId]);

    if (!bookingDetail) return null;

    const mapLocations = bookingDetail.bookingSpotSet.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        title: p.placeName,
    }));

    // 손잡이 드래그 이벤트
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        startY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
        startHeight.current = sheetHeight;

        const handleDrag = (moveEvent: MouseEvent | TouchEvent) => {
            const clientY = "touches" in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
            const diff = startY.current - clientY;
            let newHeight = startHeight.current + diff;
            newHeight = Math.min(Math.max(newHeight, MIN_HEIGHT), MAX_HEIGHT);
            setSheetHeight(newHeight);
        };

        const handleDragEnd = () => {
            window.removeEventListener("mousemove", handleDrag);
            window.removeEventListener("mouseup", handleDragEnd);
            window.removeEventListener("touchmove", handleDrag);
            window.removeEventListener("touchend", handleDragEnd);
        };

        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup", handleDragEnd);
        window.addEventListener("touchmove", handleDrag, { passive: false });
        window.addEventListener("touchend", handleDragEnd);
    };

    return (
        <div style={{ height: "100vh", position: "relative" }}>
            <div style={{ height: "100%", width: "100%" }}>
                <KakaoMap locations={mapLocations} width="100%" height="100%" />
            </div>

            {/* Bottom Sheet */}
            <div className={styles.bottomSheet} style={{ height: sheetHeight }}>
                <div
                    className={styles.dragHandle}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                ></div>

                {sheetHeight > MIN_HEIGHT && (
                    <div className={styles.MyPlan_Detail}>
                        <div className={styles.contentContainer}>
                            {/* 여행 sodur */}
                            <div className={styles.TripSummary}>
                                <div className ={styles.TripTitle}>
                                    {t("booking.title", {
                                        year: new Date(bookingDetail.tripDate).getFullYear(),
                                        month: new Date(bookingDetail.tripDate).getMonth() + 1,
                                        day: new Date(bookingDetail.tripDate).getDate()
                                    })}
                                </div>
                                <div className={styles.bookingCaption}>
                                    {t("booking.caption", {
                                        departure: t("locations.gangneungStation"),
                                        time: bookingDetail.startTime,
                                        party: `${bookingDetail.numberOfPeople}명`
                                    })}

                                    <div className={styles.booingState}>
                                        {t(`booking.state.${bookingDetail.status}`)}
                                    </div>
                                </div>


                            </div>

                            {/* 여행지 리스트 */}
                            <div className={styles.myPlan_Places}>
                                <div className={styles.MyPlan_placesTitle}>{t("myTripPlace")}</div>
                                {bookingDetail.bookingSpotSet.map((place, index) => (
                                    <div
                                        key={place.placeId}
                                        style={{
                                            padding: "12px",
                                            background: "#fff",
                                            borderRadius: 12,
                                            border: "1px solid #D9D9D9",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap:8
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div
                                                style={{
                                                    backgroundColor: ["#E74C3C", "#3498DB", "#27AE60", "#F39C12", "#9B59B6"][index % 5],
                                                    color: "#fff",
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {index + 1}
                                            </div>
                                            <span>{place.placeName}</span>
                                        </div>
                                        {place.memo && <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>{place.memo}</div>}
                                    </div>
                                ))}
                            </div>

                            {/* 여행 일정 정보 */}
                            <div className={styles.MyPlan_ItineraryDetail}>
                                <div className={styles.MyPlan}>
                                    <div className={styles.MyPlan_Itinerary}>{t("myTripSchedule")}</div>
                                    <div className={styles.FixedDropdownContainer}>
                                        <div className={styles.FixedDropdownBox}>
                                            <img src={DateIcon} alt="date"
                                                 style={{height: 19, width: 'auto'}}/>
                                            <span className={styles.FixedDropdownValue}>{bookingDetail.tripDate}</span>
                                        </div>
                                        <div className={styles.FixedDropdownBox}>
                                            <img src={FlagIcon} alt="flag"
                                                 style={{height: 19, width: 'auto'}}/>
                                            <span
                                                className={styles.FixedDropdownValue}>{t("locations.gangneungStation")}</span>
                                        </div>
                                        <div className={styles.flag_person}>
                                            <div className={styles.FixedDropdownBox} style={{ width: '148px'}}>
                                                <img src={StartTimeIcon} alt="flag"
                                                     style={{height: 19, width: 'auto'}}/>
                                                <span
                                                    className={styles.FixedDropdownValue_autonperson}>{bookingDetail.startTime}</span>
                                            </div>
                                            <div className={styles.FixedDropdownBox} style={{ width: '148px'}}>
                                                <img src={PersonIcon} alt="person"
                                                     style={{height: 19, width: 'auto'}}/>
                                                <span
                                                    className={styles.FixedDropdownValue_autonperson}>{bookingDetail.numberOfPeople}</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* 하단 버튼 */}
                            <ButtonTabBar
                                Button={
                                    <Button  variant="primary"
                                        size="large"

                                        onClick={() => {
                                            if (bookingDetail.status === "COMPLETED") {
                                                navigate("/review/write");  // 후기 작성
                                            } else {
                                                alert(t("booking.contactCenter")); // 고객센터 문의
                                            }
                                        }}
                                    >
                                        {bookingDetail.status === "COMPLETED"
                                            ? t("booking.writeReview")
                                            : t("booking.contactCenter")}
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
