export const convertTypeToLowerCase = (type: string) => {
    if (type === "RESTAURANT") return "restaurant";
    if (type === "ACCOMMODATION") return "accommodation";
    if (type === "TOUR") return "tour";
    if (type === "TOURIST_SPOT") return "tour";
    return type;
}