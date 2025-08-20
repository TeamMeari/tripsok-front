import React from "react";
import styles from "./TransparentHeader.module.css";
import IconButton from "../common/Button/IconBtn";
const TransparentHeader: React.FC = () => {

    const handleArrowClick = (): void => {
        console.log("뒤로가기");
    };

    const handleSearchClick = (): void => {
        console.log("검색");
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <IconButton type="arrow" onClick={handleArrowClick} />
            </div>
            <div className={styles.right}>
                <IconButton type="search" onClick={handleSearchClick} />
            </div>
        </header>
    );
};

export default TransparentHeader;
