import styles from "../../../pages/SignupPage.module.css"
import Input from "../../common/Input";
import { useRef, useState, useCallback, useEffect } from "react";
import { EXPIRED_CODE, INVALID_CODE } from "../../../types/signupErrors";

interface StepTwoProps {
    email: string;
    onSubmit: (token: string) => void;
}

const StepTwo = ({ email, onSubmit }: StepTwoProps) => {
    const codeValidTime = 180000;
    const codeLength = 6;
    const time = useRef<number>(codeValidTime);
    const [min, setMin] = useState(Math.floor(codeValidTime / 60000));
    const [sec, setSec] = useState(0);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");

    const sendCode = () => {
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
    
    const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, codeLength));
    }, []);

    const handleCodeVerification = useCallback(() => {
        // 인증 코드 검증 로직
        if (code === "123456") {
            onSubmit("token")
        } else if (code.length === codeLength && code !== "123456") {
            setCodeError(INVALID_CODE);
        }
    }, [code]);

    const CodeTimer = () => {
        if (min === 0 && sec === 0) {
            return <p className={styles.timer}>00:00</p>
        }
        return <p className={styles.timer}>{min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}</p>
    }

    useEffect(() => {
        sendCode();
    }, []);

    useEffect(() => {
        if (code !== "") {
            handleCodeVerification();
        }
    }, [code]);
    
    return <div className={styles.step}>
        <p className={styles.message}>{email}<br />으로 보낸 인증코드를 입력해주세요</p>
        <div className={styles.content}>
            <div className={styles.inputContainer}>
                <Input onChange={handleCodeChange} rightElement={<CodeTimer />} value={code} maxLength={codeLength}/>
                {codeError ?
                <div className={styles.errorContainer}>
                    <p className={styles.error}>{codeError}</p>
                    {
                        codeError === EXPIRED_CODE
                        && <button className={styles.resendButton} onClick={sendCode}>재전송</button>
                    }
                </div> : <div className={styles.errorContainer}>
                    <p className={styles.checkSend}>인증 코드가 오지 않았나요?</p>
                    <button className={styles.resendButton} onClick={sendCode}>재전송</button>
                </div>}
            </div>  
        </div>
    </div>
};

export default StepTwo;