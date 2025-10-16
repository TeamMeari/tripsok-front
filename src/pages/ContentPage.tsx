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
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import useAuthStore from '../stores/authStore';

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

interface CardType {
    id: number;
    title: string;
    description: string;
    image: string;
    type: "restaurant" | "tour" | "accommodation";
    rank?: number;
}


const ContentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation(); // i18n.language 사용
    const { apiCall: fetchApi, isLoading } = useApi();
    const { isLoggedIn } = useAuthStore();

    const [place, setPlace] = useState<PlaceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const { type, id } = useParams<{ type: string; id: string }>();

    const { apiCall: likePatchApiCall } = useApi();
    const { apiCall: likeFetchApiCall } = useApi();
    const [liked, setLiked] = useState(false);

    const [nearCards, setNearCards] = useState<CardType[]>([]);
    const [isLoadingNearCards, setIsLoadingNearCards] = useState(false);

    const handleClickLike = () => {
        if (!isLoggedIn) return;
        // 먼저 UI 반영, 오류 시 롤백
        setLiked(prev => !prev);
        likePatchApiCall(`user/like-place/${id}`, 'POST').then(response => {
            if (response.status !== 200) {
                setLiked(prev => !prev);
            }
        })
    }

    const fetchLike = () => {
        if (!isLoggedIn) return;
        likeFetchApiCall(`user/like-places?size=20&type=${type?.toUpperCase()}&locale=${i18n.language.toUpperCase()}`, 'GET').then(response => {
            if (response.status === 200 && response.data) {
                const data = response.data as { content: { placeId: number }[] };
                if ('content' in data) {
                    setLiked(data.content.some(like => like.placeId === Number(id)));
                }
            }
        })
    }
    
    console.log("URL 파라미터 type:", type);
    console.log("URL 파라미터 id:", id);

    useEffect(() => {
        if (!type || !id) return;
        const locale = i18n.language || "ko";

        setLoading(true);
        fetchApi<PlaceResponse>(`/places/${type}/${id}?locale=${locale}`, "GET")
            .then((res) => {
                if (res.status === 200) setPlace(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [type, id, i18n.language]);

    useEffect(() => {
        if (!place) return;
        setIsLoadingNearCards(true);

        const fetchNearbyPlaces = async () => {
            try {
                const res = await fetchApi<
                    {
                        id: number;
                        language: string;
                        name: string;
                        type: string;
                        lat: number;
                        lng: number;
                        thumbnailUrl: string;
                        updatedAt: string;
                    }[]
                >(
                    `/places/nearby?lat=${place.mapY}&lng=${place.mapX}&distance=10km&size=6&locale=${i18n.language.toLowerCase()}`,
                    "GET"
                );

                if (res.status === 200 && res.data) {
                    const formattedCards: CardType[] = res.data.map((item) => {
                        const cardType: "restaurant" | "tour" | "accommodation" =
                            item.type === "restaurant" || item.type === "tour" || item.type === "accommodation"
                                ? item.type
                                : "restaurant";
                        return {
                            id: item.id,
                            title: item.name,
                            description: "",
                            image: item.thumbnailUrl,
                            type: cardType,
                        };
                    });
                    setNearCards(formattedCards);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingNearCards(false);
            }
        };

        fetchNearbyPlaces();
    }, [place, i18n.language, fetchApi]);

    const handleCardClick = (card: CardType) => {
        navigate(`/content/${card.type}/${card.id}`);
    };

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

    useEffect(() => {
        if (isLoggedIn) {
            fetchLike();
        }
    }, [isLoggedIn]);

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
                <CardCarousel cards={nearCards} isLoading={isLoadingNearCards}  onCardClick={handleCardClick} />
            </div>

            <div className={styles.fixedBtn}>
                <LikeButton initialLiked={liked} onClick={handleClickLike}/>
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
