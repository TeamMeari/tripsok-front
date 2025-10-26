import React, { useState, useRef,useEffect, CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KakaoMap from "../components/KakaoMap";
import styles from "./MyPlanDetail.module.css";
import Button from "../components/common/Button/CommonBtn";
import DropdownInput from "../components/common/DropdownInput";
import { useTranslation } from "react-i18next";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import TransparentHeader from "../components/header/TransparentHeader";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";

import PersonIcon from "/public/InfoIcon/person.svg";
import DateIcon from "/public/InfoIcon/date.svg";
import FlagIcon from "/public/InfoIcon/flag.svg";
import StartTimeIcon from "/public/InfoIcon/starttimeIcon.svg";
import { CSS } from "@dnd-kit/utilities";
import { useApi } from "../hooks/useApi";

interface Place {
    id: number;
    title: string;
    lat?: number;
    lng?: number;
    memo?:string;
    latitude?: number;   // 수정 예정 -> 제거
    longitude?: number;  // 수정 예정  -> 제거
    name: string;
}


// SortableItem.tsx  드래그 앱 드랍_각각의 여행지 상태관리
function SortableItem({ place, index, updateMemo }: { place: Place; index: number; updateMemo: (id: number, memo: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: place.id });
    const [editing, setEditing] = useState(false);
    const [memo, setMemo] = useState(place.memo || "");

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "12px",
        background: "#fff",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        width: "288px",
        border: "1px solid #D9D9D9",
        
           };

    const colors = ["#E74C3C", "#3498DB", "#27AE60", "#F39C12", "#9B59B6"];
    const badgeStyle: React.CSSProperties = {
        backgroundColor: colors[index % colors.length],
        color: "#fff",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: "bold",
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <div style={badgeStyle}>{index + 1}</div>
                    {place.title}
                </span>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    {editing ? (
                        <button
                            style={{
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                color: "#3498DB",
                                fontWeight: "bold"
                            }}
                            onClick={() => {
                                updateMemo(place.id, memo);
                                setEditing(false);
                            }}
                        >
                            저장
                        </button>
                    ) : (
                        <img
                            src="/InfoIcon/pencilIcon.svg"
                            alt="pen"
                            style={{width: 18, height: 18, cursor: "pointer"}}
                            onClick={() => setEditing(true)}
                        />
                    )}
                    <span {...listeners} {...attributes} style={{cursor: "grab"}}>
                        &#9776;
                    </span>
                </div>
            </div>

            <div >
                {editing ? (
                    <input
                        type="text"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="메모를 입력하세요"
                        style={{
                            width: "100%",
                            borderRadius: 8,
                            padding: 6,
                            border: "1px solid #ccc",
                            marginTop: 8,
                            boxSizing: "border-box",
                            color: "#666666",
                            fontSize: 14,
                        }}
                    />
                ) : (
                    memo && ( // memo가 있을 때만 div 렌더링
                        <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>{memo}</div>
                    )
                )}
            </div>
        </div>
    );
}

// Exit Modal
function ExitModal({visible, onCancel, onSave}: { visible: boolean; onCancel: () => void; onSave: () => void }) {
    if (!visible) return null;
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <p className={styles.text}>
                    작성 중인 내용이 있어요.<br/>
                    저장하지 않고 나갈까요?
                </p>
                <div className={styles.buttons}>
                    <Button variant="grayPrimary"  onClick={onCancel} size="mini" borderRadius="12px">
                        나가기
                    </Button>
                    <Button variant="primary" onClick={onSave} size="mini" borderRadius="12px">
                        저장
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function MyPlanDetailPage() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { apiCall: fetchApi, isLoading } = useApi();

    const visitedPlaces: Place[] = location.state?.visitedPlaces || [];
    const [places, setPlaces] = useState<Place[]>(visitedPlaces);

    const INITIAL_HEIGHT = 200;
    const MIN_HEIGHT = 42;
    const MAX_HEIGHT = window.innerHeight * 0.8;

    const [dateValue, setDateValue] = useState("");
    const [fromValue, setFromValue] = useState("");
    const [timeValue, setTimeValue] = useState("");
    const [personValue, setPersonValue] = useState("");

    const isFormComplete = dateValue && fromValue && timeValue && personValue;
    const personOptions = [1, 2, 3, 4].map(num =>
        t("person", { num, count: num }) // count는 영어 복수 처리용
    );
    const from = [
        t("locations.gangneungStation"),
    ];

    const [sheetHeight, setSheetHeight] = useState(INITIAL_HEIGHT);
    const startY = useRef(0);
    const startHeight = useRef(100);

    const [showExitModal, setShowExitModal] = useState(false);

    //메모저장 함수
    const updateMemo = (id: number, memo: string) => {
        setPlaces((prev) =>
            prev.map((p) => (p.id === id ? { ...p, memo } : p))
        );
    };

    const generateTimeOptions = () => {
        const options: string[] = [];
        for (let hour = 9; hour <= 18; hour++) {
            options.push(`${hour.toString().padStart(2, "0")}:00`);
            if (hour !== 18) options.push(`${hour.toString().padStart(2, "0")}:30`);
        }
        return options;
    };
    const timeOptions = generateTimeOptions();

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

    const sensors = useSensors(useSensor(PointerSensor));

    const handleSavePlan = async (goToPayment: boolean) => {
        const body = {
            tripPlan: {
                tripDate: dateValue,
                startTime: timeValue,
                numberOfPeople: personValue ? parseInt(personValue, 10) : null,
            },
            visitSpotSet: places.map((p, index) => ({
                placeId: p.id,
                memo:  p.memo || "",
                orderIndex: index + 1,
            })),
        };
        const currentLocale = i18n.language.toUpperCase();
        console.log("보낼 body:", body);
        try {
            // 여행계획 저장 (토큰 자동 포함)
            const res = await fetchApi(`/trip-plan?locale=${currentLocale}`, "POST", body);
            console.log("저장 성공:", res);

            // 결제 전 검증 API
            if (goToPayment) {
                const validationRes = await fetchApi(`/booking`, "GET");

                if (validationRes?.status === 204 || validationRes === null) {
                    localStorage.removeItem("visitedPlaces");
                    setPlaces([]);
                    setShowExitModal(false);
                    navigate("/payment", {
                        state: {
                            places,
                            date: dateValue,
                            from: fromValue,
                            time: timeValue,
                            person: personValue,
                            mapLocations: visitedPlaces.map(p => ({
                                lat: p.lat || 37.751,
                                lng: p.lng || 128.876,
                                title: p.title,
                            })),
                            clearVisited: true,
                        },
                    });
                } else {
                    alert("예약 검증에 실패했습니다. 다시 시도해주세요.");
                }
            } else {
                navigate("/");
            }


        } catch (err) {
            console.error("저장 실패:", err);
            alert("여행 계획 저장에 실패했습니다.");
        }
    };

    const savedPlan: Place[] = location.state?.savedPlan || [];
    const mapLocations = [
        ...savedPlan,
        ...visitedPlaces.filter(
            vp => !savedPlan.some(sp => sp.id === vp.id)
        ),
    ].map(p => ({
        lat: p.lat || p.latitude || 37.751,   // latitude  수정 예정 -> lat 만 가능
        lng: p.lng || p.longitude || 128.876, // longitude 수정 예정 -> lng 만 가능
        title: p.title || p.name,
    }));
    console.log("✅ savedPlan 데이터:", savedPlan);
    console.log("✅ visitedPlaces 데이터:", visitedPlaces);
    console.log("카카오맵에 보내는 값:", mapLocations);
    return (
        <div style={{ height: "100vh", position: "relative" }}>
            <TransparentHeader
                type="auth"
                fixed
                onBackClick={() => setShowExitModal(true)}
            />

            <ExitModal
                visible={showExitModal}
                onCancel={() => {
                    setShowExitModal(false);
                    navigate(-1);
                }}

                onSave={() => handleSavePlan(false)}
            />
            <div style={{ height: "100%", width: "100%" }}>
                <KakaoMap
                    locations={mapLocations}
                    width="100%"
                    height="100%"
                />
            </div>

            {/* Bottom Sheet */}
            <div
                className={styles.bottomSheet}
                style={{ height: sheetHeight }}
            >
                {/* 손잡이 */}
                <div
                    className={styles.dragHandle}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                ></div>

                {/* 내용 영역 */}
                {sheetHeight > MIN_HEIGHT && (
                    <div className={styles.MyPlan_Detail}>
                        <div className={styles.contentContainer}>
                            {/* 드래그앤 드롭 */}
                            <div className={styles.myPlan_Places}>
                                <div className={styles.myPlan_PlacesList}>
                                    <div className={styles.MyPlan_placesTitle}>{t("upcomingPlaces")}</div>
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={event => {
                                            const { active, over } = event;
                                            if (over && active.id !== over.id) {
                                                const oldIndex = places.findIndex(p => p.id === active.id);
                                                const newIndex = places.findIndex(p => p.id === over.id);
                                                const newPlaces = arrayMove(places, oldIndex, newIndex);
                                                setPlaces(newPlaces);
                                                console.log("변경된 순서:", newPlaces.map(p => p.title));
                                            }
                                        }}
                                    >

                                        <SortableContext
                                            items={places.map(p => p.id)}
                                            strategy={verticalListSortingStrategy}
                                        >

                                            {places.map((place, index) => (
                                                <SortableItem key={place.id} place={place} index={index} updateMemo={updateMemo} />
                                            ))}
                                        </SortableContext>

                                    </DndContext>
                                </div>
                            </div>

                            <div className={styles.MyPlan_ItineraryDetail}>
                                <div className={styles.MyPlan}>
                                    <div className={styles.MyPlan_Itinerary}>{t("itineraryTitle")}</div>
                                    <div className={styles.DropdownInputs}>
                                        <DropdownInput
                                            value={dateValue}
                                            onChange={setDateValue} //날짜
                                            options={from}
                                            placeholder={t('myPlanDate')}
                                            leftIcon={<img src={DateIcon} alt="date"
                                                           style={{height: 19, width: 'auto'}}/>}
                                            type="date"
                                        />
                                        <DropdownInput
                                            value={fromValue}
                                            onChange={setFromValue} //출발지
                                            options={from}
                                            placeholder={t('myPlanDeparture')}
                                            leftIcon={<img src={FlagIcon} alt="flag"
                                                           style={{height: 19, width: 'auto'}}/>}
                                        />
                                        <div className={styles.Myplan_FromPerson}>
                                            <DropdownInput
                                                value={timeValue}
                                                onChange={setTimeValue}   //출발시간
                                                options={timeOptions}
                                                placeholder={t("myPlanDepartureTime")}
                                                width={148}
                                                leftIcon={<img src={StartTimeIcon} alt="flag"
                                                               style={{height: 19, width: 'auto'}}/>}
                                            />
                                            <DropdownInput
                                                value={personValue}
                                                onChange={(val) => setPersonValue(String(val))} //인원
                                                options={personOptions}
                                                placeholder={t('myPlanPeople')}
                                                width={148}
                                                leftIcon={<img src={PersonIcon} alt="person"
                                                               style={{height: 19, width: 'auto'}}/>}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 고정 버튼 */}
            <div className={styles.fixedBottomArea}>
                <Button  variant={isFormComplete ? "primary" : "grayPrimary"}
                         size="large"
                         borderRadius="12px"
                         disabled={!isFormComplete}

                         onClick={() => handleSavePlan(true)}
                >
                    {t("reserveButton")}
                </Button>
            </div>
        </div>
    );
}
