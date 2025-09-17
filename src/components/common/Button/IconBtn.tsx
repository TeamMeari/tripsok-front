import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
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
    const { i18n } = useTranslation();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // 글로브 클릭 시 언어 토글
    const handleGlobeClick = () => {
        setShowMenu((prev) => !prev);
    };

    // 언어 선택
    const handleLanguageSelect = (lang: string) => {
        i18n.changeLanguage(lang);
        setShowMenu(false);
    };

    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // 버튼 클릭 처리
    const handleClick = () => {
        if (type === "globeIcon") handleGlobeClick();
        if (onClick) onClick();
    };

    return (
        <div className={styles.iconWrapper} ref={menuRef}>
            <button
                className={`${styles.iconBtn} ${color === "gray" ? styles.gray : ""}`}
                onClick={handleClick}
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

            {/* 언어 선택 메뉴 */}
            {showMenu && (
                <div className={styles.languageMenu}>
                    <div onClick={() => handleLanguageSelect("ko")}>한국어</div>
                    <div onClick={() => handleLanguageSelect("en")}>English</div>
                    <div onClick={() => handleLanguageSelect("cn")}>中文</div>
                    <div onClick={() => handleLanguageSelect("ja")}>日本語</div>
                </div>
            )}
        </div>
    );
};

export default IconButton;
