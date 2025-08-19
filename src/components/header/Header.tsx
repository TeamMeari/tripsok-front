import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import Button from "../common/Button/CommonBtn";

interface HeaderProps {
    useBackground?: boolean; // 개발자가 배경 이미지 사용 여부 선택
}

const Header: React.FC<HeaderProps> = ({ useBackground = false }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleAuthClick = () => {
        setIsLoggedIn(prev => !prev);
        console.log(isLoggedIn ? "로그아웃 완료" : "로그인 완료");
    };

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
            <div className={styles.right}>
                <img
                    src="/globe.svg"
                    alt="globe"
                    className={styles.globe}
                    onClick={() => {}}
                />
                <Button
                    variant="secondary"
                    borderRadius="48px"
                    onClick={handleAuthClick}
                >
                    {isLoggedIn ? "로그아웃" : "로그인"}
                </Button>
            </div>
        </header>
    );
};

export default Header;
