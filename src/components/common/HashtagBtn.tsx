import React, { useState } from "react";
import styles from "./HashtagBtn.module.css";

interface HashtagButtonProps {
    label: string;
    onClick?: () => void;
}

const HashtagButton: React.FC<HashtagButtonProps& { readOnly?: boolean }> = ({ label, onClick, readOnly }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        if (readOnly) return;
        setIsSelected((prev) => !prev);
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
