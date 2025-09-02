import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import styles from "./Header.module.css";
import Button from "../common/Button/CommonBtn";
import IconButton from "../common/Button/IconBtn";

interface HeaderProps {
    useBackground?: boolean;
}

const Header: React.FC<HeaderProps> = ({ useBackground = false }) => {
    const { t } = useTranslation(); // i18next 훅
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const userName = "홍길동"; //테스트 닉네임

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleAuthClick = () => {
        if (isLoggedIn) {
            setShowLogoutMenu(prev => !prev);
        } else {
            setIsLoggedIn(true);
            setShowLogoutMenu(false);
            console.log(t("login") + " 완료");
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowLogoutMenu(false);
        console.log(t("logout") + " 완료");
    };

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowLogoutMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logoSrc = useBackground ? "/logo_White.svg" : "/logo.svg";
    const backgroundImage = useBackground ? "/HeaderBackImg.svg" : undefined;

    return (
        <header
            className={styles.header}
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className={styles.left}>
                <img
                    src={logoSrc}
                    alt="touang logo"
                    className={styles.logo}
                    onClick={handleLogoClick}
                />
            </div>

            <div className={styles.right} ref={menuRef}>
                <IconButton type="globeIcon" />
                <div className={styles.userMenuWrapper}>
                    <Button
                        variant="secondary"
                        borderRadius="48px"
                        onClick={handleAuthClick}
                    >
                        {isLoggedIn
                            ? t("greeting", { name: userName })
                            : t("login")}
                    </Button>

                    {/* 드롭다운 메뉴 */}
                    {isLoggedIn && showLogoutMenu && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={handleLogout}>{t("logout")}</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
