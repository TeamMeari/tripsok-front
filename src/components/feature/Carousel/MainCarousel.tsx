import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MainCarousel.module.css";
import { useNavigate } from "react-router-dom";
import { animate } from "@motionone/dom";

interface MainCarouselItem {
  id: number;
  image: string;
}

interface MainCarouselProps {
  items: MainCarouselItem[];
}

const MainCarousel = ({ items }: MainCarouselProps) => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const extendedItems = [
    items[items.length - 1], // cloneLast
    ...items,
    items[0], // cloneFirst
  ];

  const moveToNext = useCallback(() => {
    if (isAnimating) return;
    const el = carouselRef.current;
    if (!el) return;

    setIsAnimating(true);
    const nextIndex = currentIndex + 1;

    animate(el, { x: [`-${currentIndex * 100}vw`, `-${nextIndex * 100}vw`] }, { duration: 0.6, easing: "ease-in-out" })
      .finished.then(() => {
        let newIndex = nextIndex;

        // 마지막 cloneFirst → 원본 첫 슬라이드 점프
        if (nextIndex === items.length + 1) {
          newIndex = 1;
          el.style.transform = `translateX(-${newIndex * 100}vw)`;
        }

        setCurrentIndex(newIndex);
        setIsAnimating(false);
      });
  }, [currentIndex, isAnimating, items.length]);

  const moveToPrev = useCallback(() => {
    if (isAnimating) return;
    const el = carouselRef.current;
    if (!el) return;

    setIsAnimating(true);
    const prevIndex = currentIndex - 1;

    animate(el, { x: [`-${currentIndex * 100}vw`, `-${prevIndex * 100}vw`] }, { duration: 0.6, easing: "ease-in-out" })
      .finished.then(() => {
        let newIndex = prevIndex;

        // 첫 번째 cloneLast → 원본 마지막 슬라이드 점프
        if (prevIndex === 0) {
          newIndex = items.length;
          el.style.transform = `translateX(-${newIndex * 100}vw)`;
        }

        setCurrentIndex(newIndex);
        setIsAnimating(false);
      });
  }, [currentIndex, isAnimating, items.length]);

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

  // 초기 위치
  useEffect(() => {
    const el = carouselRef.current;
    if (el) el.style.transform = `translateX(-${currentIndex * 100}vw)`;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      moveToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [moveToNext, currentIndex]);

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
