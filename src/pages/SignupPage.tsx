import styles from "./SignupPage.module.css";
import { useState, useCallback } from "react";
import StepOne from "../components/feature/Signup/StepOne";
import StepThree from "../components/feature/Signup/StepThree";
import StepTwo from "../components/feature/Signup/StepTwo";
import Complete from "../components/feature/Signup/Complete";
import Document from "../components/feature/Signup/Document";

const SignupPage = () => {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [emailVerifyToken, setEmailVerifyToken] = useState("");
    const [nickname, setNickname] = useState("");

    const onSubmitEmail = useCallback((email: string) => {
        setEmail(email);
        setStep(prev => prev + 1);
    }, []);

    const onSubmitCode = useCallback((token: string) => {
        setEmailVerifyToken(token); // 실제로 api로 받은 token 삽입
        setStep(prev => prev + 1);
    }, [])

    const onSubmitInfo = useCallback((nickname: string) => {
        setNickname(nickname);
        setStep(prev => prev + 1);
    }, [])

    const goStepThree = useCallback(() => {
        setStep(_ => 3);
    }, [])

    const goStepFour = useCallback(() => {
        setStep(_ => 4);
    }, [])

    const goStepFive = useCallback(() => {
        setStep(_ => 5);
    }, [])

    return <div className={styles.page}>
        {step === 1 && <StepOne onSubmit={onSubmitEmail} />}
        {step === 2 && <StepTwo onSubmit={onSubmitCode} email={email} />}
        {step === 3 && <StepThree onSubmit={onSubmitInfo} emailVerifyToken={emailVerifyToken} goStepFour={goStepFour} goStepFive={goStepFive}/>}
        {step === 4 && <Document goPreviousStep={goStepThree} />}
        {step === 5 && <Document goPreviousStep={goStepThree} />}
        {step === 6 && <Complete nickname={nickname} />}
    </div>;
};

export default SignupPage;