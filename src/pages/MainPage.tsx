import styles from './MainPage.module.css';
import MainCarousel from '../components/feature/Carousel/MainCarousel';
import { useEffect, useState } from 'react';
import MenuTab from '../components/feature/Tab/MenuTab';
import menuTabs from '../types/menuTabs';
import { Trans, useTranslation } from 'react-i18next';
import CardCarousel from '../components/feature/Carousel/CardCarousel';
import Footer from '../components/Footer';
import BannerCarousel from '../components/feature/Carousel/BannerCarousel';
import { getDailyKeywords } from '../utils/keywordSelector';
import { useApi } from '../hooks/useApi';
import CardType from '../types/Card';
import { MainCarouselItem } from '../components/feature/Carousel/MainCarousel';
import { PlacesResponse, Place } from '../types/apiResponse';
import { convertTypeToLowerCase } from '../utils/converter';

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const dailyKeywords = getDailyKeywords();
  const [mainCarouselItems, setMainCarouselItems] = useState<MainCarouselItem[]>([]);
  const [top5CardCarouselItems, setTop5CardCarouselItems] = useState<CardType[]>([]);
  const [firstCardCarouselItems, setFirstCardCarouselItems] = useState<CardType[]>([]);
  const [secondCardCarouselItems, setSecondCardCarouselItems] = useState<CardType[]>([]);
  const { apiCall: MainCarouselApiCall, isLoading: MainCarouselIsLoading } = useApi();
  const { apiCall: Top5CardCarouselApiCall, isLoading: Top5CardCarouselIsLoading } = useApi();
  const { apiCall: FirstCardCarouselApiCall, isLoading: FirstCardCarouselIsLoading } = useApi();
  const { apiCall: SecondCardCarouselApiCall, isLoading: SecondCardCarouselIsLoading } = useApi();

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  }

  const fetchMainCarouselPlaces = () => {
    // keyword 하나 사용
    const queryParams = `?page=0&size=10&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=text&categoryFilter=false&q=${t(dailyKeywords[0])}`;
    MainCarouselApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data) {
        setMainCarouselItems(response.data.items.map((v: Place) => ({
            id: v.id,
            image: v.thumbnailUrl,
            type: convertTypeToLowerCase(v.type),
          })) as MainCarouselItem[]);
        } else setMainCarouselItems([]);
      }
    });
  }

  const fetchTop5CardCarouselPlaces = () => {
    const queryParams = `?page=0&size=10&sortKey=rank&direction=desc&locale=${i18n.language}&categoryFilter=false&q=${t("gangneung")}`;
    Top5CardCarouselApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data) {
          setTop5CardCarouselItems(response.data.items.slice(0, 5).map((v: Place, idx: number) => ({
            id: v.id,
            image: v.thumbnailUrl,
            rank: idx + 1,
            title: v.name,
            description: v.summary,
            type: convertTypeToLowerCase(v.type),
          })) as CardType[]);
        } else setTop5CardCarouselItems([]);
      }
    });
  }

  const fetchFirstCardCarouselPlaces = () => {
    // keyword 하나 사용
    const queryParams = `?page=0&size=10&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=text&categoryFilter=false&q=${t(dailyKeywords[1])}`;
    FirstCardCarouselApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data) {
          setFirstCardCarouselItems(response.data.items.map((v: Place) => ({
            id: v.id,
            image: v.thumbnailUrl,
            title: v.name,
            description: v.summary,
            type: convertTypeToLowerCase(v.type),
          })) as CardType[]);
        } else setFirstCardCarouselItems([]);
      }
    });
  }

  const fetchSecondCardCarouselPlaces = () => {
    // keyword 하나 사용
    const queryParams = `?page=0&size=10&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=text&categoryFilter=false&q=${t(dailyKeywords[2])}`;
    SecondCardCarouselApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data) {
          setSecondCardCarouselItems(response.data.items.map((v: Place) => ({
            id: v.id,
            image: v.thumbnailUrl,
            title: v.name,
            description: v.summary,
            type: convertTypeToLowerCase(v.type),
          })) as CardType[]);
        } else setSecondCardCarouselItems([]);
      }
    });
  }

  const texts = [
    t("mainCarouselText"),
    t("mainCarouselText2"),
    t("mainCarouselText3"),
    t("mainCarouselText4"),
  ]

  // 수정 필요
  const bannerCarouselItems = [
    {
      url: "/",
      image: "https://cdn.pixabay.com/photo/2025/06/13/14/48/bird-9658215_1280.jpg",
    },
    {
      url: "/",
      image: "https://cdn.pixabay.com/photo/2022/11/17/09/49/fog-7597710_1280.jpg",
    },
    {
      url: "/",
      image: "https://cdn.pixabay.com/photo/2020/11/04/18/59/leaves-5713290_1280.jpg",
    }
  ]

  useEffect(() => {
    fetchMainCarouselPlaces();
    fetchTop5CardCarouselPlaces();
    fetchFirstCardCarouselPlaces();
    fetchSecondCardCarouselPlaces();
  }, [t]);

  return <div className={styles.page}>
    <MainCarousel
      items={mainCarouselItems}
      texts={texts}
      isLoading={MainCarouselIsLoading}
    />
    <div className={styles.space}></div>
    <MenuTab tabs={menuTabs} activeTab={activeTab} isIcon={true} tabOnClick={handleTabClick} />
    <div className={styles.section1}>
      <div className={styles.cardList}>
        <TitleLink i18nKey="mainTopSpots" link="/list" />
        <CardCarousel cards={top5CardCarouselItems} isLoading={Top5CardCarouselIsLoading} />
      </div>
      <div className={styles.cardList}>
        <TitleLink i18nKey="mainKeywordSpotsFirst" values={{ keyword: dailyKeywords[1] }} link="/list" />
        <CardCarousel cards={firstCardCarouselItems} isLoading={FirstCardCarouselIsLoading} />
      </div>
      <div className={styles.listLinkContainer}>
        <a href="/list">{t("mainMoreSpots")}</a>
      </div>
    </div>
    <div className={styles.section2}>
      <BannerCarousel banners={bannerCarouselItems} />
      <div className={styles.cardList}>
        <TitleLink i18nKey="mainKeywordSpotsSecond" values={{ keyword: dailyKeywords[2] }} link="/list" />
        <CardCarousel cards={secondCardCarouselItems} isLoading={SecondCardCarouselIsLoading} />
      </div>
    </div>
    <Footer />
  </div>;
};

const TitleLink = ({ i18nKey, values, link }: { i18nKey: string, values?: any, link: string }) => {
  return <a href={link} className={styles.titleLink}>
    {<Trans i18nKey={i18nKey} values={values} />} <span>&gt;</span>
  </a>
}

export default MainPage;