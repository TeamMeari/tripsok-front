import React, { useEffect, useRef } from "react";
import { animate, stagger } from "@motionone/dom";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner: React.FC = () => {
    const spinnerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!spinnerRef.current) return;

        const dots = spinnerRef.current.querySelectorAll<HTMLDivElement>(
            `.${styles.dot}`
        );

        // 순차적 깜빡임
        animate(
            dots,
            { opacity: [0.2, 1, 0.2] },
            {
                duration: 1,
                repeat: Infinity,
                easing: "ease-in-out",
                delay: stagger(0.1),
            }
        );
    }, []);

    const numDots = 8;
    const radius = 30;
    const angles = Array.from({ length: numDots }, (_, i) => i * (360 / numDots));

    return (
        <div className={styles.spinnerWrapper}>
            <div ref={spinnerRef} className={styles.spinner}>
                {angles.map((deg, idx) => (
                    <div
                        key={idx}
                        className={styles.dot}
                        style={{
                            transform: `rotate(${deg}deg) translateY(-${radius}px)`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default LoadingSpinner;
