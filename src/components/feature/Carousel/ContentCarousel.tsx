import { useEffect, useRef, useState } from "react";
import styles from "./ContentCarousel.module.css";
import { animate } from "@motionone/dom";

interface ContentCarouselProps {
    images: string[];
}

const ContentCarousel = ({ images }: ContentCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageRef = useRef<HTMLImageElement>(null);
    const paletteRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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

    const handleTouchStart = (e: TouchEvent) => {
        if (!paletteRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - paletteRef.current.offsetLeft);
        setScrollLeft(paletteRef.current.scrollLeft);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || !paletteRef.current) return;
        e.preventDefault();
        const x = e.touches[0].pageX - paletteRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        paletteRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const el = paletteRef.current;
        if (!el) return;

        el.addEventListener('touchstart', handleTouchStart);
        el.addEventListener('touchmove', handleTouchMove);
        el.addEventListener('touchend', handleTouchEnd);

        return () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, startX, scrollLeft]);

    useEffect(() => {
        const el = paletteRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (!paletteRef.current) return;
            const delta = e.deltaY || e.deltaX;
            paletteRef.current.scrollLeft += delta;
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        
        return () => {
            el.removeEventListener('wheel', handleWheel);
        };
    }, []);
    
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