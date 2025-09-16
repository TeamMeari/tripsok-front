import styles from './MainPage.module.css';
import MainCarousel from '../components/feature/Carousel/MainCarousel';
import { useEffect, useState } from 'react';
import MenuTab from '../components/feature/Tab/MenuTab';
import menuTabs from '../types/menuTabs';
import { useTranslation } from 'react-i18next';
import CardCarousel from '../components/feature/Carousel/CardCarousel';
import Footer from '../components/Footer';
import BannerCarousel from '../components/feature/Carousel/BannerCarousel';
import { getDailyKeywords } from '../utils/keywordSelector';
import { useApi } from '../hooks/useApi';
import CardType from '../types/Card';
import { BannerType } from '../components/feature/Carousel/BannerCarousel';
import { MainCarouselItem } from '../components/feature/Carousel/MainCarousel';
import { PlacesResponse, Place } from '../types/apiResponse';

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const dailyKeywords = getDailyKeywords();
  const [mainCarouselItems, setMainCarouselItems] = useState<MainCarouselItem[]>([]);
  const [top5CardCarouselItems, setTop5CardCarouselItems] = useState<CardType[]>([]);
  const [firstCardCarouselItems, setFirstCardCarouselItems] = useState<CardType[]>([]);
  const [secondCardCarouselItems, setSecondCardCarouselItems] = useState<CardType[]>([]);
  const [bannerCarouselItems, setBannerCarouselItems] = useState<BannerType[]>([]);
  const { apiCall: MainCarouselApiCall, isLoading: MainCarouselIsLoading } = useApi();
  const { apiCall: Top5CardCarouselApiCall, isLoading: Top5CardCarouselIsLoading } = useApi();
  const { apiCall: FirstCardCarouselApiCall, isLoading: FirstCardCarouselIsLoading } = useApi();
  const { apiCall: SecondCardCarouselApiCall, isLoading: SecondCardCarouselIsLoading } = useApi();
  const { apiCall: BannerCarouselApiCall, isLoading: BannerCarouselIsLoading } = useApi();

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  }

  const fetchMainCarouselPlaces = () => {
    // keyword 하나 사용
    const queryParams = `?page=1&size=5&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=embedding&categoryFilter=false&q=${dailyKeywords[0]}`;
    MainCarouselApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data) {
        setMainCarouselItems(response.data.items.map((v: Place) => ({
            id: v.id,
            image: v.thumbnailUrl,
          })) as MainCarouselItem[]);
        } else setMainCarouselItems([]);
      }
    });
  }

  const fetchTop5CardCarouselPlaces = () => {
    const queryParams = `?page=1&size=5&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=embedding&categoryFilter=false&q=${dailyKeywords[1]}`;
    Top5CardCarouselApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data) {
          setTop5CardCarouselItems(response.data.items.map((v: Place, idx: number) => ({
            id: v.id,
            image: v.thumbnailUrl,
            rank: idx + 1,
            title: v.name,
            description: v.summary,
          })) as CardType[]);
        } else setTop5CardCarouselItems([]);
      }
    });
  }

  const fetchFirstCardCarouselPlaces = () => {
    // keyword 하나 사용
    const queryParams = `?page=1&size=5&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=embedding&categoryFilter=false&q=${dailyKeywords[1]}`;
    FirstCardCarouselApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data) {
          setFirstCardCarouselItems(response.data.items.map((v: Place) => ({
            id: v.id,
            image: v.thumbnailUrl,
            title: v.name,
            description: v.summary,
          })) as CardType[]);
        } else setFirstCardCarouselItems([]);
      }
    });
  }

  const fetchSecondCardCarouselPlaces = () => {
    // keyword 하나 사용
    const queryParams = `?page=1&size=5&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=embedding&categoryFilter=false&q=${dailyKeywords[2]}`;
    SecondCardCarouselApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        if (response.data) {
          setSecondCardCarouselItems(response.data.items.map((v: Place) => ({
            id: v.id,
            image: v.thumbnailUrl,
            title: v.name,
            description: v.summary,
          })) as CardType[]);
        } else setSecondCardCarouselItems([]);
      }
    });
  }

  const fetchBannerCarouselPlaces = () => {

  }

  const texts = [
    `목적지를 검색하고\n나만의 여행을 시작해보세요.`,
    `강릉으로 떠나는\n가장 쉬운 방법.`,
    `강릉, 그 설레는 여정을\n시작하세요.`,
    `여행의 모든 순간을\n함께 만들어가요.`,
  ]

  // useEffect(() => {
  //   fetchMainCarouselPlaces();
  //   fetchTop5CardCarouselPlaces();
  //   fetchFirstCardCarouselPlaces();
  //   fetchSecondCardCarouselPlaces();
  //   fetchBannerCarouselPlaces();
  // }, []);

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
        <TitleLink text={t("mainTopSpots")} link="/list" />
        <CardCarousel cards={top5CardCarouselItems} isLoading={Top5CardCarouselIsLoading} />
      </div>
      <div className={styles.cardList}>
        <TitleLink text={t("mainKeywordSpotsFirst")} link="/list" />
        <CardCarousel cards={firstCardCarouselItems} isLoading={FirstCardCarouselIsLoading} />
      </div>
      <div className={styles.listLinkContainer}>
        <a href="/list">{t("mainMoreSpots")}</a>
      </div>
    </div>
    <div className={styles.section2}>
      <BannerCarousel banners={bannerCarouselItems} isLoading={BannerCarouselIsLoading} />
      <div className={styles.cardList}>
        <TitleLink text={t("mainKeywordSpotsSecond")} link="/list" />
        <CardCarousel cards={secondCardCarouselItems} isLoading={SecondCardCarouselIsLoading} />
      </div>
    </div>
    <Footer />
  </div>;
};

const TitleLink = ({ text, link }: { text: string, link: string }) => {
  return <a href={link} className={styles.titleLink}>
    {text} <span>&gt;</span>
  </a>
}

export default MainPage;