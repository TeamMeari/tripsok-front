import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthStore {
    isLoggedIn: boolean;
    nickname: string;
    login: (accessToken: string, nickname: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    nickname: "",
    login: (accessToken, nickname) => {
        Cookies.set('access_token', accessToken);
        set({ isLoggedIn: true, nickname: nickname });
    },
    logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({ isLoggedIn: false, nickname: "" });
    },
}));

export default useAuthStore;