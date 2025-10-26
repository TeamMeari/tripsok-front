import { useTranslation } from 'react-i18next';
import styles from './MyPage.module.css'
import MenuTab from '../../components/feature/Tab/MenuTab';
import { useEffect, useRef, useState } from 'react';
import { PlaceType } from '../../types/menuTabs';
import EmptyList from '../../components/common/EmptyList';
import Card from '../../components/common/Card';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

interface PlaceInfo {
    id: number;
    language: string;
    placeId: number;
    name: string;
    type: "RESTAURANT" | "ACCOMODATION" | "TOUR";
    thumbnailUrl: string;
    summary: string;
}

interface UserLikePlacesResponse {
    hasNext: boolean;
    content: PlaceInfo[];
    totalItems: number;
}

const LikePage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');

    const loadMoreRef = useRef<HTMLDivElement>(null);

    // 리다이렉션
    useEffect(() => {
        if (type === null) {
            navigate("/my/like?type=tour", { replace: true });
        }
    }, []);

    // 타입 변경
    const handleTabClick = (tab: PlaceType) => {
        navigate(`/my/like?type=${tab}`, { replace: true });
    }

    // 추후 별도 훅으로 분리
    // 무한 스크롤 infinite query
    const fetchPlaces = async ({ pageParam }: { pageParam: number | null }) => {
        const response = await axios.get<UserLikePlacesResponse>(
            `/user/like-places?size=20${pageParam ? `&lastId=${pageParam}` : ""}&type=${type ? type.toUpperCase() : "TOUR"}&locale=${i18n.language.toUpperCase()}`
        );
        return response.data;
    };

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['likePlaces', type || "TOUR", i18n.language],
        queryFn: fetchPlaces,
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            if (lastPage.content.length && lastPage.hasNext) return lastPage.content[lastPage.content.length - 1].id ?? null;
            return null;
        },
        staleTime: 60 * 1000,
    })
    const places = data?.pages.flatMap(page => page.content) ?? [];
    const totalCount = data?.pages[0]?.totalItems ?? 0

    useEffect(() => {
        if (isFetchingNextPage || !type) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isFetchingNextPage, type, hasNextPage]);

    const List = () => {
        if (places.length === 0 && !isFetchingNextPage && !isFetchingNextPage) {
            return (
                <div className={styles.list}>
                    <EmptyList />
                </div>
            )
        }

        return (
        <div className={styles.list}>
            {
                places.map(card => <Card
                    key={card.id}
                    id={card.placeId}
                    image={card.thumbnailUrl}
                    title={card.name}
                    description={card.summary}
                    type={card.type.toLowerCase() as PlaceType} />
                )
            }
            {
                hasNextPage &&
                <div className={styles.loadMore} ref={loadMoreRef}>
                    {Array(20).fill(0).map((_, index) => (
                        <Card key={index} isLoading={true}/>
                    ))}
                </div>
            }
        </div>
        )
    }
    
    return (
        <div className={styles.page}>
            <div className={styles.part}>
                <h2 className={styles.title}>{t("myLikePlace")}</h2>
            </div>
            <MenuTab
                activeTab={type as PlaceType || 'tour'}
                isIcon={false}
                tabOnClick={(tab: PlaceType) => {
                    handleTabClick(tab);
                }}
            />
            <div className={styles.listContainer}>
                <div className={styles.info}>
                    <div className={`caption ${styles.listCount}`}>
                        {t("totalSearch", { count: totalCount })}
                    </div>
                </div>
                <List />
            </div>
        </div>
    );
};

export default LikePage;