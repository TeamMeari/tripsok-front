import { useState, useRef, useCallback, useEffect } from "react";
import Card from "../../common/Card";
import CardType from "../../../types/Card";
import styles from "./CardCarousel.module.css";

interface CardCarouselProps {
    cards: CardType[]
}

const CardCarousel = ({ cards }: CardCarouselProps) => {
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
    
        // 데스크톱 휠
        const handleWheel = (e: WheelEvent) => {
            el.scrollLeft += e.deltaY; 
        };
    
        // 모바일 터치 슬라이드
        let startX = 0;
        let scrollStart = 0;
    
        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].pageX;
            scrollStart = el.scrollLeft;
        };
    
        const handleTouchMove = (e: TouchEvent) => {
            const deltaX = startX - e.touches[0].pageX;
            el.scrollLeft = scrollStart + deltaX;
        };
    
        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("touchstart", handleTouchStart);
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
    
        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    return (
        <div 
            className={styles.carouselTrack}
            ref={carouselRef}
        >
            <div className={styles.carouselItems}>
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        rank={card.rank}
                        title={card.title}
                        description={card.description}
                        image={card.image}
                        id={card.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default CardCarousel;