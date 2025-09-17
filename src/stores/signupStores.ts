import { create } from "zustand";

interface SignupStore {
    email: string;
    password: string;
    emailVerifyToken: string;
    socialSignUpToken: string;
    firstName: string;
    lastName: string;
    nickname: string;
    termsChecked: boolean;
    privacyChecked: boolean;
    routing: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setEmailVerifyToken: (emailVerifyToken: string) => void;
    setSocialSignUpToken: (socialSignUpToken: string) => void;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setNickname: (nickname: string) => void;
    setTermsChecked: (termsChecked: boolean) => void;
    setPrivacyChecked: (privacyChecked: boolean) => void;
    setRoutingSignupComplete: () => void;
    reset: () => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
    email: "",
    password: "",
    emailVerifyToken: "",
    socialSignUpToken: "",
    firstName: "",
    lastName: "",
    nickname: "",
    termsChecked: false,
    privacyChecked: false,
    routing: "/",
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setEmailVerifyToken: (emailVerifyToken) => set({ emailVerifyToken }),
    setSocialSignUpToken: (socialSignUpToken) => set({ socialSignUpToken }),
    setFirstName: (firstName) => set({ firstName }),
    setLastName: (lastName) => set({ lastName }),
    setNickname: (nickname) => set({ nickname }),
    setTermsChecked: (termsChecked) => set({ termsChecked }),
    setPrivacyChecked: (privacyChecked) => set({ privacyChecked }),
    setRoutingSignupComplete: () => set({ routing: "/signup/complete" }),
    reset: () => set({ email: undefined, password: undefined, emailVerifyToken: undefined, socialSignUpToken: undefined, firstName: undefined, lastName: undefined, nickname: "", termsChecked: false, privacyChecked: false, routing: "/" }),
}));