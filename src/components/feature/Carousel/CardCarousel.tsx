import { useState, useRef, useCallback, useEffect } from "react";
import Card from "../../common/Card";
import CardType from "../../../types/Card";
import styles from "./CardCarousel.module.css";
import useScrollHorizon from "../../../hooks/useScrollHorizon";

interface CardCarouselProps {
    cards: CardType[]
    isLoading?: boolean
    onCardClick?: (card: CardType) => void;
}

const CardCarousel = ({ cards, isLoading = false, onCardClick }: CardCarouselProps) => {
    const carouselRef = useScrollHorizon(!isLoading);

    return (
        <div 
            className={styles.carouselTrack}
            ref={carouselRef}
        >
            <div className={styles.carouselItems}>
                {isLoading ? (
                    // 로딩 중일 때 스켈레톤 표시
                    Array.from({ length: 3 }).map((_, idx) => (
                        <Card key={idx} isLoading />
                    ))
                ) : (
                    cards.map((card) => (
                    <Card
                        key={card.id}
                        rank={card.rank}
                        title={card.title}
                        description={card.description}
                        image={card.image}
                        id={card.id}
                        type={card.type}
                        onClick={() => onCardClick?.(card)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CardCarousel;