import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SuccessPage.module.css";
import Button from "../components/common/Button/CommonBtn";
import { useTranslation } from "react-i18next";
import { useApi } from "../hooks/useApi";

const PaymentSuccessPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);

    const { apiCall } = useApi();

    const orderId = query.get("orderId");
    const paymentKey = query.get("paymentKey");
    const amount = query.get("amount");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

    // useRef로 중복 호출 방지
    const hasRequestedRef = useRef(false);

    useEffect(() => {
        if (!paymentKey || !orderId || !amount) {
            setError("결제 정보가 올바르지 않습니다.");
            setLoading(false);
            return;
        }

        // 이미 호출했으면 return
        if (hasRequestedRef.current) return;
        hasRequestedRef.current = true;

        const sendBookingInfo = async () => {
            const contactEmail = sessionStorage.getItem("passengerEmail") || "";
            const userName = sessionStorage.getItem("passengerName") || "";

            const body = {
                contactEmail,
                userName,
                paymentInfo: {
                    orderNumber: orderId,
                    amount: Number(amount),
                    paymentKey,
                },
            };

            try {
                const res = await apiCall<{ email?: string }>(
                    `${API_BASE_URL}/booking?locale=KO`,
                    "POST",
                    body
                );

                if (res.error) throw res.error;

                console.log("예약 등록 성공:", res.data);
                setEmail(res.data?.email || contactEmail);
            } catch (err) {
                console.error("예약 API 요청 실패:", err);
                setError("서버와 통신 중 문제가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        sendBookingInfo();
    }, [orderId, paymentKey, amount, apiCall, API_BASE_URL]);

    return (
        <div className={styles.container}>
            <div className={styles.line}></div>

            <div className={styles.pyment_succssPage}>
                <div className={styles.pyment_succss}>
                    <div className={styles.successIcon}>
                        <img
                            src="/InfoIcon/bag.svg"
                            alt="successIcon"
                            className={styles.successIcon_img}
                        />
                    </div>
                    <div className={styles.content}>
                        {loading ? (
                            <div className={styles.infoBox}>
                                <div className={styles.title}>{t("paymentProcessing") || "결제 확인 중..."}</div>
                                <div className={styles.text}>잠시만 기다려주세요 🙏</div>
                            </div>
                        ) : error ? (
                            <div className={styles.infoBox}>
                                <div className={styles.title}>오류 발생 ⚠️</div>
                                <div className={styles.text}>{error}</div>
                            </div>
                        ) : (
                            <div className={styles.infoBox}>
                                <div className={styles.title}>{t("paymentSuccess")}</div>
                                <div className={styles.text}>
                                    {email
                                        ? `${email}로 영수증이 발송되었습니다.`
                                        : t("receiptSent")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.fixedBottomArea}>
                <Button
                    variant="primary"
                    size="large"
                    onClick={() => (window.location.href = "/")}
                >
                    메인으로 이동
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
