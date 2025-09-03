// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_PUBLIC_API_BASE_URL: string | undefined;
    readonly VITE_KAKAOMAP_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}