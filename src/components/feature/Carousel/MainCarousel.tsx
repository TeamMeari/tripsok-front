import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MainCarousel.module.css";
import { useNavigate } from "react-router-dom";
import { animate } from "@motionone/dom";
import { useScrollToSlide } from "../../../hooks/useScrollToSlide";

interface MainCarouselItem {
  id: number;
  image: string;
}

interface MainCarouselProps {
  items: MainCarouselItem[];
}

const MainCarousel = ({ items }: MainCarouselProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const extendedItems = [
    items[items.length - 1], // cloneLast
    ...items,
    items[0], // cloneFirst
  ];

  const getXOfIndex = useCallback((idx: number) => {
    const unit = (window.innerWidth < 360 ? window.innerWidth : 360);
    return idx * unit;
  }, []);

  const moveToNext = useCallback(() => {
    if (isAnimating) return;
    const el = carouselRef.current;
    if (!el) return;

    setIsAnimating(true);

    animate(el, { x: [`-${getXOfIndex(currentIndex)}px`, `-${getXOfIndex(currentIndex + 1)}px`] }, { duration: 0.6, easing: "ease-in-out" })
      .finished.then(() => {

        // 마지막 cloneFirst → 원본 첫 슬라이드 점프
        if (currentIndex === items.length) {
          el.style.transform = `translateX(-${getXOfIndex(currentIndex + 1)}px)`;
        }

        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      });
  }, [isAnimating, items.length]);

  const moveToPrev = useCallback(() => {
    if (isAnimating) return;
    const el = carouselRef.current;
    if (!el) return;

    setIsAnimating(true);

    animate(el, { x: [`-${getXOfIndex(currentIndex)}px`, `-${getXOfIndex(currentIndex - 1)}px`] }, { duration: 0.6, easing: "ease-in-out" })
      .finished.then(() => {

        // 첫 번째 cloneLast → 원본 마지막 슬라이드 점프
        if (currentIndex === 0) {
          el.style.transform = `translateX(-${getXOfIndex(items.length)}px)`;
        }

        setCurrentIndex(currentIndex - 1);
        setIsAnimating(false);
      });
  }, [isAnimating, items.length]);

  // 스크롤 처리
  const carouselRef = useScrollToSlide({ goToNext: moveToNext, goToPrev: moveToPrev });

  return (
    <div className={styles.carouselTrack}>
      <div className={styles.carouselItems} ref={carouselRef}>
        {extendedItems.map((item, idx) => (
          <div className={styles.carouselItem} key={idx}>
            <img
              src={item.image}
              alt=""
              onClick={() => navigate(`/content/${item.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCarousel;
