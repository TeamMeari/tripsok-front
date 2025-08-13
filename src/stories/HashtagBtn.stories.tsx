import React from "react";
import HashtagButton from "../components/common/HashtagBtn";

export default {
    title: "Components/HashtagButton",
    component: HashtagButton,
};

export const MultipleButtons = () => (
    <div style={{ display: "flex", gap: "8px" }}>
        <HashtagButton label="바다" />
        <HashtagButton label="산" />
        <HashtagButton label="관광지" />
    </div>
);

