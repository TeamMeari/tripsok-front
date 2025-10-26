export type ReservationStateType = "TRAVELING" | "COMPLETED" | "CANCELED" | "BEFORE_TRAVEL";

export interface Reservation {
    year: number;
    month: number;
    day: number;
    departure: string;
    time: string;
    party: number;
    state: ReservationStateType;
}