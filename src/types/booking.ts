export type BookingStatusType = "TRAVELING" | "COMPLETED" | "CANCELED" | "BEFORE_TRAVEL";

export interface Booking {
    bookingId: number;
    tripDate: string;
    startTime: string;
    numberOfPeople: number;
    status: BookingStatusType;
}