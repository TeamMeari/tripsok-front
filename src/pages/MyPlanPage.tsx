import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../components/header/Header";
import MenuApp from "../components/MenuApp";

import DropdownInput from '../components/common/DropdownInput';
import CardCarousel from "../components/feature/Carousel/CardCarousel";
import Button from "../components/common/Button/CommonBtn";

import PersonIcon from '/public/InfoIcon/person.svg';
import DateIcon from '/public/InfoIcon/date.svg';
import FlagIcon from '/public/InfoIcon/flag.svg';

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
    const [personValue, setPersonValue] = useState('');
    const [fromValue, setFromValue] = useState('');
    const [dateValue, setDateValue] = useState('');
    const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([]);

    //인원 수
    const personOptions = [1, 2, 3, 4].map(num =>
        t("person", { num, count: num }) // count는 영어 복수 처리용
    );
    const from = [
        t("locations.gangneungStation"),
    ];

    // 버튼 상태 결정
    const isVisitedAdded = visitedPlaces.length > 0;
    const buttonVariant = isVisitedAdded ? 'grayDashed' : 'orangeOutline';
    const buttonText = isVisitedAdded ? t('addPlace') : t('myPlanStart');

    useEffect(() => {
        const addedPlace = location.state?.addedPlace;
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

                            <DropdownInput
                                value={dateValue}
                                onChange={setDateValue}
                                options={from}
                                placeholder={t('myPlanDate')}
                                leftIcon={<img src={DateIcon} alt="date" style={{height: 19, width: 'auto'}}/>}
                                type="date"
                            />
                            <div className={styles.Myplan_FromPerson}>
                                <DropdownInput
                                    value={personValue}
                                    onChange={setPersonValue}
                                    options={personOptions}
                                    placeholder={t('myPlanPeople')}
                                    width={148}
                                    leftIcon={<img src={PersonIcon} alt="person" style={{height: 19, width: 'auto'}}/>}
                                />
                                <DropdownInput
                                    value={fromValue}
                                    onChange={setFromValue}
                                    options={from}
                                    placeholder={t('myPlanDeparture')}
                                    width={148}
                                    leftIcon={<img src={FlagIcon} alt="flag" style={{height: 19, width: 'auto'}}/>}
                                />
                            </div>

                            {visitedPlaces.length > 0 && (
                                <div className={styles.VisitedPlaces}>
                                    {visitedPlaces.map((place) => (
                                        <Button
                                            key={place.id}
                                            variant="blackOutline"
                                            size="large"
                                            borderRadius="12px"
                                        >
                                            <span className={styles.pinBtn}>
                                                <img
                                                    src="/InfoIcon/pinIcon.svg"
                                                    alt="pin"
                                                    style={{ width: 18, height: 18 }}
                                                />
                                                {place.title}
                                            </span>
                                        </Button>
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

                            {dateValue && personValue && fromValue && visitedPlaces.length > 0 && (
                                <Button
                                    variant="primary"
                                    size="large"
                                    borderRadius="12px"
                                    onClick={() => navigate('/travel-detail')}
                                >
                                    {t('viewPlan')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.MyPlanLikeContent}>
                    <div className={styles.LikeTitle}>{t('likedSpots')}</div>
                    <div className={styles.LikeList}>
                        <CardCarousel
                            cards={[
                                { id: 1, title: '카드 제목 1', description: '카드 설명입니다. 첫 번째 카드입니다.', image: 'https://picsum.photos/200/300' },
                                { id: 2, title: '카드 제목 2', description: '카드 설명입니다. 두 번째 카드입니다.', image: 'https://picsum.photos/200/300' },
                                { id: 3, title: '카드 제목 3', description: '카드 설명입니다. 세 번째 카드입니다.', image: 'https://picsum.photos/200/300' },
                                { id: 4, title: '카드 제목 4', description: '카드 설명입니다. 네 번째 카드입니다.', image: 'https://picsum.photos/200/400' },
                                { id: 5, title: '카드 제목 5', description: '카드 설명입니다. 다섯 번째 카드입니다.', image: 'https://picsum.photos/200/350' },
                                { id: 6, title: '카드 제목 6', description: '카드 설명입니다. 여섯 번째 카드입니다.', image: 'https://picsum.photos/200/250' },
                            ]}
                        />
                    </div>
                </div>

                <MenuApp defaultIndex={1} />
            </div>
        </div>
    );
}
