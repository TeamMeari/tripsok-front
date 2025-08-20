import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./BannerCarousel.module.css";
import { animate } from "@motionone/dom";

interface BannerType {
    url: string
    image: string
}

interface BannerCarouselProps {
    banners: BannerType[] 
}

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const moveDistanceRef = useRef<number>(0);

    // 이동 거리 계산: 아이템 너비(calc(100vw - 48px)) + gap(8px) = 100vw - 40px
    const getMoveDistance = useCallback(() => {
        return window.innerWidth - 40; // 100vw - 40px
    }, []);

    // 화면 크기 변경 시 캐러셀 위치 재조정
    const handleResize = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        
        const newMoveDistance = getMoveDistance();
        moveDistanceRef.current = newMoveDistance;
        
        // 현재 인덱스에 맞는 위치로 재조정
        el.style.transform = `translateX(-${currentIndex * newMoveDistance}px)`;
    }, [currentIndex, getMoveDistance]);

    const moveToNext = useCallback(() => {
        if (currentIndex === banners.length - 1 || isAnimating) return;
        const el = carouselRef.current;
        if (!el) return;

        setIsAnimating(true);
        const nextIndex = currentIndex + 1;
        const moveDistance = moveDistanceRef.current || getMoveDistance();
        animate(el, { x: [`-${currentIndex * moveDistance}px`, `-${nextIndex * moveDistance}px`] }, { duration: 0.6, easing: "ease-in-out" })
            .finished.then(() => {
                setCurrentIndex(nextIndex);
                setIsAnimating(false);
            });
    }, [currentIndex, isAnimating, banners.length, getMoveDistance]);

    const moveToPrev = useCallback(() => {
        if (currentIndex === 0 || isAnimating) return;
        const el = carouselRef.current;
        if (!el) return;

        setIsAnimating(true);
        const prevIndex = currentIndex - 1;
        const moveDistance = moveDistanceRef.current || getMoveDistance();
        animate(el, { x: [`-${currentIndex * moveDistance}px`, `-${prevIndex * moveDistance}px`] }, { duration: 0.6, easing: "ease-in-out" })
            .finished.then(() => {
                setCurrentIndex(prevIndex);
                setIsAnimating(false);
            });
    }, [currentIndex, isAnimating, banners.length, getMoveDistance]);

    // resize 이벤트 처리
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    // 초기 위치 설정
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
        const moveDistance = moveDistanceRef.current || getMoveDistance();
        el.style.transform = `translateX(-${currentIndex * moveDistance}px)`;
    }, [currentIndex, getMoveDistance]);

    // 스크롤 인식
    // wheel 이벤트
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY > 0 || e.deltaX > 0) moveToNext();
            else if (e.deltaY < 0 || e.deltaX < 0) moveToPrev();
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [moveToNext, moveToPrev]);

    // 터치 이벤트 처리
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;

        let startX = 0;
        let startY = 0;
        let isDragging = false;
        const minSwipeDistance = 50; // 최소 스와이프 거리

        const handleTouchStart = (e: TouchEvent) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging) return;
            e.preventDefault();
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // 가로 스와이프가 세로 스크롤보다 클 때만 처리
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    // 왼쪽으로 스와이프 (다음)
                    moveToNext();
                } else {
                    // 오른쪽으로 스와이프 (이전)
                    moveToPrev();
                }
            }
            
            isDragging = false;
        };

        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [moveToNext, moveToPrev]);

    return (
        <div className={styles.carouselTrack}>
            <div className={styles.carouselItems} ref={carouselRef}>
                {banners.map((banner, key) => 
                    <div key={key} className={styles.carouselItem}>
                        {banner && <img src={banner.image} alt="banner" />}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BannerCarousel;