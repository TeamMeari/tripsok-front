import { useRef, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../components/common/Input";
import { useApi } from "../../hooks/useApi";
import { EXPIRED_CODE, INVALID_CODE } from "../../types/signupErrors";
import styles from "./SignupPage.module.css";
import { useSignupStore } from "../../stores/signupStores";
import { useNavigate } from "react-router-dom";

const CodePage = () => {
    const { t } = useTranslation();
    const { apiCall, isLoading } = useApi();
    const { email, setEmailVerifyToken } = useSignupStore();
    const codeValidTime = 180000;
    const codeLength = 6;
    const time = useRef<number>(codeValidTime);
    const [min, setMin] = useState(Math.floor(codeValidTime / 60000));
    const [sec, setSec] = useState(0);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const navigate = useNavigate();

    const startTimer = () => {
        // 코드 전송 로직
        time.current = codeValidTime;
        const interval = setInterval(() => {
            time.current -= 1000;
            setMin(Math.floor(time.current / 60000));
            setSec(Math.floor((time.current % 60000) / 1000));
            if (time.current <= 0) {
                clearInterval(interval);
                setCodeError(EXPIRED_CODE);
            }
        }, 1000);
        setCodeError("");
    }

    // 이메일 코드 보내기
    const handleSendCode = useCallback(() => {
        if (!email) return;
        apiCall("/auth/email/send", "POST", { email }).then(response => {
            if (response.status === 204) {
                startTimer();
            }
        });
    }, [email, navigate]);

    const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, codeLength));
    }, []);

    const handleCodeVerification = useCallback(() => {
        // 인증 코드 검증 로직
        if (code.length !== codeLength) return;
        apiCall("/auth/email/verify", "POST", { email, code }).then(response => {
            if (response.status === 200 &&
                response.data &&
                typeof response.data === 'object' &&
                'emailVerifyToken' in response.data) {
                setEmailVerifyToken(response.data.emailVerifyToken as string);
                navigate("/signup/email/3");
            } else {
                setCodeError(INVALID_CODE);
            }
        });
    }, [code, setEmailVerifyToken, navigate]);

    const CodeTimer = () => {
        if (min === 0 && sec === 0) {
            return <p className={styles.timer}>00:00</p>;
        }
        return <p className={styles.timer}>{min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}</p>;
    }

    const resendCode = useCallback(() => {
        handleSendCode();
        startTimer();
    }, [email, navigate]);

    // redirect
    useEffect(() => {
        if (!email) navigate("/signup/email/1");
        startTimer();
    }, []);

    useEffect(() => {
        if (code !== "") {
            handleCodeVerification();
        }
    }, [code, handleCodeVerification]);

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <p className={styles.message} dangerouslySetInnerHTML={{ __html: t("enterVerificationCode", { email }) }} />
                <div className={styles.content}>
                    <div className={styles.inputContainer}>
                        <Input onChange={handleCodeChange} rightElement={<CodeTimer />} value={code} maxLength={codeLength} />
                        {codeError ? (
                            <div className={styles.errorContainer}>
                                <p className={styles.error}>{t(codeError)}</p>
                                {codeError === EXPIRED_CODE && (
                                    <button className={styles.resendButton} onClick={resendCode}>{t("resend")}</button>
                                )}
                            </div>
                        ) : (
                            <div className={styles.errorContainer}>
                                <p className={styles.checkSend}>{t("noEmail")}</p>
                                <button className={styles.resendButton} onClick={resendCode}>{t("resend")}</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodePage;