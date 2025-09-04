import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./BannerCarousel.module.css";
import { animate } from "@motionone/dom";
import { useScrollToSlide } from "../../../hooks/useScrollToSlide";
import { useTranslation } from "react-i18next";

interface BannerType {
    url: string
    image: string
}

interface BannerCarouselProps {
    banners: BannerType[] 
}

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const currentInnerWidth = useRef<number>(0);

    const getXOfIndex = useCallback((idx: number) => {
        const unit = (currentInnerWidth.current < 360 ? currentInnerWidth.current : 360) - 40;
        return idx * unit;
    }, []);

    const moveToNext = useCallback(() => {
        if (carouselRef.current && !isAnimating && currentIndex < banners.length - 1) {
            setIsAnimating(true);
            animate(carouselRef.current,
                { x: [`-${getXOfIndex(currentIndex)}px`, `-${getXOfIndex(currentIndex + 1)}px`] },
                { duration: 0.6, easing: "ease-in-out" })
                .finished.then(() => {
                    setCurrentIndex(currentIndex + 1);
                    setIsAnimating(false);
                });
        }
    }, [isAnimating, currentIndex, banners.length]);

    const moveToPrev = useCallback(() => {
        if (carouselRef.current && !isAnimating && currentIndex > 0) {
            setIsAnimating(true);
            animate(carouselRef.current,
                { x: [`-${getXOfIndex(currentIndex)}px`, `-${getXOfIndex(currentIndex - 1)}px`] },
                    { duration: 0.6, easing: "ease-in-out" })
                .finished.then(() => {
                    setCurrentIndex(currentIndex - 1);
                    setIsAnimating(false);
                });
        }
    }, [isAnimating, currentIndex, banners.length]);

    // 스크롤 인식
    const carouselRef = useScrollToSlide({ goToNext: moveToNext, goToPrev: moveToPrev });

    useEffect(() => {
        currentInnerWidth.current = window.innerWidth;
    }, [window.innerWidth]);

    return (
        <div>
            <p className={styles.bannerTitle}>{t("mainNoMissEvent")} <span>{currentIndex + 1}/{banners.length}</span></p>
            <div className={styles.carouselTrack}>
                <div className={styles.carouselItems} ref={carouselRef}>
                    {banners.map((banner, key) => 
                        <div key={key} className={styles.carouselItem}>
                            {banner && <img src={banner.image} alt="banner" />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BannerCarousel;