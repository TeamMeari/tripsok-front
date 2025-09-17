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

export interface PlacesResponse {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    items: Place[];
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