import { useRef, useEffect } from "react";

export default function useScrollHorizon(enabled: boolean = true) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;
        const el = ref.current;
        if (!el) return;
    
        // 데스크톱 휠 - 위아래 스크롤 시 좌우로 움직이기
        const handleWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                // 마우스 커서가 CardCarousel 요소 위에 있는지 확인
                const rect = el.getBoundingClientRect();
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                if (mouseX >= rect.left && mouseX <= rect.right && 
                    mouseY >= rect.top && mouseY <= rect.bottom) {
                    // 커서가 요소 위에 있으면 좌우로 스크롤
                    e.preventDefault();
                    el.scrollLeft += e.deltaY;
                }
            }
        };
    
        // 모바일 터치 슬라이드
        let startX = 0;
        let scrollStart = 0;
    
        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].pageX;
            scrollStart = el.scrollLeft;
        };
    
        const handleTouchMove = (e: TouchEvent) => {
            const deltaX = startX - e.touches[0].pageX;
            el.scrollLeft = scrollStart + deltaX;
        };
    
        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("touchstart", handleTouchStart);
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
    
        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
        };
    }, [enabled]);

    return ref;
}