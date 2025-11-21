import GlobeIcon from '../Icons/globeIcon'
import { useEffect, useRef, useState } from 'react';
import styles from './LanguageButton.module.css'
import iconStyles from '../common/Button/IconBtn.module.css'
import { useTranslation } from 'react-i18next';

type ColorType = "white" | "gray";

const LanguageButton = ({ color = "white" } : {color?: ColorType}) => {
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

    return (
        <div className={styles.wrapper} ref={menuRef}>
            <button
                className={`${iconStyles.iconBtn} ${color === "white" ? iconStyles.shadow : ""}`}
                onClick={handleGlobeClick}
            >
                <GlobeIcon
                    className={iconStyles.icon}
                    size={29}
                    color={color === "gray" ? "#888888" : "#ffffff"}
                />
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

export default LanguageButton;