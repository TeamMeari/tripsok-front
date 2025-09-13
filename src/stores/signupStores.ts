import { create } from "zustand";

interface SignupStore {
    email?: string;
    password?: string;
    emailVerifyToken?: string;
    socialSignUpToken?: string;
    nickname: string;
    termsChecked: boolean;
    privacyChecked: boolean;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setEmailVerifyToken: (emailVerifyToken: string) => void;
    setSocialSignUpToken: (socialSignUpToken: string) => void;
    setNickname: (nickname: string) => void;
    setTermsChecked: (termsChecked: boolean) => void;
    setPrivacyChecked: (privacyChecked: boolean) => void;
    reset: () => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
    email: undefined,
    password: undefined,
    emailVerifyToken: undefined,
    socialSignUpToken: undefined,
    nickname: "",
    termsChecked: false,
    privacyChecked: false,
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setEmailVerifyToken: (emailVerifyToken) => set({ emailVerifyToken }),
    setSocialSignUpToken: (socialSignUpToken) => set({ socialSignUpToken }),
    setNickname: (nickname) => set({ nickname }),
    setTermsChecked: (termsChecked) => set({ termsChecked }),
    setPrivacyChecked: (privacyChecked) => set({ privacyChecked }),
    reset: () => set({ email: undefined, password: undefined, emailVerifyToken: undefined, socialSignUpToken: undefined, nickname: "", termsChecked: false, privacyChecked: false }),
}));