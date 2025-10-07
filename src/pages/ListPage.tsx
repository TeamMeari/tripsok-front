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
import { PlaceType } from '../types/menuTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useStaticApiQuery } from '../hooks/useApi';
import HashtagBtnSkeleton from '../components/common/HashtagBtnSkeleton';
import useScrollHorizon from '../hooks/useScrollHorizon';
import { PlacesResponse, Place } from '../types/apiResponse';
import EmptyList from '../components/common/EmptyList';
import { convertTypeToLowerCase } from '../utils/converter';
import TopButton from '../components/common/TopButton';
import { SortType } from '../types/sortOptions';

const ListPage = () => {
  const { t, i18n } = useTranslation();
  // 장소 목록은 정적 캐시로 관리 (React Query)
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
      const queryParams = `type=${type || 'tour'}&sort=${sort || 'like'}${searchWord ? `&q=${searchWord}&typeSearch=text` : ''}${hashtagId ? `&hashtagId=${hashtagId}` : ''}`;
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

  // 정적 태그 데이터: React Query로 캐싱
  const { data: tagsData, isLoading: tagsIsLoading } = useStaticApiQuery<Tag[]>(
    ['tags', i18n.language],
    `/theme?locale=${i18n.language.toUpperCase()}`
  );

  // 현재 page 기준 장소 목록 요청 (정적 캐시)
  const placesQueryParams = `?page=${page}&size=20&sortKey=${sort}&direction=desc&locale=${i18n.language}${hashtagId ? `&themeId=${hashtagId}` : ''}${searchWord ? `&categoryFilter=true&q=${searchWord}` : ''}`;
  const { data: placesData, isLoading: placesIsLoading } = useStaticApiQuery<PlacesResponse>(
    ['places', (type as string) || 'tour', sort || 'like', searchWord || '', hashtagId ?? '', page, i18n.language],
    `places/${(type as string) || 'tour'}${placesQueryParams}`,
    {
      enabled: type !== null && sort !== null,
    }
  );

  // 검색어가 있을 때, 모든 타입의 첫 페이지를 실제 목록과 동일 키로 선조회하여 캐시 (UI 반영 없음)
  const prefetchQueryParams = `?page=0&size=20&sortKey=${sort}&direction=desc&locale=${i18n.language}${hashtagId ? `&themeId=${hashtagId}` : ''}${searchWord ? `&categoryFilter=true&q=${searchWord}&typeSearch=text` : ''}`;
  useStaticApiQuery<PlacesResponse>(
    ['places', 'tour', sort || 'like', searchWord || '', hashtagId ?? '', 0, i18n.language],
    `places/tour${prefetchQueryParams}`,
    { enabled: !!searchWord }
  );
  useStaticApiQuery<PlacesResponse>(
    ['places', 'restaurant', sort || 'like', searchWord || '', hashtagId ?? '', 0, i18n.language],
    `places/restaurant${prefetchQueryParams}`,
    { enabled: !!searchWord }
  );
  useStaticApiQuery<PlacesResponse>(
    ['places', 'accommodation', sort || 'like', searchWord || '', hashtagId ?? '', 0, i18n.language],
    `places/accommodation${prefetchQueryParams}`,
    { enabled: !!searchWord }
  );

  const reset = () => {
    setTotalPage(1);
    setTotalCount(0);
    setPage(0);
    setPlaces([]);
  }  

  // 정적 태그 데이터를 화면 상태로 반영
  useEffect(() => {
    if (tagsData) setTags(tagsData);
  }, [tagsData]);

  // 쿼리 응답을 화면 상태로 반영
  useEffect(() => {
    if (!placesData) return;
    // 동일 페이지에 대해서만 반영
    if (placesData.currentPage === page) {
      setPlaces(prev => [
        ...prev,
        ...placesData.items.map((v: Place) => ({
          id: v.id,
          image: v.thumbnailUrl,
          title: v.name,
          description: v.summary,
          type: convertTypeToLowerCase(v.type),
        })) as CardType[]
      ]);
      setTotalPage(placesData.totalPages);
      setTotalCount(placesData.totalItems);
    }
  }, [placesData, page]);

  // 설정 변경
  const handleTabClick = (tab: string) => {
    reset();
    const queryParams = `type=${tab}&sort=${sort || 'like'}${searchWord ? `&q=${searchWord}&typeSearch=text` : ''}${hashtagId ? `&hashtagId=${hashtagId}` : ''}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  const handleTagClick = (tagId: number) => {
    reset();
    const queryParams = `type=${type}&sort=${sort || 'like'}${searchWord ? `&q=${searchWord}&typeSearch=text` : ''}${tagId === hashtagId ? '' : `&hashtagId=${tagId}`}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  const handleOptionClick = (option: SortType) => {
    reset();
    const queryParams = `type=${type}&sort=${option}${searchWord ? `&q=${searchWord}&typeSearch=text` : ''}${hashtagId ? `&hashtagId=${hashtagId}` : ''}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  // wheel로 넘길수 있도록 설정
  // observer 설정
  useEffect(() => {
    if (placesIsLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !placesIsLoading) {
          if (isMorePage) {
            setPage(prev => prev + 1);
          }
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
  }, [placesIsLoading, searchWord, page, hashtagId, type, sort, isMorePage]);

  const List = () => {
    if (!placesIsLoading && places.length === 0 && !isMorePage) {
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
        tagsIsLoading ? (
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