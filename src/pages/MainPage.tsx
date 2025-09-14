import styles from './MainPage.module.css';
import MainCarousel from '../components/feature/Carousel/MainCarousel';
import { useState } from 'react';
import MenuTab from '../components/feature/Tab/MenuTab';
import menuTabs from '../types/menuTabs';
import { useTranslation } from 'react-i18next';
import CardCarousel from '../components/feature/Carousel/CardCarousel';
import Footer from '../components/Footer';
import BannerCarousel from '../components/feature/Carousel/BannerCarousel';

const MainPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  }

  const fetchMainCarouselPlaces = () => {

  }

  const fetchFirstCardCarouselPlaces = () => {
  }

  const fetchSecondCardCarouselPlaces = () => {
  }

  const fetchThirdCardCarouselPlaces = () => {
  }

  const fetchBannerCarouselPlaces = () => {
  }

  // 예시 데이터
  const mainCarouselItems = [
    {
      id: 1,
      image: 'https://picsum.photos/360/360?random=1',
    },
    {
      id: 2,
      image: 'https://picsum.photos/360/360?random=2',
    },
    {
      id: 3,
      image: 'https://picsum.photos/360/360?random=3',
    },
    {
      id: 4,
      image: 'https://picsum.photos/360/360?random=4',
    },
  ]
  const texts = [
    `목적지를 검색하고\n나만의 여행을 시작해보세요.`,
    `강릉으로 떠나는\n가장 쉬운 방법.`,
    `강릉, 그 설레는 여정을\n시작하세요.`,
    `여행의 모든 순간을\n함께 만들어가요.`,
  ]
  const cardCarouselItems = [
    {
        id: 1,
        title: '카드 제목 1',
        description: '카드 설명입니다. 이것은 첫 번째 카드입니다.',
        image: 'https://picsum.photos/200/300',
    },
    {
        id: 2, 
        title: '카드 제목 2',
        description: '카드 설명입니다. 이것은 두 번째 카드입니다.',
        image: 'https://picsum.photos/200/300',
    },
    {
        id: 3,
        title: '카드 제목 3', 
        description: '카드 설명입니다. 이것은 세 번째 카드입니다.',
        image: 'https://picsum.photos/200/300',
    },
    {
        id: 4,
        title: '카드 제목 4',
        description: '카드 설명입니다. 이것은 네 번째 카드입니다.',
        image: 'https://picsum.photos/200/400',
    },
    {
        id: 5,
        title: '카드 제목 5',
        description: '카드 설명입니다. 이것은 다섯 번째 카드입니다.',
        image: 'https://picsum.photos/200/350',
    },
    {
        id: 6,
        title: '카드 제목 6',
        description: '카드 설명입니다. 이것은 여섯 번째 카드입니다.',
        image: 'https://picsum.photos/200/250',
    }
  ]
  const bannerCarouselItems = [
    {
      url: '/list',
      image: 'https://picsum.photos/360/360?random=1',
    },
    {
      url: '/list',
      image: 'https://picsum.photos/360/360?random=2',
    },
    {
      url: '/list',
      image: 'https://picsum.photos/360/360?random=3',
    },
    {
      url: '/list',
      image: 'https://picsum.photos/360/360?random=4',
    },
    {
      url: '/list',
      image: 'https://picsum.photos/360/360?random=5',
    },
    {
      url: '/list',
      image: 'https://picsum.photos/360/360?random=6',
    },
  ]

  return <div className={styles.page}>
    <MainCarousel items={mainCarouselItems}
    texts={texts}
    />
    <div className={styles.space}></div>
    <MenuTab tabs={menuTabs} activeTab={activeTab} isIcon={true} tabOnClick={handleTabClick} />
    <div className={styles.section1}>
      <div className={styles.cardList}>
        <TitleLink text={t("mainTopSpots")} link="/list" />
        <CardCarousel cards={cardCarouselItems}
        />
      </div>
      <div className={styles.cardList}>
        <TitleLink text={t("mainSummerSports")} link="/list" />
        <CardCarousel cards={cardCarouselItems} />
      </div>
      <div className={styles.listLinkContainer}>
        <a href="/list">{t("mainMoreSpots")}</a>
      </div>
    </div>
    <div className={styles.section2}>
      <BannerCarousel banners={bannerCarouselItems} />
      <div className={styles.cardList}>
        <TitleLink text={t("mainFood")} link="/list" />
        <CardCarousel cards={cardCarouselItems} />
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