import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../components/header/Header";
import MenuApp from "../components/MenuApp";

import DropdownInput from '../components/common/DropdownInput';
import CardCarousel from "../components/feature/Carousel/CardCarousel";
import Button from "../components/common/Button/CommonBtn";



import styles from "./MyPlanPage.module.css";
import { useTranslation } from "react-i18next";

interface Place {
    id: number;
    title: string;
}

export default function Page() {
    const { t } = useTranslation();


    const navigate = useNavigate();
    const location = useLocation();

    const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([]);


    // 버튼 상태 결정
    const isVisitedAdded = visitedPlaces.length > 0;
    const buttonVariant = isVisitedAdded ? 'grayDashed' : 'orangeOutline';
    const buttonText = isVisitedAdded ? t('addPlace') : t('myPlanStart');

    useEffect(() => {
        const addedPlace = location.state?.addedPlace;
        console.log("location.state:", location.state);
        console.log("addedPlace:", addedPlace);
        const testPlaces: Place[] = [
            { id: 1, title: 'BTS 버스정류장' },
            { id: 2, title: '강릉항' },
            { id: 3, title: '주문진 해변' }
        ];
        setVisitedPlaces(testPlaces);
        if (addedPlace) {
            setVisitedPlaces(prev => {
                if (!prev.find(p => p.id === addedPlace.id)) {
                    return [...prev, addedPlace];
                }
                return prev;
            });
        }
    }, [location.state]);

    const handleStartTravel = () => {
        navigate('/list');
    };

    return (
        <div className={styles.Page}>
            <div className={styles.MyPlanPage}>
                <Header useBackground={true} />

                <div className={styles.MyPlanCreate}>
                    <div className={styles.MyPlan}>
                        <div className={styles.MyPlanTitle}>{t('myPlanTitle')}</div>
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
                                                        setVisitedPlaces(prev => prev.filter(p => p.id !== place.id));
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
                                variant={buttonVariant}
                                size="large"
                                borderRadius="12px"
                                onClick={handleStartTravel}
                            >
                                <span className={styles.plusBtn}>
                                    <img
                                        src="/InfoIcon/plusColorIcon.svg"
                                        alt="plus"
                                        style={{width: 18, height: 18}}
                                    />
                                    {buttonText}
                                </span>
                            </Button>


                            <Button
                                variant={visitedPlaces.length > 0 ? "primary" : "grayDashed"}
                                size="large"
                                borderRadius="12px"
                                onClick={() => navigate('/myplan-detail', { state: { visitedPlaces } })}
                                disabled={visitedPlaces.length === 0}
                            >
                                {t('viewPlan')}
                            </Button>


                        </div>
                    </div>
                </div>

                <div className={styles.MyPlanLikeContent}>
                    <div className={styles.LikeTitle}>{t('likedSpots')}</div>
                    <div className={styles.LikeList}>
                        {/*<CardCarousel*/}
                        {/*    cards={[*/}
                        {/*        { id: 1, title: '카드 제목 1', description: '카드 설명입니다. 첫 번째 카드입니다.', image: 'https://picsum.photos/200/300' },*/}
                        {/*        { id: 2, title: '카드 제목 2', description: '카드 설명입니다. 두 번째 카드입니다.', image: 'https://picsum.photos/200/300' },*/}
                        {/*        { id: 3, title: '카드 제목 3', description: '카드 설명입니다. 세 번째 카드입니다.', image: 'https://picsum.photos/200/300' },*/}
                        {/*        { id: 4, title: '카드 제목 4', description: '카드 설명입니다. 네 번째 카드입니다.', image: 'https://picsum.photos/200/400' },*/}
                        {/*        { id: 5, title: '카드 제목 5', description: '카드 설명입니다. 다섯 번째 카드입니다.', image: 'https://picsum.photos/200/350' },*/}
                        {/*        { id: 6, title: '카드 제목 6', description: '카드 설명입니다. 여섯 번째 카드입니다.', image: 'https://picsum.photos/200/250' },*/}
                        {/*    ]}*/}
                        {/*/>*/}
                    </div>
                </div>

                <MenuApp defaultIndex={1} />
            </div>
        </div>
    );
}
