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
import { menuTabs, PlaceType } from '../types/menuTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import HashtagBtnSkeleton from '../components/common/HashtagBtnSkeleton';
import useScrollHorizon from '../hooks/useScrollHorizon';
import { PlacesResponse, Place } from '../types/apiResponse';
import EmptyList from '../components/common/EmptyList';
import { convertTypeToLowerCase } from '../utils/converter';
import TopButton from '../components/common/TopButton';
import { SortType } from '../types/sortOptions';

const ListPage = () => {
  const { t, i18n } = useTranslation();
  const { apiCall: tagApiCall, isLoading: tagIsLoading } = useApi();
  const { apiCall: placeApiCall, isLoading: placeIsLoading } = useApi();
  const navigate = useNavigate();

  // query params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const searchWord = searchParams.get('query') || null;
  const hashtagId = searchParams.get('hashtagId') ? Number(searchParams.get('hashtagId')) : null;
  const sort = searchParams.get('sort');

  // place list
  const [places, setPlaces] = useState<CardType[]>([]);

  // type, sort 없으면 기본값으로 리다이렉트
  useEffect(() => {
    if (type === null || sort === null) {
      const queryParams = `type=${type || 'tour'}&sort=${sort || 'like'}${searchWord ? `&query=${searchWord}` : ''}${hashtagId ? `&hashtagId=${hashtagId}` : ''}`;
      navigate(`/list?${queryParams}`, { replace: true });
    }
  }, [type, sort, searchWord, hashtagId, navigate]);

  // state
  const [tags, setTags] = useState<Tag[]>([]);
  const tagContainerRef = useScrollHorizon();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMorePage = totalPage > page;
  
  const [isDot, setIsDot] = useState<Record<PlaceType, boolean>>({
    tour: false,
    restaurant: false,
    accommodation: false,
  });

  const reset = () => {
    setTotalPage(1);
    setTotalCount(0);
    setPage(0);
    setPlaces([]);
  }

  const fetchTags = () => {
    if (tagIsLoading) return;
    tagApiCall("/theme" + `?locale=${i18n.language.toUpperCase()}`, "GET").then((response) => {
      if (response.status === 200) {
        setTags(response.data as Tag[]);
      }
    });
  }

  const fetchPlaces = (type: PlaceType) => {
    const queryparam = `?page=${page}&size=20&sortKey=${sort}&direction=desc&locale=${i18n.language}${hashtagId ? `&themeId=${hashtagId}` : ''}${searchWord ? `&categoryFilter=true&q=${searchWord}` : ''}`;
    placeApiCall<PlacesResponse>(`places/${type || 'tour'}` + queryparam, "GET").then((response) => {
      if (response.status === 200 && page === response.data!.currentPage) {
        setPlaces(prev => [...prev, ...response.data!.items.map((v: Place) => ({
          id: v.id,
          image: v.thumbnailUrl,
          title: v.name,
          description: v.summary,
          type: convertTypeToLowerCase(v.type),
        })) as CardType[]]);
        setPage(response.data!.currentPage + 1);
        setTotalPage(response.data!.totalPages);
        setTotalCount(response.data!.totalItems);
      }
    });
  }

  // 설정 변경
  const handleTabClick = (tab: string) => {
    reset();
    const queryParams = `type=${tab}&sort=${sort || 'like'}${searchWord ? `&query=${searchWord}` : ''}${hashtagId ? `&hashtagId=${hashtagId}` : ''}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  const handleTagClick = (tagId: number) => {
    reset();
    const queryParams = `type=${type}&sort=${sort || 'like'}${searchWord ? `&query=${searchWord}` : ''}${tagId === hashtagId ? '' : `&hashtagId=${tagId}`}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  const handleOptionClick = (option: SortType) => {
    reset();
    const queryParams = `type=${type}&sort=${option}${searchWord ? `&query=${searchWord}` : ''}${hashtagId ? `&hashtagId=${hashtagId}` : ''}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  // 첫 렌더링 데이터 fetch
  // 태그 fetch
  useEffect(() => {
    fetchTags();
    if (searchWord) {
      for (const placeType of Object.keys(menuTabs) as PlaceType[]) {
        placeApiCall<PlacesResponse>(`places/${placeType}?page=0&size=1&sortKey=${sort}&direction=desc&locale=${i18n.language}${hashtagId ? `&themeId=${hashtagId}` : ''}&categoryFilter=true&q=${searchWord}`, "GET").then((response) => {
          if (response.status === 200 && response.data!.totalItems > 0) {
            setIsDot(prev => ({ ...prev, [placeType]: true }));
          }
        });
      }
    }
  }, [t]);

  // wheel로 넘길수 있도록 설정
  // observer 설정
  useEffect(() => {
    if (placeIsLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !placeIsLoading) {
          fetchPlaces(type as PlaceType || 'tour');
        }
      },
      { threshold: 0.05 }
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
  }, [placeIsLoading, searchWord, page, hashtagId, type, sort]);

  const List = () => {
    if (!placeIsLoading && places.length === 0 && !isMorePage) {
      return (
        <div className={styles.list}>
          <EmptyList />
        </div>
      )
    }

    return (
      <div className={styles.list}>
        {places.map((card) => (
          <Card key={card.id} id={card.id} image={card.image} title={card.title} description={card.description} type={card.type} />
        ))}
        {isMorePage && <div className={styles.loadMore} ref={loadMoreRef}>
          {Array(20).fill(0).map((_, index) => (
            <Card key={index} isLoading={true}/>
          ))}
        </div>}
      </div>
    )
  }

  return (
    <div className={styles.listPageContainer} ref={scrollAreaRef}>
      <div className={styles.listPage}>
      <div className={styles.searchContainer}>
        <SearchInput variant="list" searchWord={searchWord || ""} />
      </div>
      <MenuTab activeTab={type as PlaceType || 'tour'} isIcon={false} tabOnClick={(tab: PlaceType) => {
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
              }} isSelected={hashtagId !== null && Number(hashtagId) === tag.id} />
              ))}
          </div>
        )
      }
      <div className={styles.listContainer}>
        <div className={styles.info}>
          <div className={styles.listCount}>
            {t("totalSearch", { count: totalCount })}
          </div>
          <Dropdown current={sort as SortType || 'like'} onClickOption={handleOptionClick} />
        </div>
        <List />
      </div>
      </div>

      <MenuApp/>
      <TopButton ref={scrollAreaRef} />
    </div>
  );
}

export default ListPage;