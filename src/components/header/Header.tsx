import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import Button from "../common/Button/CommonBtn";
import { ArrowLeftIcon } from "lucide-react";

interface HeaderProps {
    isLogo?: boolean;
    useBackground?: boolean; // 개발자가 배경 이미지 사용 여부 선택
}

const Header: React.FC<HeaderProps> = ({ useBackground = false, isLogo = true }) => {
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
                    <button className={styles.arrowLeft} onClick={handleLogoClick}>
                        <ArrowLeftIcon size={33} color="#888888" />
                    </button>}
            </div>
            <div className={styles.right}>
                <img
                    src="/globe.svg"
                    alt="globe"
                    className={styles.globe}
                    onClick={() => {}}
                />
                {isLogo && <Button
                    variant="secondary"
                    borderRadius="48px"
                    onClick={handleAuthClick}
                >
                    {isLoggedIn ? "로그아웃" : "로그인"}
                </Button>}
            </div>
        </header>
    );
};

export default Header;
