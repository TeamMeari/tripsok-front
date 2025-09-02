import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import styles from "./IconBtn.module.css";
import GlobeIcon from "../../Icons/globeIcon";

type IconType = "search" | "arrow" | "globeIcon";
type ColorType = "white" | "gray";

interface IconButtonProps {
    type: IconType;
    color?: ColorType; // 기본값은 white
    onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ type, color = "white", onClick }) => {
    return (
        <button
            className={`${styles.iconBtn} ${color === "gray" ? styles.gray : ""}`}
            onClick={onClick}
        >
            {type === "search" && <Search className={styles.icon} size={29} />}
            {type === "arrow" && <ArrowLeft className={styles.icon} size={29} />}
            {type === "globeIcon" && (
                <GlobeIcon
                    className={styles.icon}
                    size={29}
                    color={color === "gray" ? "#888888" : "#ffffff"}
                />
            )}
        </button>
    );
};


export default IconButton;
