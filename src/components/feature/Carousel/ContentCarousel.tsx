import { useEffect, useRef, useState } from "react";
import styles from "./ContentCarousel.module.css";
import { animate } from "@motionone/dom";
import useScrollHorizon from "../../../hooks/useScrollHorizon";

interface ContentCarouselProps {
    images: string[];
}

const ContentCarousel = ({ images }: ContentCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageRef = useRef<HTMLImageElement>(null);
    const paletteRef = useScrollHorizon();

    const maxImageCount = Math.ceil((window.innerWidth - 48) / 56);

    const handleImageClick = (index: number) => {
        if (!imageRef.current) return;
        animate(imageRef.current, {
            opacity: [0, 1]
        }, {
            duration: 0.4,
            easing: "ease"
        });
        setCurrentIndex(index);
    }
    
    return (
        <div>
            <div className={styles.imageScreen}>
                <img src={images[currentIndex]} alt="" ref={imageRef}/>
            </div>
            <div className={styles.imagePaletteContainer} ref={paletteRef}>
                <div className={styles.imagePalette} style={images.length < maxImageCount ? { display: "flex", justifyContent: "center" } : {}}>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`${styles.imagePaletteItem} ${index === currentIndex ? styles.active : ""}`}
                            onClick={() => handleImageClick(index)}
                        >
                            <img src={image} alt=""/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ContentCarousel;