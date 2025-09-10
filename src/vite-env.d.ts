// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_PUBLIC_API_BASE_URL: string | undefined;
    readonly VITE_KAKAOMAP_KEY: string;
    readonly VITE_PUBLIC_GOOGLE_CLIENT_ID: string;
    readonly VITE_PUBLIC_GOOGLE_REDIRECT_URI: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}