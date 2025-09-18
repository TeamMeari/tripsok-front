// src/pages/PaymentSuccessPage.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./payment_successPage.module.css";
import TransparentHeader from "../components/header/TransparentHeader";
import Button from "../components/common/Button/CommonBtn";
import { useTranslation } from "react-i18next";

const PaymentSuccessPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const orderId = query.get("orderId");
    const paymentKey = query.get("paymentKey");
    const amount = query.get("amount");
    const email = query.get("passengerEmail")

    return (
        <div className={styles.container}>
            <TransparentHeader type="auth"/>
            <div className={styles.line}></div>
            <div className={styles.pyment_succssPage}>
                <div className={styles.pyment_succss}>
                    <div className={styles.successIcon}>
                        <img src="/InfoIcon/bag.svg" alt="asuccessIcon" className={styles.successIcon_img}></img>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.infoBox}>
                            <div className={styles.title}>{t("paymentSuccess")}</div>
                            <div className={styles.text}>{t("receiptSent")}</div>
                        </div>


                    </div>
                </div>
            </div>
            <div className={styles.fixedBottomArea}>
                <Button
                    variant="primary"
                    size="large"
                    borderRadius="12px"
                    onClick={() => (window.location.href = "/")}
                    >
                    메인으로 이동
                </Button>
            </div>

        </div>


    );
};

export default PaymentSuccessPage;
