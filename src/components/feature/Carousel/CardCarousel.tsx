import { useState, useRef, useCallback, useEffect } from "react";
import Card from "../../common/Card";
import CardType from "../../../types/Card";
import styles from "./CardCarousel.module.css";
import useScrollHorizon from "../../../hooks/useScrollHorizon";

interface CardCarouselProps {
    cards: CardType[]
}

const CardCarousel = ({ cards }: CardCarouselProps) => {
    const carouselRef = useScrollHorizon();

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