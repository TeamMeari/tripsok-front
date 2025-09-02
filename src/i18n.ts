// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    ko: {
        translation: {
            greeting: "안녕하세요, {{name}}님!",
            login: "로그인",
            logout: "로그아웃",
            placePointTitle: "이 장소의 매력 포인트",
            cardSectionTitle: "과 함께 찾아본 장소",
            addToJourney: "내 여정에 추가",
        },
    },
    en: {
        translation: {
            greeting: "Hello, {{name}}!",
            login: "Login",
            logout: "Logout",
            placePointTitle: "Highlights of this place",
            cardSectionTitle: "Places explored together",
            addToJourney: "Add to my journey",
        },
    },
    ja: {
        translation: {
            greeting: "こんにちは、{{name}}さん！",
            login: "ログイン",
            logout: "ログアウト",
            placePointTitle: "この場所の魅力ポイント",
            cardSectionTitle: "一緒に訪れた場所",
            addToJourney: "私の旅に追加",
        },
    },
};

i18n
    .use(LanguageDetector) // 브라우저 언어 자동 감지
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "ko",
        interpolation: { escapeValue: false },
    });

export default i18n;
