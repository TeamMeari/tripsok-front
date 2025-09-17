import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import TransparentHeader from '../components/header/TransparentHeader';
import ContentCarousel from '../components/feature/Carousel/ContentCarousel';
import CardCarousel from '../components/feature/Carousel/CardCarousel';
import HashtagButton from "../components/common/HashtagBtn";
import styles from './ContentPage.module.css';
import Button from '../components/common/Button/CommonBtn';
import LikeButton from '../components/common/Button/LikeBtn';
import KakaoMap from "../components/KakaoMap";
import { useNavigate, useLocation } from 'react-router-dom';

interface Tag {
    id: number;
    tagName: string;
}

interface PlaceResponse {
    id: number;
    placeName: string;
    summary: string;
    address: string;
    information: string;
    mapX: number; // 경도
    mapY: number; // 위도
    weekDays?: string;
    openStatus?: string;
    tags: Tag[];
    child: {
        id: number;
        accommodationType: string;
        imageList: string[];
    };
}

const ContentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation(); // i18n.language 사용

    const [place, setPlace] = useState<PlaceResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const category = "accommodation"; // 예시 카테고리
                const id = 2245; // 예시 ID
                const locale = i18n.language || "ko"; // 현재 언어
                const res = await fetch(
                    `https://trip-sok.jayden-bin.cc/api/v1/places/${category}/${id}?locale=${locale}`
                );
                if (!res.ok) throw new Error("데이터 불러오기 실패");

                const data: PlaceResponse = await res.json();
                console.log("✅ API 데이터:", data);
                setPlace(data);
            } catch (error) {
                console.error("❌ API 호출 오류:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [i18n.language]); // i18n.language가 바뀌면 재호출

    const handleAddToMyPlan = () => {
        if (!place) return;
        const addedPlace = {
            id: place.id,
            title: place.placeName,
            lat: place.mapY,
            lng: place.mapX,
        };
        navigate('/myplan', { state: { addedPlace } });
    };

    if (loading) return <div>⏳ 로딩중...</div>;
    if (!place) return <div>❌ 장소 정보를 불러올 수 없습니다.</div>;
    console.log("위도(lat):", place.mapY);
    console.log("경도(lng):", place.mapX);

    return (
        <div className={styles.contentpage}>
            <div className={styles.header}>
                <TransparentHeader />
            </div>

            {/* ContentCarousel */}
            <div className={styles.carouselWrapper}>
                <ContentCarousel images={place.child.imageList} />
            </div>

            <div className={styles.Container}>
                <div className={styles.title}>
                    <div className={styles.maintitle}>{place.placeName}</div>
                    <div className={styles.subtitle}>{place.summary}</div>
                </div>

                <div className={styles.ContetntData}>
                    {place.weekDays && (
                        <div className={styles.dataDetails}>
                            <img src="/InfoIcon/date.svg" alt="날짜" className={styles.dataIcon}/>
                            {place.weekDays}
                        </div>
                    )}

                    {place.openStatus && (
                        <div className={styles.dataDetails}>
                            <img src="/InfoIcon/time.svg" alt="시간" className={styles.dataIcon}/>
                            <span className={styles.orangeText}>{place.openStatus}</span>
                        </div>
                    )}
                    <div className={styles.dataDetails}>
                        <img src="/InfoIcon/location.svg" alt="위치" className={styles.dataIcon}/>
                        {place.address ?? t("noInfo")}
                    </div>
                </div>

                <div className={styles.map}>
                    <KakaoMap
                        locations={[
                            {
                                title: place.placeName,
                                lat: place.mapY,
                                lng: place.mapX,
                            },
                        ]}
                    />
                </div>

                <div className={styles.placePoint}>
                    <div className={styles.pointTitle}>
                        {t("placePointTitle")}
                    </div>

                    <div className={styles.pointTag}>
                        {place.tags.map((tag) => (
                            <HashtagButton key={tag.id} label={tag.tagName} readOnly />
                        ))}
                    </div>

                    <div className={styles.pointContent}>
                        {place.information ?? "정보 없음"}
                    </div>
                </div>

                <div className={styles.cardTitel}>
                    <div className={styles.cardPlace}>{place.placeName}</div>
                    <div className={styles.cardFixedTitle}>{t("cardSectionTitle")}</div>
                </div>
            </div>

            {/* CardCarousel */}
            <div className={styles.carouselWrapper}>
                <CardCarousel
                    cards={[
                        {
                            id: 1,
                            title: '카드 제목 1',
                            description: '카드 설명입니다. 첫 번째 카드입니다.',
                            image: 'https://picsum.photos/200/300'
                        },
                        {
                            id: 2,
                            title: '카드 제목 2',
                            description: '카드 설명입니다. 두 번째 카드입니다.',
                            image: 'https://picsum.photos/200/300'
                        },
                        {
                            id: 3,
                            title: '카드 제목 3',
                            description: '카드 설명입니다. 세 번째 카드입니다.',
                            image: 'https://picsum.photos/200/300'
                        },
                        {
                            id: 4,
                            title: '카드 제목 4',
                            description: '카드 설명입니다. 네 번째 카드입니다.',
                            image: 'https://picsum.photos/200/400'
                        },
                        {
                            id: 5,
                            title: '카드 제목 5',
                            description: '카드 설명입니다. 다섯 번째 카드입니다.',
                            image: 'https://picsum.photos/200/350'
                        },
                        {
                            id: 6,
                            title: '카드 제목 6',
                            description: '카드 설명입니다. 여섯 번째 카드입니다.',
                            image: 'https://picsum.photos/200/250'
                        }
                    ]}
                />
            </div>

            <div className={styles.fixedBtn}>
                <LikeButton/>
                <Button variant="primary"
                        size="small"
                        borderRadius="12px"
                        onClick={handleAddToMyPlan}>
                    {t("addToJourney")}
                </Button>
            </div>
        </div>
    );
};

export default ContentPage;
