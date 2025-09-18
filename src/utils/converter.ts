export const convertTypeToLowerCase = (type: string) => {
    if (type === "RESTAURANT") return "restaurant";
    if (type === "ACCOMMODATION") return "accommodation";
    if (type === "TOUR") return "tour";
    return type;
}