// src/pages/PaymentPage.tsx
import React, { useState, useEffect } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import styles from "./PaymentPage.module.css";
import "./paymentPage_toss.css"
import TransparentHeader from "../components/header/TransparentHeader";
import Button from "../components/common/Button/CommonBtn";
import { useLocation } from "react-router-dom";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"; // 테스트용 클라이언트 키
const customerKey = "customer_1234"; // 유저를 구분할 수 있는 고유값

const PaymentPage: React.FC = () => {
    const [passengerName, setPassengerName] = useState("");
    const [email, setEmail] = useState("");
    const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
    const [isSameAccount, setIsSameAccount] = useState(false);
    const [agreementsChecked, setAgreementsChecked] = useState(false);
    const location = useLocation();
    const state = location.state as any;
    console.log("넘겨받은 state:", state);
    const isFormValid =
        passengerName.trim() !== "" &&
        email.trim() !== "" &&
        isSameAccount;

    useEffect(() => {
        (async () => {
            const widget = await loadPaymentWidget(clientKey, customerKey);

            // 결제 수단 영역
            widget.renderPaymentMethods("#payment-widget", { value: 30000 });

            // 약관 영역
            widget.renderAgreement("#agreement");

            setPaymentWidget(widget);

        })();
    }, []);

    const handlePayment = async () => {
        if (!paymentWidget) return;

        try {
            await paymentWidget.requestPayment({
                orderId: "order_" + new Date().getTime(), // 고유 주문번호
                orderName: "외국인 관광택시 1일(3시간) 이용권",
                customerName: passengerName,
                customerEmail: email,
                successUrl: window.location.origin + "/success", // 결제 성공 후 이동
                failUrl: window.location.origin + "/fail", // 결제 실패 시 이동
            });
        } catch (err: any) {
            // 토스 SDK에서 발생하는 필수약관 미체크 에러 처리
            if (err.code === "AGREEMENT_REQUIRED") {
                alert("필수 약관에 동의해주세요.");
            } else {
                console.error("결제 요청 실패:", err);
                alert("결제 요청에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    return (
        <div className={styles.container}>
            {/* 상단 투명 헤더 */}
            <TransparentHeader type="auth" />
            <hr style={{ margin: "0" }} />

            <div className={styles.paymentPage}>
                {/* 결제 비용 섹션 */}
                <section className={styles.section1}>
                    <div className={styles.pymentPage_taxi}>
                        <h2 className={styles.sectionTitle}>
                            관광택시 결제 비용 <span className={styles.infoIcon}>ⓘ</span>
                        </h2>
                        <div className={styles.paymentBox}>
                            <div className={styles.paymentInfo}>
                                <div className={styles.productTitle}>
                                    외국인 관광택시 1일(3시간) 이용권
                                </div>
                                <div className={styles.productSub}>강릉역 13:00 2명 출발</div>
                            </div>
                            <div className={styles.price}>30,000원</div>
                        </div>
                    </div>
                </section>

                <div className={styles.line}></div>

                {/* 탑승자 정보 섹션 */}
                <section className={styles.section2}>
                    <h2 className={styles.sectionTitle}>탑승자 정보</h2>
                    <div className={styles.inputbox_list}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                placeholder="이름"
                                value={passengerName}
                                onChange={(e) => setPassengerName(e.target.value)}
                                className={styles.inputbox}
                            />
                            <div className={styles.inputText}>신분증 대조가 가능한 실명을 넣어주세요</div>
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                placeholder="이메일 주소"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.inputbox}
                            />
                            <div className={styles.inputText}>영수증을 받아볼 올바른 주소를 입력해주세요</div>
                        </div>
                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="sameAccount"
                                className={styles.roundCheckbox}
                                checked={isSameAccount}
                                onChange={(e) => setIsSameAccount(e.target.checked)}
                            />
                            <div className={styles.checkboxText}>계정 주인과 동일</div>
                        </div>
                    </div>
                </section>

                <div className={styles.line}></div>

                {/* 결제 수단 영역 */}
                <section className={styles.section3}>
                <div id="payment-widget" />
                    <div id="agreement" />
                </section>
            </div>

            {/* 결제 버튼 */}
            <div className={styles.fixedBottomArea}>
                <Button
                    variant={isFormValid ? "primary" : "grayPrimary"}
                    size="large"
                    borderRadius="12px"
                    onClick={handlePayment}
                    disabled={!isFormValid}>
                    결제하기
                </Button>
            </div>
        </div>
    );
};

export default PaymentPage;
