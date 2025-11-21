import MenuTab from '../components/feature/Tab/MenuTab';
import styles from './ListPage.module.css';
import { Tag } from '../types/Tag';
import { useEffect, useRef, useState } from 'react';
import HashtagButton from '../components/common/HashtagBtn';
import Dropdown from '../components/common/Dropdown';
import Card from '../components/common/Card';
import { useTranslation } from 'react-i18next';
import MenuApp from "../components/MenuApp";
import SearchInput from '../components/feature/SearchInput';
import { PlaceType } from '../types/menuTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStaticApiQuery } from '../hooks/useApi';
import HashtagBtnSkeleton from '../components/common/HashtagBtnSkeleton';
import useScrollHorizon from '../hooks/useScrollHorizon';
import { PlaceListResponse, PlaceListItem } from '../types/apiResponse';
import EmptyList from '../components/common/EmptyList';
import TopButton from '../components/common/TopButton';
import { SortType } from '../types/sortOptions';
import axios from '../utils/axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { convertTypeToLowerCase } from '../utils/converter';

const ListPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // query params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const searchWord = searchParams.get('query') || null;
  const hashtagId = searchParams.get('hashtagId') ? Number(searchParams.get('hashtagId')) : null;
  const sort = searchParams.get('sort');

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 추후 별도 훅으로 분리
  // 무한 스크롤 infinite query
  const fetchPlaces = async ({ pageParam, type }: { pageParam: number, type: PlaceType }) => {
      const response = await axios.get<PlaceListResponse>(
          `/places/${type}?page=${pageParam}&size=20&sortKey=${sort}&direction=desc&locale=${i18n.language}${hashtagId ? `&themeId=${hashtagId}` : ''}${searchWord ? `&categoryFilter=true&q=${searchWord}&typeSearch=text` : ''}`
      );
      return response.data;
  };

  // 무한 스크롤 Query
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
      queryKey: ['places', type, sort || 'like', searchWord || '', hashtagId ?? '', i18n.language],
      queryFn: ({ pageParam }) => fetchPlaces({ pageParam: pageParam, type: (type || "tour") as PlaceType}),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.currentPage < lastPage.totalPages - 1) return lastPageParam + 1;
        return undefined;
      },
      staleTime: 3 * 60 * 1000,
  })
  const places = data?.pages.flatMap(page => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalItems ?? 0

  // 정적 태그 데이터: React Query로 캐싱
  const { data: tagsData, isLoading: tagsIsLoading } = useStaticApiQuery<Tag[]>(
    ['tags', i18n.language],
    `/theme?locale=${i18n.language.toUpperCase()}`
  );

  // 정적 태그 데이터를 화면 상태로 반영
  useEffect(() => {
    if (tagsData) setTags(tagsData);
  }, [tagsData]);

  // 설정 변경
  const handleTabClick = (tab: string) => {
    const queryParams = `type=${tab}&sort=${sort || 'like'}${searchWord ? `&query=${searchWord}` : ''}${hashtagId ? `&hashtagId=${hashtagId}` : ''}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  const handleTagClick = (tagId: number) => {
    const queryParams = `type=${type}&sort=${sort || 'like'}${searchWord ? `&query=${searchWord}` : ''}${tagId === hashtagId ? '' : `&hashtagId=${tagId}`}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  const handleOptionClick = (option: SortType) => {
    const queryParams = `type=${type}&sort=${option}${searchWord ? `&query=${searchWord}` : ''}${hashtagId ? `&hashtagId=${hashtagId}` : ''}`;
    navigate(`/list?${queryParams}`, { replace: true });
  }

  // wheel로 넘길수 있도록 설정
  // observer 설정
  useEffect(() => {
    if (isFetching || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
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
  }, [isFetching, isFetchingNextPage, searchWord, hashtagId, type, sort, hasNextPage]);

  const List = () => {
    if (!isFetching && !isFetchingNextPage && places.length === 0 && !hasNextPage) {
      return (
        <div className={styles.list}>
          <EmptyList />
        </div>
      )
    }

    return (
      <div className={styles.list}>
        {places.map((card) => (
          <Card
            key={card.id} 
            id={card.id} 
            image={card.thumbnailUrl} 
            title={card.name}
            description={card.summary} 
            type={convertTypeToLowerCase(card.type)}
          />
        ))}
        {(isFetching || hasNextPage) && <div className={styles.loadMore} ref={loadMoreRef}>
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
      <MenuTab
        activeTab={type as PlaceType || 'tour'}
        isIcon={false}
        tabOnClick={(tab: PlaceType) => {
          handleTabClick(tab);
        }}
        // isDot={{
        //     tour: tourData !== undefined && tourData?.items?.length > 0,
        //     restaurant: restaurantData !== undefined && restaurantData?.items?.length > 0,
        //     accommodation: accommodationData !== undefined && accommodationData?.items?.length > 0
        // }}
      />
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