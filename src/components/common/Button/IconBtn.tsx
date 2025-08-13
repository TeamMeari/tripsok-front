import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import styles from "./IconBtn.module.css";

type IconType = "search" | "arrow";

interface IconButtonProps {
    type: IconType;
    onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ type, onClick }) => {
    return (
        <button className={styles.iconBtn} onClick={onClick}>
            {type === "search" && <Search className={styles.icon} size={29} />}
            {type === "arrow" && <ArrowLeft className={styles.icon} size={29} />}
        </button>
    );
};

export default IconButton;
