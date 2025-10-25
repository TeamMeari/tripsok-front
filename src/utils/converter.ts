export const convertTypeToLowerCase = (type: string) => {
    if (type === "RESTAURANT") return "restaurant";
    if (type === "ACCOMMODATION") return "accommodation";
    if (type === "TOUR") return "tour";
    if (type === "TOURIST_SPOT") return "tour";
    return type;
}

export function getEnMonthName(month: number): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2000, month - 1, 1));
}