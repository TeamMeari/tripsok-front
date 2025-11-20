// LikeButton.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { animate } from "@motionone/dom";
import styles from "./LikeBtn.module.css";

type LikeButtonProps = {
    state?: boolean;
    onClick?: () => void;
};

export default function LikeButton({ state = false, onClick }: LikeButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const isFirstRender = useRef(true); // 첫 렌더 애니메이션 삭제용 ref

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!buttonRef.current) return;
        animate(buttonRef.current, { scale: [1, 1.5, 1] }, { duration: 0.3 });
    }, [state])

    const beforeIcon = "/like/before.svg";
    const afterIcon = "/like/after.svg";

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={onClick}
            aria-pressed={state}
            aria-label={state ? "좋아요 취소" : "좋아요"}
            className={styles.button}
        >
            <img
                src={state ? afterIcon : beforeIcon}
                alt={state ? "좋아요 취소" : "좋아요"}
                className={styles.icon}
            />
        </button>
    );
}
