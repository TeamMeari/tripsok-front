import { create } from "zustand";

interface PasswordResetStore {
    email: string;
    setEmail: (email: string) => void;
    emailVerifyToken: string;
    setEmailVerifyToken: (emailVerifyToken: string) => void;
    reset: () => void;
}

export const usePasswordResetStore = create<PasswordResetStore>((set) => ({
    email: "",
    setEmail: (email) => set({ email }),
    emailVerifyToken: "",
    setEmailVerifyToken: (emailVerifyToken) => set({ emailVerifyToken }),
    reset: () => set({ email: "", emailVerifyToken: "" }),
}));