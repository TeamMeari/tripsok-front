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
import { useSearchParams, useLocation } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import HashtagBtnSkeleton from '../components/common/HashtagBtnSkeleton';
import useScrollHorizon from '../hooks/useScrollHorizon';
import { PlacesResponse, Place } from '../types/apiResponse';
import EmptyList from '../components/common/EmptyList';
import { convertTypeToLowerCase } from '../utils/converter';

const ListPage = () => {
  const { t, i18n } = useTranslation();
  const { apiCall: tagApiCall, isLoading: tagIsLoading } = useApi();
  const { apiCall: placeApiCall, isLoading: placeIsLoading } = useApi();
  const location = useLocation();
  const state = location.state;
  const initialTab = state?.tab;
  const [activeTab, setActiveTab] = useState<number>(initialTab ? menuTabs.findIndex(tab => tab.key === initialTab) : 0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const sortKey = {
    1: "like",
    2: "name"
  }
  const tagContainerRef = useScrollHorizon();
  const [searchParams] = useSearchParams();
  const searchWord = searchParams.get('query');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [tourPlaces, setTourPlaces] = useState<CardType[]>([]);
  const [restaurantPlaces, setRestaurantPlaces] = useState<CardType[]>([]);
  const [accommodationPlaces, setAccommodationPlaces] = useState<CardType[]>([]);
  const [page, setPage] = useState<number[]>([0, 0, 0]);
  const [totalPages, setTotalPages] = useState<number[]>([1, 1, 1]);
  const [totalCount, setTotalCount] = useState<number[]>([0, 0, 0]);

  const isMorePage = totalPages[activeTab] > page[activeTab];
  
  const isDot: boolean[] = [
    Boolean(searchWord && tourPlaces.length > 0),
    Boolean(searchWord && restaurantPlaces.length > 0),
    Boolean(searchWord && accommodationPlaces.length > 0)
  ];

  const options = {
    1: t("sortPopular"),
    2: t("sortName"),
  };

  const reset = () => {
    setTotalPages([1, 1, 1]);
    setTotalCount([0, 0, 0]);
    setPage([0, 0, 0]);
    setTourPlaces([]);
    setRestaurantPlaces([]);
    setAccommodationPlaces([]);
  }

  const fetchTags = () => {
    if (tagIsLoading) return;
    tagApiCall("/theme" + `?locale=${i18n.language.toUpperCase()}`, "GET").then((response) => {
      if (response.status === 200) {
        setTags(response.data as Tag[]);
      }
    });
  }

  const fetchTourPlaces = () => {
    if (placeIsLoading) return;
    const queryParams = `?page=${page[0]}&size=20&sortKey=${sortKey[selectedOption as keyof typeof sortKey]}&direction=desc&locale=${i18n.language}`
      + (selectedTag ? `&themeId=${selectedTag}` : "")
      + (searchWord ? `&categoryFilter=true&q=${searchWord}` : "");
    placeApiCall<PlacesResponse>("/places/tour" + queryParams, "GET").then((response) => {
      if (response.status === 200 && page[0] === response.data!.currentPage) {
        setPage(prev => {
          const next = [...prev];
          next[0] = response.data!.currentPage + 1;
          return next;
        });
        setTourPlaces(prev => [...prev, ...response.data?.items.map((v: Place) => ({
          id: v.id,
          image: v.thumbnailUrl,
          title: v.name,
          description: v.summary,
          type: convertTypeToLowerCase(v.type),
        })) as CardType[]]);
        setTotalPages(prev => {
          prev[0] = response.data?.totalPages || 0;
          return prev;
        });
        setTotalCount(prev => {
          prev[0] = response.data?.totalItems || 0;
          return prev;
        });
      }
    });
  }

  const fetchRestaurantPlaces = () => {
    if (placeIsLoading) return;
    const queryParams = `?page=${page[1]}&size=20&sortKey=${sortKey[selectedOption as keyof typeof sortKey]}&direction=desc&locale=${i18n.language}`
      + (selectedTag ? `&themeId=${selectedTag}` : "")
      + (searchWord ? `&categoryFilter=true&q=${searchWord}` : "");
    placeApiCall<PlacesResponse>("/places/restaurant" + queryParams, "GET").then((response) => {
      if (response.status === 200 && page[1] === response.data!.currentPage) {
        setPage(prev => {
          const next = [...prev];
          next[1] = response.data!.currentPage + 1;
          return next;
        });
        setRestaurantPlaces(prev => [...prev, ...response.data?.items.map((v: Place) => ({
          id: v.id,
          image: v.thumbnailUrl,
          title: v.name,
          description: v.summary,
          type: convertTypeToLowerCase(v.type),
        })) as CardType[]]);
        setTotalPages(prev => {
          prev[1] = response.data?.totalPages || 0;
          return prev;
        });
        setTotalCount(prev => {
          prev[1] = response.data?.totalItems || 0;
          return prev;
        });
      }
    });
  }

  const fetchAccommodationPlaces = () => {
    if (placeIsLoading) return;
    const queryParams = `?page=${page[2]}&size=20&sortKey=${sortKey[selectedOption as keyof typeof sortKey]}&direction=desc&locale=${i18n.language}`
      + (selectedTag ? `&themeId=${selectedTag}` : "")
      + (searchWord ? `&categoryFilter=true&q=${searchWord}` : "");
    placeApiCall<PlacesResponse>("/places/accommodation" + queryParams, "GET").then((response) => {
      if (response.status === 200 && page[2] === response.data!.currentPage) {
        setPage(prev => {
          const next = [...prev];
          next[2] = response.data!.currentPage + 1;
          return next;
        });
        setAccommodationPlaces(prev => [...prev, ...response.data!.items.map((v: Place) => ({
          id: v.id,
          image: v.thumbnailUrl,
          title: v.name,
          description: v.summary,
          type: convertTypeToLowerCase(v.type),
        })) as CardType[]]);
        setTotalPages(prev => {
          prev[2] = response.data?.totalPages || 0;
          return prev;
        });
        setTotalCount(prev => {
          prev[2] = response.data?.totalItems || 0;
          return prev;
        });
      }
    });
  }

  const fetchPlaces = [fetchTourPlaces, fetchRestaurantPlaces, fetchAccommodationPlaces];

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  }

  const handleTagClick = (tagId: number) => {
    reset();
    if (selectedTag === tagId) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagId);
    }
  }

  const handleOptionClick = (option: number) => {
    reset();
    setSelectedOption(option);
  }

  // 첫 렌더링 데이터 fetch
  // 태그 fetch
  useEffect(() => {
    fetchTags();
  }, [t]);

  // 태그 변경, 옵션, 검색어, 언어 변경
  useEffect(() => {
    reset();
    if (searchWord) {
      for (let i = 0; i < 3; i++) {
        if (i !== activeTab) fetchPlaces[i]();
      }
    }
  }, [selectedTag, selectedOption, searchWord, t]);

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
      observer.disconnect();
      el.removeEventListener("wheel", handleWheel);
    };
  }, [activeTab, placeIsLoading, selectedTag, selectedOption, searchWord, page]);

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
            {tags.map((tag) => (
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
            {t("totalSearch", { count: totalCount[activeTab] })}
          </div>
          <Dropdown current={selectedOption} options={options} onClickOption={handleOptionClick} />
        </div>
        <div className={styles.list}>
          {
            activeTab === 0 && (!placeIsLoading && tourPlaces.length === 0 ? 
            <EmptyList /> :
            tourPlaces.map((card) => (
              <Card key={card.id} id={card.id} image={card.image} title={card.title} description={card.description} type={card.type} />
            )))
          }
          {
            activeTab === 1 && (!placeIsLoading && restaurantPlaces.length === 0 ? 
            <EmptyList /> :
            restaurantPlaces.map((card) => (
              <Card key={card.id} id={card.id} image={card.image} title={card.title} description={card.description} type={card.type}/>
            )))
          }
          {
            activeTab === 2 && (!placeIsLoading && accommodationPlaces.length === 0 ? 
            <EmptyList /> :
            accommodationPlaces.map((card) => (
              <Card key={card.id} id={card.id} image={card.image} title={card.title} description={card.description} type={card.type} />
            )))
          }
        </div>
        {isMorePage && <div className={styles.loadMore} ref={loadMoreRef}>
          {Array(20).fill(0).map((_, index) => (
            <Card key={index} isLoading={true}/>
          ))}
        </div>}
      </div>
      <div>
        <MenuApp/>
      </div>
    </div>
  );
}

export default ListPage;