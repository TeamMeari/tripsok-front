import { useCallback, useRef, useState, useEffect } from "react";
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
  const [imageIndex, setImageIndex] = useState(1);
  const [textIndex, setTextIndex] = useState(1);
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

  // 텍스트는 독립적으로 관리 (이미지와 무관)

  const getXOfIndex = useCallback((idx: number) => {
    const unit = (window.innerWidth < 360 ? window.innerWidth : 360);
    return idx * unit;
  }, []);
  
  // 초기 텍스트 위치 설정
  useEffect(() => {
    if (textRef.current && texts.length > 0) {
      textRef.current.style.transform = `translateX(-${getXOfIndex(1)}px)`;
    }
  }, [texts.length, getXOfIndex]);

  const moveToNext = useCallback(() => {
    if (isAnimating) return;
    const el = carouselRef.current;
    const textEl = textRef.current;
    if (!el) return;

    setIsAnimating(true);

    // 이미지 슬라이드 애니메이션
    animate(el, { x: [`-${getXOfIndex(imageIndex)}px`, `-${getXOfIndex(imageIndex + 1)}px`] }, { duration: 0.6, easing: "ease-in-out" })
      .finished.then(() => {
        // 마지막 cloneFirst → 원본 첫 슬라이드 점프
        if (imageIndex === items.length) {
          el.style.transform = `translateX(-${getXOfIndex(1)}px)`;
          setImageIndex(1);
        } else {
          setImageIndex(imageIndex + 1);
        }
        setIsAnimating(false);
      });

    // 텍스트 슬라이드 애니메이션 (텍스트가 있을 때만, 독립적으로)
    if (textEl && texts.length > 0) {
      const nextTextIdx = textIndex + 1;
      setTextIndex(nextTextIdx);
      animate(textEl, { x: [`-${getXOfIndex(textIndex)}px`, `-${getXOfIndex(nextTextIdx)}px`] }, { duration: 0.6, easing: "ease-in-out" })
        .finished.then(() => {
          // 텍스트도 무한 루프 처리 (extendedTexts 기준)
          if (nextTextIdx === texts.length + 1) {
            textEl.style.transform = `translateX(-${getXOfIndex(1)}px)`;
            setTextIndex(1);
          }
        });
    }
  }, [isAnimating, items.length, imageIndex, textIndex, texts.length]);

  const moveToPrev = useCallback(() => {
    if (isAnimating) return;
    const el = carouselRef.current;
    const textEl = textRef.current;
    if (!el) return;

    setIsAnimating(true);

    // 이미지 슬라이드 애니메이션
    animate(el, { x: [`-${getXOfIndex(imageIndex)}px`, `-${getXOfIndex(imageIndex - 1)}px`] }, { duration: 0.6, easing: "ease-in-out" })
      .finished.then(() => {
        // 첫 번째 cloneLast → 원본 마지막 슬라이드 점프
        if (imageIndex === 0) {
          el.style.transform = `translateX(-${getXOfIndex(items.length)}px)`;
          setImageIndex(items.length);
        } else {
          setImageIndex(imageIndex - 1);
        }
        setIsAnimating(false);
      });

    // 텍스트 슬라이드 애니메이션 (텍스트가 있을 때만, 독립적으로)
    if (textEl && texts.length > 0) {
      const prevTextIdx = textIndex - 1;
      setTextIndex(prevTextIdx);
      animate(textEl, { x: [`-${getXOfIndex(textIndex)}px`, `-${getXOfIndex(prevTextIdx)}px`] }, { duration: 0.6, easing: "ease-in-out" })
        .finished.then(() => {
          // 텍스트도 무한 루프 처리 (extendedTexts 기준)
          if (prevTextIdx === 0) {
            textEl.style.transform = `translateX(-${getXOfIndex(texts.length)}px)`;
            setTextIndex(texts.length);
          }
        });
    }
  }, [isAnimating, items.length, imageIndex, textIndex, texts.length]);

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
              {extendedTexts.map((text, idx) => {
                return <span key={idx}>{text}</span>
              })}
            </div>
          )}
          <div className={styles.center}>
            <div className={styles.carouselIndicator}>
              {items.map((_, idx) => {
                return <div className={`${styles.carouselIndicatorDot} ${(imageIndex - 1 + items.length) % items.length === idx ? styles.active : ""}`} key={idx}></div>
              })}
            </div>
            <SearchInput variant="main" searchWord={""} />
          </div>
        </div>
    </div>
  );
};

export default MainCarousel;
