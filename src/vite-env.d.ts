// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_KAKAOMAP_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}