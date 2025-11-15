import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.css";
import Button from "../common/Button/CommonBtn";
import IconButton from "../common/Button/IconBtn";
import { ArrowLeft } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import { useApi } from "../../hooks/useApi";
import LanguageButton from "./LanguageButton";

interface HeaderProps {
    backgroundType: "white" | "image" | "transparent"; // 타입: 하얀색 배경 / 이미지 배경 / 투명 배경
    isLogo?: boolean; // 로고 여부
    isAuth?: boolean; // 로그인 및 닉네임 버튼 여부
    isFixed?: boolean; //  고정 여부
    // isSearch?: boolean // 검색 버튼 여부 -> 연동이 안되어 임시 삭제
}

const Header: React.FC<HeaderProps> = ({backgroundType, isLogo = false, isAuth = false, isFixed = true}) => {
    const { t } = useTranslation(); // i18next 훅

    const navigate = useNavigate();
    const { apiCall: logoutApiCall } = useApi();
    const { isLoggedIn, logout, nickname } = useAuthStore();
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const logoSrc = backgroundType === "white" ? "/logo.svg" : "/logo_White.svg";
    const iconColor = backgroundType === "white" ? "gray" : "white";
    const backgroundImage = backgroundType === "image" ? "/HeaderBackImg.svg" : undefined;

    const backgroundStyle = backgroundType === "image" ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderBottom: "1px solid #D9D9D9"
    } : backgroundType === "white" ? {
        backgroundColor: "white",
        borderBottom: "1px solid #D9D9D9"
    } : {
        backgroundColor: "transparent"
    };
    const fixedStyle = {
        position: "absolute",
        top: "0",
        zIndex: "100"
    }

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

    return (
        <header
            className={styles.header}
            style={isFixed ? {...backgroundStyle, ...fixedStyle} : backgroundStyle}
        >
            <div className={styles.left}>
                {isLogo ? 
                    <img
                        src={logoSrc}
                        alt="touang logo"
                        className={styles.logo}
                        onClick={handleLogoClick}
                    /> : 
                    <IconButton
                        Icon={ArrowLeft}
                        color={iconColor}
                        onClick={() => navigate(-1)}
                    />
                }
            </div>

            <div className={styles.right} ref={menuRef}>
                <LanguageButton color={iconColor}/>
                {
                    isAuth && <div className={styles.userMenuWrapper}>
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
                    </div>
                }
            </div>
        </header>
    );
};

export default Header;
