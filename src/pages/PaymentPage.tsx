import React, { useState, useEffect } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import styles from "./PaymentPage.module.css";
import TransparentHeader from "../components/header/TransparentHeader";
import Button from "../components/common/Button/CommonBtn";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "customer_1234";

const PaymentPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isEnglish = i18n.language === "en";
    const [passengerName, setPassengerName] = useState("");
    const [email, setEmail] = useState("");
    const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
    const [isSameAccount, setIsSameAccount] = useState(false);
    const [agreementsChecked, setAgreementsChecked] = useState(false);
    const location = useLocation();
    const state = location.state as any;
    console.log("넘겨받은 state:", state);

    // 언어별 날짜 설정
    const formatDate = (dateStr: string, lang: string) => {
        const dateObj = new Date(dateStr);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();

        const mm = month < 10 ? `0${month}` : month;
        const dd = day < 10 ? `0${day}` : day;
        const yy = year % 100 < 10 ? `0${year % 100}` : year % 100;

        const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formats: Record<string, string> = {
            ko: `${mm}월 ${dd}일 ${yy}년`,
            en: `${monthNamesEn[month - 1]} ${dd}, ${year}`,
            ja: `${yy}年${mm}月${dd}日`,
            zh: `${yy}年${mm}月${dd}日`,
        };

        return formats[lang] || formats.ko;
    };
    
    const isFormValid =
        passengerName.trim() !== "" &&
        email.trim() !== "" &&
        isSameAccount;

    useEffect(() => {
        (async () => {
            const widget = await loadPaymentWidget(clientKey, customerKey);
            widget.renderPaymentMethods("#payment-widget", { value: 30000 });
            widget.renderAgreement("#agreement");
            setPaymentWidget(widget);
        })();
    }, []);

    const handlePayment = async () => {
        if (!paymentWidget) return;
        sessionStorage.setItem("passengerEmail", email);
        sessionStorage.setItem("passengerName", passengerName);

        try {
            await paymentWidget.requestPayment({
                orderId: "order_" + new Date().getTime(),
                orderName: t("paymentPage.foreignTourTaxi"),
                customerName: passengerName,
                customerEmail: email,
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",
            });
        } catch (err: any) {
            if (err.code === "AGREEMENT_REQUIRED") {
                alert(t("agreeTerms"));
            } else {
                console.error("결제 요청 실패:", err);
                alert(t("paymentFailed"));
            }
        }
    };

    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className={styles.container}>
            <TransparentHeader type="auth" />
            <hr style={{ margin: 0 }} />

            <div className={styles.paymentPage}>
                {/* 결제 비용 섹션 */}
                <section className={styles.section1}>
                    <div className={styles.pymentPage_taxi}>
                        <h2 className={styles.sectionTitle}>
                            {t("paymentCost")}
                            <span
                                className={styles.infoIconWrapper}
                                onMouseEnter={() => setShowTooltip(true)}   // 마우스 오버
                                onMouseLeave={() => setShowTooltip(false)}
                                onClick={() => setShowTooltip(prev => !prev)} // 모바일 터치
                            >
                                <span className={styles.infoIcon}>ⓘ</span>
                                {showTooltip && (
                                    <div className={styles.tooltip}
                                         style={{
                                             left: isEnglish ? "-174%" : undefined, // 영어일 때만 left 적용
                                         }}
                                    >
                                        <span className={styles.tooltipArrow}
                                              style={{ left: isEnglish ? "70%" : undefined }}></span>
                                        {t("foreignTourTaxiNotice")}
                                    </div>
                                )}
                            </span>


                        </h2>
                        <div className={styles.paymentBox}>
                            <div className={styles.paymentInfo}>
                                <div className={styles.productTitle}>
                                    {t("foreignTourTaxi")}
                                </div>
                                <div className={styles.productSub}>  {state?.date ? formatDate(state.date, i18n.language) : ""}  {state?.from} {state?.time} {state?.person} {t("departure")}</div>
                            </div>
                            <div className={styles.price}>{t("price")}</div>
                        </div>
                    </div>
                </section>

                <div className={styles.line}></div>

                {/* 탑승자 정보 섹션 */}
                <section className={styles.section2}>
                    <h2 className={styles.sectionTitle}>{t("passengerInfo")}</h2>
                    <div className={styles.inputbox_list}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                placeholder={t("name")}
                                value={passengerName}
                                onChange={(e) => setPassengerName(e.target.value)}
                                className={styles.inputbox}
                            />
                            <div className={styles.inputText}>{t("realNameInfo")}</div>
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                placeholder={t("email")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.inputbox}
                            />
                            <div className={styles.inputText}>{t("receiptEmailInfo")}</div>
                        </div>
                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="sameAccount"
                                className={styles.roundCheckbox}
                                checked={isSameAccount}
                                onChange={(e) => setIsSameAccount(e.target.checked)}
                            />
                            <div className={styles.checkboxText}>{t("sameAsAccount")}</div>
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
                    {t("payButton")}
                </Button>
            </div>
        </div>
    );
};

export default PaymentPage;
