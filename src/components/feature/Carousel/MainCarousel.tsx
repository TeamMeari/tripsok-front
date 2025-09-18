import { useCallback, useRef, useState, useEffect } from "react";
import styles from "./MainCarousel.module.css";
import { useNavigate } from "react-router-dom";
import { animate } from "@motionone/dom";
import { useScrollToSlide } from "../../../hooks/useScrollToSlide";
import SearchInput from "../SearchInput";

export interface MainCarouselItem {
  id: number;
  image: string;
  type: "restaurant" | "tour" | "accommodation";
}

interface MainCarouselProps {
  items: MainCarouselItem[];
  texts?: string[]; // 선택적 속성으로 변경
  isLoading?: boolean;
}

const MainCarousel = ({ items, texts = [], isLoading = false }: MainCarouselProps) => {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(1);
  const [textIndex, setTextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const extendedItems = items.length > 0 ? [
    items[items.length - 1], // cloneLast
    ...items,
    items[0], // cloneFirst
  ] : [];

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
  

  const handleCarouselItemClick = useCallback((e: React.MouseEvent<HTMLDivElement>, type: "restaurant" | "tour" | "accommodation", id: number) => {
    e.stopPropagation();
    navigate(`/content/${type}/${id}`);
  }, [navigate]);

  // 탭/스와이프 구분을 위한 터치 좌표 저장
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const handleCarouselItemTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    // start에서는 전파를 막지 않아 컨테이너 훅이 시작 좌표를 기록할 수 있게 둔다
  }, []);

  const handleCarouselItemTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>, type: "restaurant" | "tour" | "accommodation", id: number) => {
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartXRef.current);
    const deltaY = Math.abs(touch.clientY - touchStartYRef.current);
    const TAP_THRESHOLD = 10; // px
    // 이동이 작으면 탭으로 간주하고 클릭과 동일 처리
    if (deltaX < TAP_THRESHOLD && deltaY < TAP_THRESHOLD) {
      e.stopPropagation();
      navigate(`/content/${type}/${id}`);
    }
    // 스와이프인 경우 전파를 막지 않아 컨테이너 훅이 슬라이드 처리
  }, [navigate]);

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
  const trackRef = useScrollToSlide({
    goToNext: moveToNext,
    goToPrev: moveToPrev,
    enabled: !isLoading,
  });

  return (
    <div className={styles.carouselContainer} ref={trackRef}>
      <div className={styles.carouselTrack}>
        <div className={styles.carouselItems} ref={carouselRef}>
          {isLoading ? (
            // 로딩 중일 때 스켈레톤 표시
            Array.from({ length: 3 }).map((_, idx) => (
              <div className={`${styles.carouselItem} skeleton`} key={idx}>
              </div>
            ))
          ) : (
            // 로딩 완료 시 실제 이미지 표시
            extendedItems.map((item, idx) => (
              <div className={styles.carouselItem} key={idx} onClick={(e) => handleCarouselItemClick(e, item.type, item.id)} onTouchStart={(e) => handleCarouselItemTouchStart(e)} onTouchEnd={(e) => handleCarouselItemTouchEnd(e, item.type, item.id)}>
                <img
                  src={item.image}
                  alt=""
                />
              </div>
            ))
          )}
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
            <div onClick={(e) => e.stopPropagation()}>
              <SearchInput variant="main" searchWord={""} />
            </div>
          </div>
        </div>
    </div>
  );
};

export default MainCarousel;
