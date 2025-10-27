import { PlaceType } from "../types/menuTabs";

export const convertTypeToLowerCase = (type: string): PlaceType => {
    if (type === "RESTAURANT") return "restaurant";
    if (type === "ACCOMMODATION") return "accommodation";
    if (type === "TOUR") return "tour";
    return "tour";
}

export function getEnMonthName(month: number): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2000, month - 1, 1));
}