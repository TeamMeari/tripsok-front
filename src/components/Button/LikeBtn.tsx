// LikeButton.tsx
import React, { useState, useCallback, useRef } from "react";
import { animate } from "@motionone/dom";
import styles from "./LikeBtn.module.css";

type LikeButtonProps = {
    initialLiked?: boolean;
    onChange?: (liked: boolean) => void;
    onClick?: () => void;
};

export default function LikeButton({ initialLiked = false, onChange, onClick }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleLike = useCallback(() => {
        setLiked(prev => {
            const next = !prev;
            onChange?.(next);

            //애니메이션 추가
            if (buttonRef.current) {
                animate(buttonRef.current, { scale: [1, 1.5, 1] }, { duration: 0.3 });
            }

            return next;
        });
        onClick?.();
    }, [onChange, onClick]);

    const beforeIcon = "/like/before.svg";
    const afterIcon = "/like/after.svg";

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
            className={styles.button}
        >
            <img
                src={liked ? afterIcon : beforeIcon}
                alt={liked ? "좋아요 취소" : "좋아요"}
                className={styles.icon}
            />
        </button>
    );
}
