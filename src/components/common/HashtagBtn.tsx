import React, { useState } from "react";
import styles from "./HashtagBtn.module.css";

interface HashtagButtonProps {
    label: string;
    onClick?: () => void;
}

const HashtagButton: React.FC<HashtagButtonProps> = ({ label, onClick }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
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
