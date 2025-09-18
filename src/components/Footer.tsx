import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <h3>주식회사 메아리</h3>
                <p>
                    상호: 투어랑 | 대표자: 신승아 | 사업자등록번호: 874-42-01507<br />
                    문의: support@tourang.com | 010-9619-0440 (평일 10:00–18:00)<br />
                    소재지: 비대면 운영(오프라인 영업장 없음)<br />
                    약관/정책: 이용약관 | 개인정보처리방침 | 환불정책<br />
                    호스팅: AWS | © 2025 Tourang<br />
                    <br />
                    Business Name: Tourang | CEO: Seungah Shin | Business Registration No.: 874-42-01507<br />
                    Contact: support@tourang.com | +82-10-9619-0440 (Mon–Fri 10:00–18:00 KST)<br />
                    Address: Online operation (No offline business location)<br />
                    Terms & Policies: Terms of Service | Privacy Policy | Refund Policy<br />
                    Hosting: AWS | © 2025 Tourang
                </p>
            </div>

        </footer>
    );
};

export default Footer;
