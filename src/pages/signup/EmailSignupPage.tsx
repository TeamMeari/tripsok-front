import { ChevronRightIcon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import ValidationBtn from "../../components/common/Button/ValidationBtn";
import CheckBox from "../../components/common/CheckBox";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/feature/Input/PasswordInput";
import { useApi } from "../../hooks/useApi";
import { PASSWORD_VALIDATION_WARNING } from "../../types/signupErrors";
import { validatePassword } from "../../utils/validation";
import styles from "./SignupPage.module.css";
import { useSignupStore } from "../../stores/signupStores";
import { useNavigate } from "react-router-dom";

const EmailSignupPage = () => {
    const { t } = useTranslation();
    const { apiCall: nicknameValidateApiCall, isLoading: nicknameValidateIsLoading } = useApi();
    const { apiCall: submitApiCall, isLoading: submitIsLoading } = useApi();
    const navigate = useNavigate();
    const password = useSignupStore(state => state.password);
    const nicknameStore = useSignupStore(state => state.nickname);
    const firstName = useSignupStore(state => state.firstName);
    const lastName = useSignupStore(state => state.lastName);
    const termsChecked = useSignupStore(state => state.termsChecked);
    const privacyChecked = useSignupStore(state => state.privacyChecked);
    const {
        setPassword,
        setNickname: setNicknameStore,
        setFirstName, setLastName,
        emailVerifyToken, 
        reset,
        setTermsChecked, setPrivacyChecked
    } = useSignupStore();
    
    // 입력창 표시 여부
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(password !== "");
    const [nameVisible, setNameVisible] = useState(passwordConfirmVisible && (firstName !== "" || lastName !== ""));
    const [nicknameVisible, setNicknameVisible] = useState(nameVisible && (nicknameStore !== ""));
    const [termAndPrivacyVisible, setTermAndPrivacyVisible] = useState(nicknameVisible);

    // 비밀번호 및 확인
    const [passwordError, setPasswordError] = useState("");
    const [passwordErrorCondition, setPasswordErrorCondition] = useState<string[]>([]);
    const [passwordConfirm, setPasswordConfirm] = useState(password);
    const [passwordConfirmError, setPasswordConfirmError] = useState("");

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value.trim();
        setPassword(newPassword);
        const { error, conditions } = PASSWORD_VALIDATION_WARNING(newPassword);
        setPasswordError(error);
        setPasswordErrorCondition(conditions);
    }, []);

    const handlePasswordConfirmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newPasswordConfirm = e.target.value.trim();
        setPasswordConfirm(newPasswordConfirm);
        setPasswordConfirmError(newPasswordConfirm !== useSignupStore.getState().password ? t("passwordNotMatch") : "");
    }, []);

    // 이름 및 성
    const [nameError, setNameError] = useState("");

    const handleFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newFirstName = e.target.value.trim().slice(0, 20);
        setFirstName(newFirstName);
        if (newFirstName === "")setNameError(_ => "nameError");
        else if (useSignupStore.getState().lastName !== "") setNameError(_ => "");
    }, []);
    const handleLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newLastName = e.target.value.trim().slice(0, 20);
        setLastName(newLastName);
        if (newLastName === "")setNameError(_ => "nameError");
        else if (useSignupStore.getState().firstName !== "") setNameError(_ => "");
    }, []);

    // 닉네임   
    const NICKNAME_MAX_LENGTH = 15;
    const [nickname, setNickname] = useState(nicknameStore);
    const [nicknameError, setNicknameError] = useState("");

    const handleNicknameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value.slice(0, NICKNAME_MAX_LENGTH));
        if (nickname === "") setNicknameError(_ => "nicknameError");
        else if (useSignupStore.getState().firstName !== "" && useSignupStore.getState().lastName !== "") setNicknameError("");
    }, []);

    // 약관 및 개인정보 동의
    const handleTermsChecked = useCallback(() => setTermsChecked(!termsChecked), []);
    const handlePrivacyChecked = useCallback(() => setPrivacyChecked(!privacyChecked), []);

    const handleSubmit = useCallback(() => {
        submitApiCall("/auth/signup/email", "POST", { emailVerifyToken, nickname, password, firstName, lastName }).then(response => {
            if (response.status === 201) {
                reset();
                navigate("/signup/complete", { state: { nickname: nickname } });
            }
        });
    }, [nickname, navigate]);

    const passwordValid = validatePassword(password || "");
    const passwordConfirmValid = password !== "" && passwordValid && passwordConfirm !== "" && password === passwordConfirm;
    const nicknameValid = nickname.length > 0 && nickname.length <= NICKNAME_MAX_LENGTH;
    const validateInfo = passwordValid && passwordConfirmValid && nicknameValid && termsChecked && privacyChecked;

    // 연쇄적 표시 처리
    useEffect(() => {
        if (password !== "" && passwordError === "") setPasswordConfirmVisible(true);
    }, [password, passwordError])

    useEffect(() => {
        if (passwordConfirmVisible && passwordConfirm !== "" && passwordConfirmError === "") setNameVisible(true);
    }, [passwordConfirm, passwordConfirmError])

    useEffect(() => {
        if (nameVisible && firstName !== "" && lastName !== "") setNicknameVisible(true);
    }, [firstName, lastName])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (nickname.length > 0 && nickname.length <= NICKNAME_MAX_LENGTH) {
                nicknameValidateApiCall("/auth/validate/nickname", "POST", { nickname }).then(response => {
                    if (response.status === 200) {
                        if (response.data && typeof response.data === 'object' && 'available' in response.data && response.data.available === true) {
                            setNicknameError(_ => "");
                            setNicknameStore(nickname);
                            if (passwordError === "" && passwordConfirmError === "" && nameError === "") setTermAndPrivacyVisible(true);
                    } else {
                        setNicknameError(_ => 'existingNickname');
                    }
                    }
                });
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [nickname]);

    // redirect
    useEffect(() => {
        if (!emailVerifyToken) navigate("/signup/email/1");
    }, [emailVerifyToken, navigate]);

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <p className={styles.message}>
                    <Trans i18nKey="emailVerified" components={{ br: <br /> }} />
                </p>
                <div className={styles.content}>
                    <div className={styles.inputContainer}>
                        <PasswordInput onChange={handlePasswordChange} placeholder={t("enterPassword")} value={password} />
                        {password ?
                            (passwordError ?
                                <p className={styles.error}>
                                    <Trans i18nKey={passwordError} values={{ condition: passwordErrorCondition.map(condition => t(condition)).join(", ") }}/>
                                </p> :
                                <p className={styles.success}>{t("passwordValid")}</p>)
                            : <p className={styles.guide}>{t("passwordRule")}</p>
                        }
                    </div>

                    {passwordConfirmVisible && (
                        <div className={styles.inputContainer}>
                            <PasswordInput onChange={handlePasswordConfirmChange} placeholder={t("reEnterPassword")} value={passwordConfirm || ""} />
                            {passwordConfirmError ? <p className={styles.error}>{passwordConfirmError}</p>
                            : passwordConfirmValid ? <p className={styles.success}>{t("passwordMatch")}</p>
                            : null}
                        </div>
                    )}

                    {nameVisible && (
                        <div className={styles.inputContainer}>
                            <Input onChange={handleLastNameChange} placeholder={t("enterLastName")} value={lastName || ""} />
                            <Input onChange={handleFirstNameChange} placeholder={t("enterFirstName")} value={firstName || ""} />
                            {nameError ? <p className={styles.error}>{t(nameError)}</p> : <p className={styles.guide}>{t("useRealNameAsIdCard")}</p>}
                        </div>
                    )}

                    {nicknameVisible && (
                        <div className={styles.inputContainer}>
                            <Input
                                onChange={handleNicknameChange}
                                value={nickname || ""}
                                placeholder={t("nicknameRule")}
                                maxLength={NICKNAME_MAX_LENGTH}
                            />
                            {nicknameError && <p className={styles.error}>{t(nicknameError)}</p>}
                        </div>
                    )}

                    {termAndPrivacyVisible && (
                        <div className={styles.checkboxContainer}>
                            <div className={styles.checkboxItem}>
                                <CheckBox checked={termsChecked} disabled={false} onClick={handleTermsChecked} />
                                <button onClick={() => navigate("/signup/terms")} className={styles.documentButton}>
                                    <label>{t("termsRequired")}</label>
                                    <ChevronRightIcon color="#ABB0BA" size={16} />
                                </button>
                            </div>
                            <div className={styles.checkboxItem}>
                                <CheckBox checked={privacyChecked} disabled={false} onClick={handlePrivacyChecked} />
                                <button onClick={() => navigate("/signup/privacy")} className={styles.documentButton}>
                                    <label>{t("privacyRequired")}</label>
                                    <ChevronRightIcon color="#ABB0BA" size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonFixedTab}>
                        <ValidationBtn isDisabled={!validateInfo || nicknameValidateIsLoading || submitIsLoading} onClick={handleSubmit}>{t("signup")}</ValidationBtn>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailSignupPage;