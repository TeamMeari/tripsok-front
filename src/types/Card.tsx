export default interface Card {
    id: number;
    rank?: number;
    type: "restaurant" | "tour" | "accommodation";
    title: string;
    description: string;
    image: string;
}