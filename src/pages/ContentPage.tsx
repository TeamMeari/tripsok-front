import React, { useState, useEffect }  from 'react';
import { useTranslation } from "react-i18next";
import TransparentHeader from '../components/header/TransparentHeader';
import ContentCarousel from '../components/feature/Carousel/ContentCarousel';
import CardCarousel from '../components/feature/Carousel/CardCarousel';
import HashtagButton from "../components/common/HashtagBtn";
import styles from './ContentPage.module.css';
import Button from '../components/common/Button/CommonBtn';
import LikeButton from '../components/common/Button/LikeBtn';
import KakaoMap from "../components/KakaoMap";
import { useNavigate, useLocation  } from 'react-router-dom';

const ContentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const userName = "홍길동"; // 실제 로그인 사용자 이름으로 대체 가능

    const [place, setPlace] = useState<{
        id: number;
        placeName: string;
        subtitle: string;
        lat: number;
        lng: number;
        address: string;
        weekDays: string;
        openStatus: string;
        hashtags: string[];
        pointContent: string;
    } | null>(null);

    useEffect(() => {
        // 임의 데이터 세팅
        setPlace({
            id: 1,
            placeName: 'BTS 버스정류장',
            subtitle: '청춘 영화의 주인공이 되어보세요',
            lat: 37.751,
            lng: 128.876,
            address: '강원특별자치도 강릉시 주문진읍 향호리 8-55',
            weekDays: '월화수목금토일',
            openStatus: '영업중',
            hashtags: ['바다', '포토스팟', '케이팝', '관광지'],
            pointContent: `BTS 버스 정류장은 강릉 주문진 해변에 위치한 BTS 앨범재킷 촬영장소로 많은 국내외 관광객들이 찾고 있는 핫 플레이스다. 
        K-POP 최초로 미국 빌보드 음반차트 1위를 기록한 방탄소년단의 앨범재킷 사진 속에서 등장한 바닷가 버스 정류장이다. 
        촬영 당시 임시로 만들었다가 철거된 것을 관광객들을 위한 포토존으로 재현해 놓았다. 이미 방탄소년단의 국내외 팬들 사이에선 폭발적인 반응을 얻고 있으며, 주문진해변의 이색 볼거리로 떠오르고 있다.`
        });
    }, []);


    const handleAddToMyPlan = () => {
        if (!place) return;
        const addedPlace = { id: place.id, title: place.placeName, lat: place.lat, lng: place.lng};
        navigate('/myplan', { state: { addedPlace } });
    }
    return (
        <div className={styles.contentpage}>
            <div className={styles.header}>
                <TransparentHeader/>
            </div>

            {/* ContentCarousel */}
            <div className={styles.carouselWrapper}>
                <ContentCarousel
                    images={[
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop'
                    ]}
                />
            </div>

            <div className={styles.Container}>
                <div className={styles.title}>
                    <div className={styles.maintitle}>{place?.placeName}</div>
                    <div className={styles.subtitle}>{place?.subtitle}</div>
                </div>

                <div className={styles.ContetntData}>
                    <div className={styles.dataDetails}>
                        <img src="/InfoIcon/date.svg" alt="날짜" className={styles.dataIcon}/>
                        {place?.weekDays}
                    </div>
                    <div className={styles.dataDetails}>
                        <img src="/InfoIcon/time.svg" alt="시간" className={styles.dataIcon}/>
                        24시 <span className={styles.orangeText}>{place?.openStatus}</span>
                    </div>
                    <div className={styles.dataDetails}>
                        <img src="/InfoIcon/location.svg" alt="위치" className={styles.dataIcon}/>
                        {place?.address}
                    </div>
                </div>

                <div className={styles.map}>
                    {place ? (
                        <KakaoMap
                            locations={[{
                                title:place.placeName,
                                lat:place.lat,
                                lng: place.lng
                            }]}
                        />
                    ) : (
                        <div>로딩중...</div>
                    )}
                </div>

                <div className={styles.placePoint}>
                    <div className={styles.pointTitle}>
                        {t("placePointTitle")}
                    </div>

                    <div className={styles.pointTag}>
                        {place?.hashtags.map((tag) => (
                            <HashtagButton key={tag} label={tag} readOnly />
                        ))}
                    </div>

                    <div className={styles.pointContent}>
                        {place?.pointContent}
                    </div>
                </div>

                <div className={styles.cardTitel}>
                    <div className={styles.cardPlace}>BTS 정류장</div>
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
