import React, { useState } from "react";
import styles from "./HashtagBtn.module.css";

interface HashtagButtonProps {
    label: string;
    onClick?: () => void;
    isSelected?: boolean;
}

const HashtagButton: React.FC<HashtagButtonProps& { readOnly?: boolean }> = ({ label, onClick, readOnly, isSelected }) => {

    const handleClick = () => {
        if (readOnly) return;
        onClick?.();
    };

    return (
        <button
            className={`${styles.button} ${isSelected ? styles.selected : ""}`}
            onClick={handleClick}
        >
            # {label}
        </button>
    );
};

export default HashtagButton;
