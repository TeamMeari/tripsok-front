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

const ListPage = () => {
  const { t, i18n } = useTranslation();
  const { apiCall: tagApiCall, isLoading: tagIsLoading } = useApi();
  const { apiCall: placeApiCall, isLoading: placeIsLoading } = useApi();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Set<number>>(new Set());
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const tagContainerRef = useRef<HTMLDivElement>(null);
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
    if (selectedTag.has(tagId)) {
      setSelectedTag((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tagId);
        return newSet;
      });
    } else {
      setSelectedTag((prev) => {
        const newSet = new Set(prev);
        newSet.add(tagId);
        return newSet;
      });
    };
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
      <div className={styles.tagContainer} ref={tagContainerRef}>
        {tags.map((tag) => (
          <HashtagButton key={tag.id} label={tag.type} onClick={() => {
            handleTagClick(tag.id);
          }} />
        ))}
      </div>
      <div className={styles.listContainer}>
        <div className={styles.info}>
          <div className={styles.listCount}>
            {t("totalSearch", { count: 245 })}
          </div>
          <Dropdown current={selectedOption} options={options} onClickOption={handleOptionClick} />
        </div>
        <div className={styles.list}>
          {Array(20).fill(0).map((card) => (
            <Card key={card.id} isLoading={true}/>
          ))}
        </div>
        <div className={styles.loadMore} ref={loadMoreRef}>
          {Array(20).fill(0).map((card) => (
            <Card key={card.id} isLoading={true}/>
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