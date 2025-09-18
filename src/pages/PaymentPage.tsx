import React, { useState } from "react";
import styles from "./PaymentPage.module.css";
import TransparentHeader from "../components/header/TransparentHeader";
import Button from "../components/common/Button/CommonBtn";

const PaymentPage: React.FC = () => {
    const [passengerName, setPassengerName] = useState("");
    const [email, setEmail] = useState("");

    const handlePayment = () => {
        console.log("결제 진행:", passengerName, email);
        // 결제 API 연동 자리
    };

    return (
        <div className={styles.container}>
            {/* 상단 투명 헤더 */}
            <TransparentHeader type="auth"/>
            <hr style={{
                margin: "0",
                // border: "solid 0.2px #d9d9d9"
            }}/>

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
                            <input type="checkbox" id="sameAccount" className={styles.roundCheckbox} defaultChecked/>
                            <div className={styles.checkboxText}>계정 주인과 동일</div>
                        </div>
                    </div>

                </section>
                <div className={styles.line}></div>

                <section className={styles.section3}>
                    <h2 className={styles.sectionTitle}>결제 수단 선택</h2>
                    <div id="payment-widget"/>
                    <div id="agreement"/>
                </section>
            </div>

            {/* 결제 버튼 */}
            <div className={styles.fixedBottomArea}>
                <Button variant="primary" size="large" borderRadius="12px" onClick={handlePayment}>
                    결제하기
                </Button>
            </div>

        </div>
    );
};

export default PaymentPage;
