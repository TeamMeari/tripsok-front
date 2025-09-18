// src/pages/PaymentSuccessPage.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./payment_successPage.module.css";
import TransparentHeader from "../components/header/TransparentHeader";
import Button from "../components/common/Button/CommonBtn";

const PaymentSuccessPage: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    // Toss에서 redirect될 때 전달해주는 값들
    const orderId = query.get("orderId");
    const paymentKey = query.get("paymentKey");
    const amount = query.get("amount");

    return (
        <div className={styles.container}>
            <TransparentHeader type="auth" />
            <hr style={{ margin: "0" }} />

            <div className={styles.content}>
                <h2 className={styles.title}>✅ 결제가 완료되었습니다</h2>
                <div className={styles.infoBox}>
                    <p><strong>주문번호:</strong> {orderId}</p>
                    <p><strong>결제금액:</strong> {amount} 원</p>
                    <p><strong>결제키:</strong> {paymentKey}</p>
                </div>

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
