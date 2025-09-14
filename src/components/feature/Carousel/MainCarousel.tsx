import { useCallback, useRef, useState } from "react";
import styles from "./MainCarousel.module.css";
import { useNavigate } from "react-router-dom";
import { animate } from "@motionone/dom";
import { useScrollToSlide } from "../../../hooks/useScrollToSlide";
import SearchInput from "../SearchInput";

interface MainCarouselItem {
  id: number;
  image: string;
}

interface MainCarouselProps {
  items: MainCarouselItem[];
  texts?: string[]; // 선택적 속성으로 변경
}

const MainCarousel = ({ items, texts = [] }: MainCarouselProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const extendedItems = [
    items[items.length - 1], // cloneLast
    ...items,
    items[0], // cloneFirst
  ];

  // texts가 있을 때만 확장된 배열 생성
  const extendedTexts = texts.length > 0 ? [
    texts[texts.length - 1],
    ...texts,
    texts[0],
  ] : [];

  // 텍스트 인덱스 계산 (items 기준으로 순환)
  const getTextIndex = useCallback((itemIndex: number) => {
    if (texts.length === 0) return 0;
    return (itemIndex - 1 + texts.length) % texts.length;
  }, [texts.length]);

  const getXOfIndex = useCallback((idx: number) => {
    const unit = (window.innerWidth < 360 ? window.innerWidth : 360);
    return idx * unit;
  }, []);

  const moveToNext = useCallback(() => {
    if (isAnimating) return;
    const el = carouselRef.current;
    const textEl = textRef.current;
    if (!el) return;

    setIsAnimating(true);

    // 이미지 슬라이드 애니메이션
    animate(el, { x: [`-${getXOfIndex(currentIndex)}px`, `-${getXOfIndex(currentIndex + 1)}px`] }, { duration: 0.6, easing: "ease-in-out" })
      .finished.then(() => {
        // 마지막 cloneFirst → 원본 첫 슬라이드 점프
        if (currentIndex === items.length) {
          el.style.transform = `translateX(-${getXOfIndex(1)}px)`;
          setCurrentIndex(1);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
        setIsAnimating(false);
      });

    // 텍스트 슬라이드 애니메이션 (텍스트가 있을 때만)
    if (textEl && texts.length > 0) {
      const nextTextIndex = getTextIndex(currentIndex + 1);
      animate(textEl, { x: [`-${getXOfIndex(currentIndex)}px`, `-${getXOfIndex(currentIndex + 1)}px`] }, { duration: 0.6, easing: "ease-in-out" });
    }
  }, [isAnimating, items.length, currentIndex, texts.length]);

  const moveToPrev = useCallback(() => {
    if (isAnimating) return;
    const el = carouselRef.current;
    const textEl = textRef.current;
    if (!el) return;

    setIsAnimating(true);

    // 이미지 슬라이드 애니메이션
    animate(el, { x: [`-${getXOfIndex(currentIndex)}px`, `-${getXOfIndex(currentIndex - 1)}px`] }, { duration: 0.6, easing: "ease-in-out" })
      .finished.then(() => {
        // 첫 번째 cloneLast → 원본 마지막 슬라이드 점프
        if (currentIndex === 0) {
          el.style.transform = `translateX(-${getXOfIndex(items.length)}px)`;
          setCurrentIndex(items.length);
        } else {
          setCurrentIndex(currentIndex - 1);
        }
        setIsAnimating(false);
      });

    // 텍스트 슬라이드 애니메이션 (텍스트가 있을 때만)
    if (textEl && texts.length > 0) {
      const prevTextIndex = getTextIndex(currentIndex - 1);
      animate(textEl, { x: [`-${getXOfIndex(currentIndex)}px`, `-${getXOfIndex(currentIndex - 1)}px`] }, { duration: 0.6, easing: "ease-in-out" });
    }
  }, [isAnimating, items.length, currentIndex, texts.length]);

  // 스크롤 처리
  const trackRef = useScrollToSlide({ goToNext: moveToNext, goToPrev: moveToPrev });
  return (
    <div className={styles.carouselContainer} ref={trackRef}>
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
      <div className={styles.externalContent}>
          {texts.length > 0 && (
            <div className={styles.texts} ref={textRef}>
              {extendedItems.map((_, idx) => {
                const textIndex = getTextIndex(idx);
                const text = texts[textIndex] || texts[0] || '';
                return <span key={idx}>{text}</span>
              })}
            </div>
          )}
          <div className={styles.center}>
            <div className={styles.carouselIndicator}>
              {items.map((_, idx) => {
                return <div className={`${styles.carouselIndicatorDot} ${(currentIndex - 1 + items.length) % items.length === idx ? styles.active : ""}`} key={idx}></div>
              })}
            </div>
            <SearchInput variant="main" searchWord={""} />
          </div>
        </div>
    </div>
  );
};

export default MainCarousel;
