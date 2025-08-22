import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <h3>주식회사 메아리</h3>
                <p>© 2025 어쩌고 회사 정보를 입력합니다. 회사정보를 입력합니다. 회사정보를 입력합니다.회사정보를 입력합니다.</p>
                <p>개인정보 이용 약관 고객센터 01000000000</p>
            </div>

        </footer>
    );
};

export default Footer;
