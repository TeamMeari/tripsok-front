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