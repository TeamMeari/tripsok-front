import React, { useState, useRef, useEffect, CSSProperties } from "react";
import styles from "./TransparentHeader.module.css";
import IconButton from "../common/Button/IconBtn";
import Button from "../common/Button/CommonBtn";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";

interface TransparentHeaderProps {
    type?: "default" | "auth"; // 기본 투명 헤더(default) / 로그인 포함(auth)
    fixed?: boolean; //  고정 여부
    onBackClick?: () => void;
}

const TransparentHeader: React.FC<TransparentHeaderProps> = ({ type = "default", fixed = false, onBackClick  }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isLoggedIn, logout, nickname } = useAuthStore();
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const { apiCall: logoutApiCall } = useApi();
    const menuRef = useRef<HTMLDivElement>(null);


    const handleArrowClick = () => {
        if (onBackClick) {
            onBackClick(); // 페이지에서 전달한 함수 실행
        } else {
            console.log("뒤로가기");
            navigate(-1);
        }
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowLogoutMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const headerStyle: CSSProperties = fixed
        ? { position: "fixed",  zIndex: 500 }
        : {};

    return (
        <header className={styles.header} style={headerStyle}>
            <div className={styles.left}>
                <IconButton type="arrow" onClick={handleArrowClick} />
            </div>

            <div className={styles.right} ref={menuRef}>
                {type === "default" && (
                    <>
                        <IconButton type="globeIcon" />
                        <IconButton type="search" onClick={() => console.log("검색")} />
                    </>
                )}

                {type === "auth" && (
                    <>
                        <IconButton type="globeIcon" />
                        <div className={styles.userMenuWrapper}>
                            <Button variant="secondary" radius="large" onClick={handleAuthClick}>
                                {isLoggedIn ? t("greeting", { name: nickname }) : t("login")}
                            </Button>
                            {isLoggedIn && showLogoutMenu && (
                                <div className={styles.dropdownMenu}>
                                    <button onClick={handleLogout}>로그아웃</button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default TransparentHeader;
