import styles from './MainPage.module.css';
import MainCarousel from '../components/feature/Carousel/MainCarousel';
import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import CardCarousel from '../components/feature/Carousel/CardCarousel';
import Footer from '../components/Footer';
import BannerCarousel from '../components/feature/Carousel/BannerCarousel';
import { getDailyKeywords } from '../utils/keywordSelector';
import { useStaticApiQuery } from '../hooks/useApi';
import CardType from '../types/Card';
import { MainCarouselItem } from '../components/feature/Carousel/MainCarousel';
import { PlaceListResponse, PlaceListItem } from '../types/apiResponse';
import { convertTypeToLowerCase } from '../utils/converter';
import { Link } from 'react-router-dom';
import MenuApp from '../components/MenuApp';
import NavigationMenuTab from '../components/feature/Tab/NavigationMenuTab';
import TopButton from '../components/common/TopButton';

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const dailyKeywords = getDailyKeywords();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 메인 캐러셀: 정적 캐시
  const mainQueryParams = `?page=0&size=10&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=text&categoryFilter=false&q=${t(dailyKeywords[0])}`;
  const { data: mainData, isLoading: MainCarouselIsLoading } = useStaticApiQuery<PlaceListResponse>(
    ['main-carousel', i18n.language, t(dailyKeywords[0])],
    `/places/accommodation${mainQueryParams}`
  );
  const mainCarouselItems: MainCarouselItem[] = (mainData?.items ?? []).map((v: PlaceListItem) => ({
    id: v.id,
    image: v.thumbnailUrl,
    type: convertTypeToLowerCase(v.type) as MainCarouselItem['type'],
  }));

  // 상단 Top5 카드: 정적 캐시 (gangneung)
  const top5Params = `?page=0&size=10&sortKey=rank&direction=desc&locale=${i18n.language}&categoryFilter=false&q=${t("gangneung")}`;
  const { data: top5Data, isLoading: Top5CardCarouselIsLoading } = useStaticApiQuery<PlaceListResponse>(
    ['top5-cards', i18n.language, t('gangneung')],
    `/places/accommodation${top5Params}`
  );
  const top5CardCarouselItems: CardType[] = (top5Data?.items ?? []).slice(0, 5).map((v: PlaceListItem, idx: number) => ({
    id: v.id,
    image: v.thumbnailUrl,
    rank: idx + 1,
    title: v.name,
    description: v.summary,
    type: convertTypeToLowerCase(v.type) as CardType['type'],
  }));

  // 첫 번째 키워드 카드: 정적 캐시
  const firstParams = `?page=0&size=10&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=text&categoryFilter=false&q=${t(dailyKeywords[1])}`;
  const { data: firstData, isLoading: FirstCardCarouselIsLoading } = useStaticApiQuery<PlaceListResponse>(
    ['first-cards', i18n.language, t(dailyKeywords[1])],
    `/places/accommodation${firstParams}`
  );
  const firstCardCarouselItems: CardType[] = (firstData?.items ?? []).map((v: PlaceListItem) => ({
    id: v.id,
    image: v.thumbnailUrl,
    title: v.name,
    description: v.summary,
    type: convertTypeToLowerCase(v.type) as CardType['type'],
  }));

  // 두 번째 키워드 카드: 정적 캐시
  const secondParams = `?page=0&size=10&sortKey=rank&direction=desc&locale=${i18n.language}&typeSearch=text&categoryFilter=false&q=${t(dailyKeywords[2])}`;
  const { data: secondData, isLoading: SecondCardCarouselIsLoading } = useStaticApiQuery<PlaceListResponse>(
    ['second-cards', i18n.language, t(dailyKeywords[2])],
    `/places/accommodation${secondParams}`
  );
  const secondCardCarouselItems: CardType[] = (secondData?.items ?? []).map((v: PlaceListItem) => ({
    id: v.id,
    image: v.thumbnailUrl,
    title: v.name,
    description: v.summary,
    type: convertTypeToLowerCase(v.type) as CardType['type'],
  }));

  const texts = [
    t("mainCarouselText"),
    t("mainCarouselText2"),
    t("mainCarouselText3"),
    t("mainCarouselText4"),
  ]

  // 수정 필요
  const bannerCarouselItems = [
    {
      url: "https://www.instagram.com/gn.coffeefestival/",
      image: "bannerImage/banner1.png",
    },
    {
      url: "https://www.instagram.com/gangneung_noodle/",
      image: "bannerImage/banner2.png",
    },
    {
      url: "https://www.instagram.com/culture_tour_/",
      image: "bannerImage/banner3.png",
    }
  ]

  // 데이터는 React Query로 캐싱 및 패칭됨 (별도 effect 불필요)

  return (
    <div className={styles.pageContainer} ref={scrollAreaRef}>
      <div className={styles.page}>
        <MainCarousel
          items={mainCarouselItems}
          texts={texts}
          isLoading={MainCarouselIsLoading}
        />
        <div className={styles.space}></div>
        {/* <MenuTab tabs={menuTabs} activeTab={activeTab} isIcon={true} tabOnClick={handleTabClick} /> */}
        <NavigationMenuTab isIcon={true}/>
        <div className={styles.section1}>
          <div className={styles.cardList}>
            <TitleLink i18nKey="mainTopSpots" link="/list"/>
            <CardCarousel cards={top5CardCarouselItems} isLoading={Top5CardCarouselIsLoading} />
          </div>
          <div className={styles.cardList}>
            <TitleLink i18nKey="mainKeywordSpotsFirst" values={{ keyword: dailyKeywords[1] }} link="/list" />
            <CardCarousel cards={firstCardCarouselItems} isLoading={FirstCardCarouselIsLoading} />
          </div>
          <div className={styles.listLinkContainer}>
            <Link to="/list">{t("mainMoreSpots")}</Link>
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
      </div>
      <TopButton ref={scrollAreaRef} />
      <MenuApp/>
    </div>
  )
};

const TitleLink = ({ i18nKey, values, link }: { i18nKey: string, values?: any, link: string }) => {
  return <Link to={link} className={styles.titleLink}>
    {<Trans i18nKey={i18nKey} values={values} />} <span>&gt;</span>
  </Link>
}

export default MainPage;