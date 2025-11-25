import { useEffect, useState } from 'react';
import styles from './ReviewFormPage.module.css';
import { Star } from 'lucide-react';
import CheckBox from '../../components/common/CheckBox';
import { reviewOptions } from '../../types/review';
import { Trans, useTranslation } from 'react-i18next';
import { getEnMonthName } from '../../utils/converter';
import Input from '../../components/common/Input';
import AppBar from '../../components/common/AppBar';
import Button from '../../components/common/Button/CommonBtn';
import { useNavigate } from 'react-router-dom';

const examplePlaces = [
    {
        title: 'BTS 정류장',
        type: "tour"
    },
    {
        title: '동화가든',
        type: "restaurant"
    },
    {
        title: '세인트 존스',
        type: "accommodation"
    }
]

const ReviewFormPage = () => {
    const { t, i18n } = useTranslation();
    const [stars, setStars] = useState(0);
    const [viewStars, setViewStars] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Set<number>>(new Set());
    const [placeReviews, setPlaceReviews] = useState<string[]>([]);
    const navigate = useNavigate();

    // 사람 수 카운트
    const getStringPersonCount = (count: number) => {
        const lang = i18n.language;
        switch (lang) {
            case 'ko':
            return `${count}명`;
            case 'en':
            return `${count} ${count === 1 ? 'person' : 'people'}`;
            case 'ja':
            return `${count}人`;
            case 'cn':
            return `${count}人`;
            default:
            return `${count} people`;
        }
    }

    // 이벤트 처리
    const handleClickStar = () => {
        setStars(viewStars);
    }

    const handleMouseOverAndMoveStar = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const starElement = e.currentTarget;
        const { left, width } = starElement.getBoundingClientRect();
        const mouseX = e.clientX;
        const relativeX = mouseX - left;
        if (relativeX < width / 3) {
            setViewStars(index);
        } else {
            setViewStars(index + 1);
        }
    }

    const handleMouseOutStar = () => {
        setViewStars(stars);
    }

    const handleTouchStars = (e: React.TouchEvent<HTMLDivElement>) => {
        const starsElement = e.currentTarget;
        const { left, width } = starsElement.getBoundingClientRect();
        const touchX = e.targetTouches[e.targetTouches.length - 1].clientX;
        const relativeX = touchX - left;
        setViewStars(Math.round(relativeX / width * 5))
    }

    // 첫 렌더링 시 리뷰 입력 값 초기화
    useEffect(() => {
        setPlaceReviews(Array(examplePlaces.length).fill(""));
    }, [])

    return (
        <div className={styles.page}>
            <div className={styles.part}>
                <div className={styles.mainTitleContainer}>
                    <h2 className={styles.title}>{t("howWasTaxiTour")}</h2>
                    <p className="caption">
                        <Trans
                            i18nKey="tourInfo"
                            values={{
                                year: 2025,
                                month: i18n.language === "en" ? getEnMonthName(10) : 10,
                                day: 25,
                                departure: "강릉역",
                                time: "13:00",
                                party: getStringPersonCount(2)
                            }}
                        />
                    </p>
                </div>
                

                <div className={styles.starsContainer} onTouchMove={handleTouchStars}>
                    {[...Array(5)].map((_, index) => {
                        return (
                            <button
                                className={styles.star}
                                onClick={handleClickStar}
                                onMouseOver={e => handleMouseOverAndMoveStar(e, index)}
                                onMouseOut={handleMouseOutStar}
                                onMouseMove={e => handleMouseOverAndMoveStar(e, index)}
                            >
                                <Star
                                    key={index}
                                    fill={index < viewStars ? '#ff5722' : 'none'}
                                    strokeWidth={1}
                                    color={'#ff5722'}
                                    size={48}
                                />
                            </button>
                        );
                    })}
                </div>

                <div className={styles.reviewForm}>
                    <h2 className={styles.title}>{t("askGeneral")}</h2>
                    <div className={styles.checkboxList}>
                        {
                            reviewOptions.map(key => 
                                <div className={styles.checkboxItem} key={key}>
                                    <CheckBox checked={false} disabled={false} onClick={function (): void {
                                        throw new Error('Function not implemented.');
                                    } } />
                                    <p className="body">{t(key)}</p>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className={styles.reviewForm}>
                    <h2 className={styles.title}>{t("feedback.ask.service")}</h2>
                    <Input
                        placeholder={t("feedback.placeholder.service")}
                    />
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.part}>
                {examplePlaces.map(place => 
                    <div className={styles.reviewForm}>
                        <h2 className={styles.title}>
                            <Trans 
                                i18nKey={"feedback.ask.place"}
                                values={{ place: place.title }}
                            />
                        </h2>
                        <Input
                            placeholder={t(`feedback.placeholder.${place.type}`)}
                        />
                    </div>
                )}
            </div>

            <AppBar>
                <Button
                    onClick={() => navigate('/')}
                    size="large"
                >{t('home')}</Button>
            </AppBar>
        </div>
    );
};

export default ReviewFormPage;
