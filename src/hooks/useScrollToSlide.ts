import { useEffect, useRef } from "react";

type ScrollHandler = () => void;

interface UseScrollToSlideProps {
  goToNext: ScrollHandler;
  goToPrev: ScrollHandler;
}

/**
 * 스크롤 감지 Hook (스로틀)
 * - 휠 이벤트 발생 시 즉시 방향에 따라 실행
 * - 일정 시간(예: 500ms) 동안은 추가 실행 방지
 * - 세로/가로 스크롤 방향 인식
 */
export function useScrollToSlide({
  goToNext,
  goToPrev,
}: UseScrollToSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isThrottled = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 데스크톱 휠 이벤트
    const handleWheel = (e: WheelEvent) => {
      if (isThrottled.current) return;

      // 방향 계산
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.deltaX > 0 ? goToNext() : goToPrev();
      } else {
        e.deltaY > 0 ? goToNext() : goToPrev();
      }

      // 스로틀 활성화
      isThrottled.current = true;
      setTimeout(() => {
        isThrottled.current = false;
      }, 500); // 0.5초 동안 추가 실행 방지
    };

    // 모바일 Touch 이벤트
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isThrottled.current) return;

      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;

      deltaX < 0 ? goToNext() : goToPrev();

      isThrottled.current = true;
      setTimeout(() => (isThrottled.current = false), 500);
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goToNext, goToPrev]);

  // 기존 스크롤, 터치 이벤트 방지
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const preventScroll = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
        }
    };

    const preventTouch = (e: TouchEvent) => {
        e.preventDefault();
    };

    el.addEventListener('wheel', preventScroll, { passive: false });
    el.addEventListener('touchstart', preventTouch, { passive: false });
    return () => {
        el.removeEventListener('wheel', preventScroll);
        el.removeEventListener('touchstart', preventTouch);
    };
}, []);

  return containerRef;
}