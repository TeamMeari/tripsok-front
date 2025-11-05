import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.css";
import Button from "../common/Button/CommonBtn";
import IconButton from "../common/Button/IconBtn";
import { ArrowLeftIcon } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import { useApi } from "../../hooks/useApi";

interface HeaderProps {
    isLogo?: boolean;
    isLoginButton?: boolean;
    useBackground?: boolean; // 배경 이미지 사용 여부 선택
}

const Header: React.FC<HeaderProps> = ({ useBackground = false, isLogo = true, isLoginButton = true }) => {
    const { t } = useTranslation(); // i18next 훅

    const navigate = useNavigate();
    const { apiCall: logoutApiCall } = useApi();
    const { isLoggedIn, logout, nickname } = useAuthStore();
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleAuthClick = () => {
        if (isLoggedIn) {
            setShowLogoutMenu(prev => !prev);
        } else {
            navigate("/login");
            setShowLogoutMenu(false);
        }
    };

    const handleLogout = () => {
        logoutApiCall('/auth/logout', 'POST').then(() => {
            logout();
        });
        setShowLogoutMenu(false);
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
                borderBottom: backgroundImage ? "none" : "1px solid #D9D9D9",
            }}
        >
            <div className={styles.left}>
                {isLogo ? 
                    <img
                        src={logoSrc}
                        alt="touang logo"
                        className={styles.logo}
                        onClick={handleLogoClick}
                    /> : 
                    <button className={styles.arrowLeft} onClick={() => navigate(-1)}>
                        <ArrowLeftIcon size={33} color="#888888" />
                    </button>}
            </div>

            <div className={styles.right} ref={menuRef}>
                <IconButton type="globeIcon" />
                {isLoginButton && <div className={styles.userMenuWrapper}>
                    <Button
                        variant="secondary"
                        radius="large"
                        onClick={handleAuthClick}
                    >
                        {isLoggedIn
                            ? t("greeting", { name: nickname })
                            : t("login")}
                    </Button>

                    {/* 드롭다운 메뉴 */}
                    {isLoggedIn && showLogoutMenu && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={() => navigate("/my")}>{t("mypage")}</button>
                            <button onClick={handleLogout}>{t("logout")}</button>
                        </div>
                    )}
                </div>}

            </div>
        </header>
    );
};

export default Header;
