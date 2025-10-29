import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import KakaoMap from "../components/KakaoMap";
import styles from "./PlanCompletePage.module.css";
import TransparentHeader from "../components/header/TransparentHeader";
import { useApi } from "../hooks/useApi";

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
    const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);

    const INITIAL_HEIGHT = 200;
    const MIN_HEIGHT = 42;
    const MAX_HEIGHT = window.innerHeight * 0.8;
    const [sheetHeight, setSheetHeight] = useState(INITIAL_HEIGHT);
    const startY = useRef(0);
    const startHeight = useRef(100);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await apiCall<BookingDetail>("/booking/detail/143", "POST");
                setBookingDetail(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBooking();
    }, []);

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
            <TransparentHeader type="auth" fixed onBackClick={() => navigate(-1)} />

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
                            <div className={styles.TripSummary}>
                                {`${bookingDetail.tripDate} 여정`}
                                <br/>
                                {`강릉역 ${bookingDetail.startTime} ${bookingDetail.numberOfPeople}명 출발 여행전`}
                            </div>
                            {/* 여행지 리스트 */}
                            <div className={styles.myPlan_Places}>
                                <div className={styles.MyPlan_placesTitle}>나의 여행지</div>
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
                                            marginBottom: 8,
                                        }}
                                    >
                                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
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
                                        {place.memo && (
                                            <div style={{fontSize: 14, color: "#666", marginTop: 8}}>{place.memo}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* 여행 일정 정보 (고정 박스) */}
                            <div className={styles.MyPlan_ItineraryDetail}>
                                <div className={styles.MyPlan}>
                                    <div className={styles.MyPlan_Itinerary}>나의 여행 일정</div>
                                    <div className={styles.FixedDropdownContainer}>
                                        <div className={styles.FixedDropdownBox}>
                                            <span className={styles.FixedDropdownLabel}>날짜</span>
                                            <span className={styles.FixedDropdownValue}>{bookingDetail.tripDate}</span>
                                        </div>
                                        <div className={styles.FixedDropdownBox}>
                                            <span className={styles.FixedDropdownLabel}>출발지</span>
                                            <span className={styles.FixedDropdownValue}>강릉역</span>
                                        </div>
                                        <div className={styles.FixedDropdownBox}>
                                            <span className={styles.FixedDropdownLabel}>출발시간</span>
                                            <span className={styles.FixedDropdownValue}>{bookingDetail.startTime}</span>
                                        </div>
                                        <div className={styles.FixedDropdownBox}>
                                            <span className={styles.FixedDropdownLabel}>인원</span>
                                            <span
                                                className={styles.FixedDropdownValue}>{bookingDetail.numberOfPeople}명</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 하단 고정 버튼 */}
                            <div className={styles.fixedBottomArea} style={{marginTop: 12}}>
                                <button
                                    style={{
                                        width: "100%",
                                        padding: "12px 0",
                                        borderRadius: 12,
                                        backgroundColor: "#FF6B35",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => alert("후기 작성 버튼 클릭")}
                                >
                                    후기 작성
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
