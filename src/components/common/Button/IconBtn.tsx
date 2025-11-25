import React from "react";
import { ArrowLeft, LucideIcon, Search } from "lucide-react";
import styles from "./IconBtn.module.css";

type ColorType = "white" | "gray";
type StyleType = "plain" | "shadow"

interface IconButtonProps {
    Icon: LucideIcon;
    styleType?: StyleType;
    color?: ColorType; // 기본값은 white
    size?: number;
    onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ Icon, color = "white", styleType = "plain", size = 29, onClick }) => {
    const lineColor = color === 'white' ? "#ffffff" : color === 'gray' ? "#888888" : "#000000";

    return (
        <button
            className={`${styles.iconBtn} ${color === "gray" ? styles.gray : ""}`}
            onClick={onClick}
        >
            <Icon className={`${styles.icon} ${styleType === "shadow" ? styles.shadow : ""}`} size={size} color={lineColor} />
            {/* {type === "search" && <Search  size={29} className={styles.icon}/>}
            {type === "arrow" && <ArrowLeft className={styles.icon} size={29} />}
            {type === "globeIcon" && (
                <GlobeIcon
                    className={styles.icon}
                    size={29}
                    color={color === "gray" ? "#888888" : "#ffffff"}
                />
            )} */}
        </button>
    );
};

export default IconButton;
