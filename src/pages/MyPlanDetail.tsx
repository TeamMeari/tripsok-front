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

interface Place {
    id: number;
    title: string;
    lat?: number;
    lng?: number;
}


// SortableItem.tsx  드래그 앱 드랍_각각의 여행지 상태관리
function SortableItem({ place, index }: { place: Place; index: number }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: place.id });
    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "12px",
        background: "#fff",
        borderRadius: 12,
        display: "flex",
        height: "28px",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "default",
        border: "1px solid #D9D9D9",
        width: "288px"
    };

    const colors = ["#E74C3C", "#3498DB", "#27AE60", "#F39C12", "#9B59B6"];

    const badgeStyle: React.CSSProperties =  {
        backgroundColor: colors[index % colors.length],
        color: "#fff",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: "bold"
    };

    const titleStyle: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        alignItems: "center"
    };

    return (
        <div ref={setNodeRef} style={style}>
      <span style={titleStyle}>
        <div style={badgeStyle}>{index + 1}</div>
          {place.title}
      </span>
            <span {...listeners} {...attributes} style={{ cursor: "grab" }}>
        &#9776;
      </span>
        </div>
    );
}

// Exit Modal
function ExitModal({ visible, onCancel, onSave }: { visible: boolean; onCancel: () => void; onSave: () => void }) {
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
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    // const visitedPlaces: Place[] = [    //테스트 용입니다 실제 사용은 아래 주석 처리된 코드로 진행
    //     { id: 1, title: "BTS 버스정류장", lat: 37.751, lng: 128.876 },
    //     { id: 2, title: "강릉항", lat: 37.752, lng: 128.874 },
    //     { id: 3, title: "주문진 해변", lat: 37.776, lng: 128.89 },
    // ];
    const visitedPlaces: Place[] = location.state?.visitedPlaces || [];
    const [places, setPlaces] = useState<Place[]>(visitedPlaces);

    const INITIAL_HEIGHT = 200;
    const MIN_HEIGHT = 42;
    const MAX_HEIGHT = window.innerHeight * 0.8;

    const [dateValue, setDateValue] = useState("");
    const [fromValue, setFromValue] = useState("");
    const [timeValue, setTimeValue] = useState("");
    const [personValue, setPersonValue] = useState("");

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

    const generateTimeOptions = () => {
        const options: string[] = [];
        for (let hour = 9; hour <= 18; hour++) {
            options.push(`${hour.toString().padStart(2, "0")}:00`);
            if (hour !== 18) options.push(`${hour.toString().padStart(2, "0")}:30`);
        }
        return options;
    };
    const timeOptions = generateTimeOptions();

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        startY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
        startHeight.current = sheetHeight;

        const handleDrag = (moveEvent: MouseEvent | TouchEvent) => {
            const clientY =
                "touches" in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
            const diff = startY.current - clientY;
            let newHeight = startHeight.current + diff;

            if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
            if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;

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
        window.addEventListener("touchmove", handleDrag);
        window.addEventListener("touchend", handleDragEnd);
    };

    const sensors = useSensors(useSensor(PointerSensor));

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
                onSave={() => {
                    setShowExitModal(false);
                    navigate("/");
                }}
            />
            <div style={{ height: "100%", width: "100%" }}>
                <KakaoMap
                    locations={visitedPlaces.map(p => ({
                        lat: p.lat || 37.751,
                        lng: p.lng || 128.876,
                        title: p.title
                    }))}
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
                                                <SortableItem key={place.id} place={place} index={index} />
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
                                                onChange={setPersonValue} //인원
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
                <Button variant="primary" size="large" borderRadius="12px"
                        onClick={() =>
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
                                            title: p.title
                                        }))
                                    }
                            })
                        }>
                    {t("reserveButton")}
                </Button>
            </div>
        </div>
    );
}
