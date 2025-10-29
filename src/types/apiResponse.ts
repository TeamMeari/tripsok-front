import { Tag } from "./Tag";

export type OAuthLoginResponse = OAuthLogin200Response | OAuthLogin303Response;

interface OAuthLogin200Response {
    accessToken: string;
    nickname: string;
}

interface OAuthLogin303Response {
    accessToken: string;
}

export interface LoginResponse {
    accessToken: string;
    nickname: string;
}

export interface OAuthSignupResponse {
    accessToken: string;
    nickname: string;
}

export interface PlaceListResponse {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    items: PlaceListItem[];
}

export interface Place {
    id: number;
    language: string;
    name: string;
    address: string;
    summary: string;
    information: string;
    type: "RESTAURANT" | "ACCOMMODATION" | "TOUR";
    lat: number;
    lng: number;
    likeCount: number;
    viewCount: number;
    reviewCount: number;
    thumbnailUrl: string;
    imageCount: number;
    updatedAt: Date;
    themes: Tag[];
}

export interface PlaceListItem {
    id: number;
    language: string;
    name: string;
    summary: string;
    type: "RESTAURANT" | "ACCOMMODATION" | "TOUR" | "TOURIST_SPOT";
    lat: number;
    lng: number;
    thumbnailUrl: string;
    updatedAt: Date;
}