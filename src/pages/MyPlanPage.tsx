import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../components/header/Header";
import MenuApp from "../components/MenuApp";
import Button from "../components/common/Button/CommonBtn";
import styles from "./MyPlanPage.module.css";
import { useTranslation } from "react-i18next";
import { useApi } from "../hooks/useApi";
import useAuthStore from "../stores/authStore";
import CardCarousel from '../components/feature/Carousel/CardCarousel';

interface Place {
    id: number;
    title: string;
    lat?: number;
    lng?: number;
}

export default function Page() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { apiCall, isLoading } = useApi();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const {isLoggedIn} = useAuthStore();

    const [visitedPlaces, setVisitedPlaces] = useState<Place[]>(() => {
        const saved = localStorage.getItem('visitedPlaces');
        return saved ? JSON.parse(saved) : [];
    });
    const [hasSavedPlan, setHasSavedPlan] = useState(false);
    const [savedPlan, setSavedPlan] = useState<Place[]>([]);
    // const [savedButtonText, setSavedButtonText] = useState(t('savedPlanContinue'));

    const isVisitedAdded = visitedPlaces.length > 0;
    // const buttonVariant = isVisitedAdded ? 'grayDashed' : 'orangeOutline';
    const buttonText = isVisitedAdded ? t('addPlace') : t('addPlace');


    const [savedButtonText, setSavedButtonText] = useState("저장한 계획 이어하기");


    useEffect(() => {

        if (location.state?.clearVisited) {
            setVisitedPlaces([]);                   // 상태 초기화
            localStorage.removeItem('visitedPlaces'); // 로컬 초기화
        }
        const addedPlace = location.state?.addedPlace;
        if (addedPlace) {
            setVisitedPlaces(prev => {
                if (!prev.find(p => p.id === addedPlace.id)) {
                    const newList = [...prev, addedPlace];
                    localStorage.setItem('visitedPlaces', JSON.stringify(newList));
                    return newList;
                }
                return prev;
            });
        }

        // 서버에 저장된 플랜이 있는지 확인
        const checkSavedPlan = async () => {
            if (!isLoggedIn) return null;
            try {
                const res = await apiCall<{
                    tripPlan: { tripDate: string | null; startTime: string | null; numberOfPeople: number | null };
                    visitSpotSet: Array<{ id: number; name: string;  latitude?: number; longitude?: number  }>;
                    updatedAt: string | null; }>("/trip-plan?locale=KO", "GET");
                console.log("checkSavedPlan res:", res)
                if (res.status === 200 && res.data?.visitSpotSet?.length) {
                    const serverPlaces = res.data.visitSpotSet.map(p => ({
                        id: p.id,
                        title: p.name,
                        lat: p.latitude,    // lat 으로 수정 예정
                        lng: p.longitude,}));    // lng 으로 수정 예정
                    setSavedPlan(serverPlaces);
                    setHasSavedPlan(true);

                    const updatedAt = res.data.updatedAt ? new Date(res.data.updatedAt) : null;
                    let dateText = "";
                    if (updatedAt) {
                        const month = (updatedAt.getMonth() + 1).toString().padStart(2, "0");
                        const day = updatedAt.getDate().toString().padStart(2, "0");
                        dateText = `${month}.${day} `;
                    }



                    if (visitedPlaces.length > 0) {
                        setSavedButtonText(`${dateText}${t('savedPlanAdd')}`);
                    } else {
                        setSavedButtonText(`${dateText}${t('savedPlanContinue')}`);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        checkSavedPlan();
    }, [location.state]);

    const isAuthenticated = !!localStorage.getItem("accessToken");

    useEffect(() => {
        setShowLoginModal(!isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
        setSavedButtonText(prev => {
            if (!hasSavedPlan) return prev;
            const dateText = savedPlan.length > 0 ? savedButtonText.split(' ')[0] + ' ' : '';
            return visitedPlaces.length > 0
                ? `${dateText}${t('savedPlanAdd')}`
                : `${dateText}${t('savedPlanContinue')}`;
        });
    }, [i18n.language]);
    const handleStartTravel = () => navigate('/list');

    // 저장된 플랜 불러오기
    const handleLoadSavedPlan = () => {
        const combinedPlaces = hasSavedPlan
            ? [
                ...savedPlan,
                ...visitedPlaces.filter(vp => !savedPlan.some(sp => sp.id === vp.id))
            ]
            : [...visitedPlaces];

        setShowSavedPlaces(prev => !prev);
    };

    const [showSavedPlaces, setShowSavedPlaces] = useState(false);

    // MyPlanPage 좋아요 리스트
    const [likeCards, setLikeCards] = useState<any[]>([]);
    const [isLikesLoading, setIsLikesLoading] = useState(false);

    useEffect(() => {
        const fetchLikedPlaces = async () => {
            if (!isLoggedIn) return; // 비로그인 시 요청 안 함
            setIsLikesLoading(true);
            try {
                const res = await apiCall<{
                    hasNext: boolean;
                    content: Array<{
                        id: number;
                        language: string;
                        placeId: number;
                        name: string;
                        type: string;
                        thumbnailUrl: string;
                    }>;
                }>("/user/like-places?size=20&locale=KO", "GET");

                if (res.status === 200 && res.data !== null && res.data.content) {
                    const formattedCards = res.data.content.map(item => ({
                        id: item.placeId,
                        title: item.name,
                        description: "",
                        image: item.thumbnailUrl,
                        rank: undefined,
                        type: item.type
                    }));
                    setLikeCards(formattedCards);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setIsLikesLoading(false);
            }
        };

        fetchLikedPlaces();
    }, [isLoggedIn]);

    // 디테일 페이지로 넘길 방문지 결정
    const handleViewPlanDetail = () => {
        const placesToSend = showSavedPlaces
            ? [
                ...savedPlan,
                ...visitedPlaces.filter(vp => !savedPlan.some(sp => sp.id === vp.id))
            ]
            : [...visitedPlaces];

        if (placesToSend.length === 0) return; // 아무 것도 없으면 이동하지 않음

        navigate('/myplan-detail', { state: { visitedPlaces: placesToSend } });
        console.log("전달 직전 visitedPlaces:", visitedPlaces);
    };


    return (
        <div className={styles.Page}>
            <div className={styles.MyPlanPage}>
                <Header useBackground={true} />

                {showLoginModal && (
                    <div className={styles.guestContainer}>
                        <img src="/InfoIcon/taxi.svg" alt="Taxi" className={styles.image} />
                        <div className={styles.TexiTitle}>
                            <div className={styles.textTitle}>
                                지금 가입하고<br/>
                                계획부터 예약까지<br/>
                                간편하게 진행해요
                            </div>
                            <Button variant="primary" size="large" borderRadius="12px"
                                    onClick={() => navigate("/signup/email/1")}
                            >
                                회원가입
                            </Button>
                        </div>

                    </div>
                )}
                <div className={styles.MyPlanCreate}>
                    <div className={styles.MyPlan}>
                        <div className={styles.MyPlanTitle}>{t('myPlanTitle')}</div>


                        {/* 저장된 플랜 버튼 */}
                        {hasSavedPlan && (
                            <div>
                                <Button
                                    variant="orangeOutline"
                                    size="large"
                                    borderRadius="12px"
                                    onClick={handleLoadSavedPlan}
                                >
                                  <span className={styles.savedButtonContent}>
                                    <img
                                        src={
                                            showSavedPlaces
                                                ? "/InfoIcon/orangeArrowDown.svg"
                                                : "/InfoIcon/orangeArrowRight.svg"
                                        }
                                        alt="arrow"
                                        className={`${styles.arrowIcon} ${
                                            showSavedPlaces ? styles.arrowDown : styles.arrowRight
                                        }`}
                                    />
                                      {savedButtonText}
                                  </span>
                                </Button>

                                {showSavedPlaces && (
                                    <div className={styles.SavedPlaces}>
                                        {savedPlan.map((place) => (
                                            <div key={place.id} className={styles.placeItemWrapper}>
                                                <Button
                                                    variant="blackOutline"
                                                    size="large"
                                                    borderRadius="12px"
                                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px' }}
                                                >
                                                    <span className={styles.pinBtn} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <img
                                                            src="/InfoIcon/pinIcon.svg"
                                                            alt="pin"
                                                            style={{ width: 18, height: 18 }}
                                                        />
                                                        {place.title}
                                                    </span>
                                                    <span
                                                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setVisitedPlaces(prev => {
                                                                const newList = prev.filter(p => p.id !== place.id);
                                                                localStorage.setItem('visitedPlaces', JSON.stringify(newList));
                                                                return newList;
                                                            });
                                                        }}
                                                    >
                                                        ✕
                                                    </span>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        )}

                        <div className={styles.MyPlanDetail}>
                            {visitedPlaces.length > 0 && (
                                <div className={styles.VisitedPlaces}>
                                    {visitedPlaces.map((place) => (
                                        <div key={place.id} className={styles.placeItemWrapper}>
                                            <Button
                                                variant="blackOutline"
                                                size="large"
                                                borderRadius="12px"
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px' }}
                                            >
                                                <span className={styles.pinBtn} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <img
                                                        src="/InfoIcon/pinIcon.svg"
                                                        alt="pin"
                                                        style={{ width: 18, height: 18 }}
                                                    />
                                                    {place.title}
                                                </span>
                                                <span
                                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setVisitedPlaces(prev => {
                                                            const newList = prev.filter(p => p.id !== place.id);
                                                            localStorage.setItem('visitedPlaces', JSON.stringify(newList));
                                                            return newList;
                                                        });
                                                    }}
                                                >
                                                    ✕
                                                </span>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button
                                variant="grayDashed"
                                size="large"
                                borderRadius="12px"
                                onClick={handleStartTravel}
                            >
                                <span className={styles.plusBtn}>
                                    <img
                                        src="/InfoIcon/plusgrayIcon.svg"
                                        alt="plus"
                                        style={{ width: 18, height: 18 }}
                                    />
                                    {buttonText}
                                </span>
                            </Button>

                            <Button
                                variant={visitedPlaces.length > 0 || showSavedPlaces ? "primary" : "grayPrimary"}
                                size="large"
                                borderRadius="12px"
                                onClick={handleViewPlanDetail}
                                disabled={visitedPlaces.length === 0 && !showSavedPlaces}
                            >
                                {t('viewPlan')}
                            </Button>



                        </div>
                    </div>
                </div>

                <div className={styles.MyPlanLikeContent}>
                    <div className={styles.LikeTitle}>{t('likedSpots')}</div>
                    <div className={styles.LikeList}>
                        <CardCarousel cards={likeCards} isLoading={isLikesLoading} />
                    </div>
                </div>

                <MenuApp defaultIndex={1} />
            </div>
        </div>
    );
}
