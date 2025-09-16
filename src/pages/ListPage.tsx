import MenuTab from '../components/feature/Tab/MenuTab';
import styles from './ListPage.module.css';
import { Tag } from '../types/Tag';
import { useEffect, useRef, useState } from 'react';
import HashtagButton from '../components/common/HashtagBtn';
import Dropdown from '../components/common/Dropdown';
import CardType from '../types/Card';
import Card from '../components/common/Card';
import { useTranslation } from 'react-i18next';
import MenuApp from "../components/MenuApp";
import SearchInput from '../components/feature/SearchInput';
import menuTabs from '../types/menuTabs';
import { useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import HashtagBtnSkeleton from '../components/common/HashtagBtnSkeleton';
import useScrollHorizon from '../hooks/useScrollHorizon';

const ListPage = () => {
  const { t, i18n } = useTranslation();
  const { apiCall: tagApiCall, isLoading: tagIsLoading } = useApi();
  const { apiCall: placeApiCall, isLoading: placeIsLoading } = useApi();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const tagContainerRef = useScrollHorizon();
  const [searchParams] = useSearchParams();
  const searchWord = searchParams.get('query');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [tourPlaces, setTourPlaces] = useState<CardType[]>([]);
  const [restaurantPlaces, setRestaurantPlaces] = useState<CardType[]>([]);
  const [accommodationPlaces, setAccommodationPlaces] = useState<CardType[]>([]);
  const [page, setPage] = useState<number[]>([0, 0, 0]);
  
  const isDot: boolean[] = [
    Boolean(searchWord && tourPlaces.length > 0),
    Boolean(searchWord && restaurantPlaces.length > 0),
    Boolean(searchWord && accommodationPlaces.length > 0)
  ];

  const options = {
    1: t("sortPopular"),
    2: t("sortName"),
  };

  const fetchTags = () => {
    if (tagIsLoading) return;
    tagApiCall("/theme", "GET").then((response) => {
      if (response.status === 200) {
        setTags(response.data as Tag[]);
      }
    });
  }

  const fetchTourPlaces = () => {
    if (placeIsLoading) return;
    const queryParams = `?page=${++page[0]}&size=20&sortKey=${selectedOption}&direction=desc&locale=${i18n.language}`; // sortKey, themeId 수정 필요
    placeApiCall("/places/tour" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        setTourPlaces(prev => [...prev, ...response.data as CardType[]]);
      }
    });
  }

  const fetchRestaurantPlaces = () => {
    if (placeIsLoading) return;
    const queryParams = `?page=${++page[1]}&size=20&sortKey=${selectedOption}&direction=desc&locale=${i18n.language}`; // sortKey, themeId 수정 필요
    placeApiCall("/places/restaurant" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        setRestaurantPlaces(prev => [...prev, ...response.data as CardType[]]);
      }
    });
  }

  const fetchAccommodationPlaces = () => {
    if (placeIsLoading) return;
    const queryParams = `?page=${++page[2]}&size=20&sortKey=${selectedOption}&direction=desc&locale=${i18n.language}`; // sortKey, themeId 수정 필요
    placeApiCall("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200) {
        setAccommodationPlaces(prev => [...prev, ...response.data as CardType[]]);
      }
    });
  }

  const fetchPlaces = [fetchTourPlaces, fetchRestaurantPlaces, fetchAccommodationPlaces];

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  }

  const handleTagClick = (tagId: number) => {
    if (selectedTag === tagId) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagId);
    }
  }

  const handleOptionClick = (option: number) => {
    setSelectedOption(option);
    setPage([0, 0, 0]);
    setTourPlaces([]);
    setRestaurantPlaces([]);
    setAccommodationPlaces([]);
  }

  // 첫 렌더링 데이터 fetch
  // 태그 fetch
  useEffect(() => {
    fetchTags();
  }, []);

  const expectedTags = [
    { id: 1, type: "테마1" },
    { id: 2, type: "테마2" },
    { id: 3, type: "테마3" },
    { id: 4, type: "테마4" },
    { id: 5, type: "테마5" },
    { id: 6, type: "테마6" },
    { id: 7, type: "테마7" },
    { id: 8, type: "테마8" },
    { id: 9, type: "테마9" },
    { id: 10, type: "테마10" },
  ]

  // wheel로 넘길수 있도록 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !placeIsLoading) {
          fetchPlaces[activeTab]();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    const el = tagContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft -= e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className={styles.listPage}>
      <div className={styles.searchContainer}>
        <SearchInput variant="list" searchWord={searchWord || ""} />
      </div>
      <MenuTab tabs={menuTabs} activeTab={activeTab} isIcon={false} tabOnClick={(tab) => {
        handleTabClick(tab);
      }} isDot={isDot}/>
      {
        tagIsLoading ? (
          <div className={styles.tagSkeletonContainer}>
            {[...Array(10)].map((_, i) => (
              <HashtagBtnSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className={styles.tagContainer} ref={tagContainerRef}>
            {expectedTags.map((tag) => (
              <HashtagButton key={tag.id} label={tag.type} onClick={() => {
                handleTagClick(tag.id);
              }} isSelected={selectedTag === tag.id} />
              ))}
          </div>
        )
      }
      <div className={styles.listContainer}>
        <div className={styles.info}>
          <div className={styles.listCount}>
            {t("totalSearch", { count: 245 })}
          </div>
          <Dropdown current={selectedOption} options={options} onClickOption={handleOptionClick} />
        </div>
        <div className={styles.list}>
          {activeTab === 0 && tourPlaces.map((card) => (
            <Card key={card.id} />
          ))}
          {activeTab === 1 && restaurantPlaces.map((card) => (
            <Card key={card.id} />
          ))}
          {activeTab === 2 && accommodationPlaces.map((card) => (
            <Card key={card.id} />
          ))}
        </div>
        <div className={styles.loadMore} ref={loadMoreRef}>
          {Array(20).fill(0).map((_, index) => (
            <Card key={index} isLoading={true}/>
          ))}
        </div>
      </div>
      <div>
        <MenuApp/>
      </div>
    </div>
  );
}

export default ListPage;