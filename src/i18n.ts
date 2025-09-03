// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    ko: {
        translation: {
            // 로그인 관련 텍스트
            greeting: "Hi, {{name}}",
            login: "로그인",
            logout: "로그아웃",
            //ContentPage 텍스트
            placePointTitle: "이 장소의 매력 포인트",
            cardSectionTitle: "과 함께 찾아본 장소",
            addToJourney: "내 여정에 추가",
            // MenuTab 텍스트
            tabTour: "관광지",
            tabFood: "식사",
            tabStay: "숙소",
            //list page 텍스트
            sortPopular: "인기순",
            sortNewest: "최신순",
            sortOldest: "오래된 순",
            totalSearch: "총 {{count}}개 검색",
        },
    },
    en: {
        translation: {
            // 로그인 관련 텍스트
            greeting: "Hi, {{name}}",
            login: "Login",
            logout: "Logout",
            //ContentPage 텍스트
            placePointTitle: "Highlights of this place",
            cardSectionTitle: "Places explored together",
            addToJourney: "Add to my journey",
            // MenuTab 텍스트
            tabTour: "Tourist Spot",
            tabFood: "Food",
            tabStay: "Aaccomm",
            //list page 텍스트
            sortPopular: "Popular",
            sortNewest: "Newest",
            sortOldest: "Oldest",
            totalSearch: "Total {{count}} results",
        },
    },
    ja: {
        translation: {
            // 로그인 관련 텍스트
            greeting: "Hi,{{name}}",
            login: "ログイン",
            logout: "ログアウト",
            //ContentPage 텍스트
            placePointTitle: "この場所の魅力ポイント",
            cardSectionTitle: "一緒に訪れた場所",
            addToJourney: "私の旅に追加",
            // MenuTab 텍스트
            tabTour: "観光地",
            tabFood: "食事",
            tabStay: "宿泊",
            //list page 텍스트
            sortPopular: "人気順",
            sortNewest: "最新順",
            sortOldest: "古い順",
            totalSearch: "合計 {{count}} 件の検索結果",
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
