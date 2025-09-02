import React from "react";
import IconButton from "../components/common/Button/IconBtn";

export default {
    title: "Components/IconButton",
    component: IconButton,
};

export const MultipleButtons = () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <IconButton type="search" />
        <IconButton type="arrow" />
        <IconButton type="arrow" color="gray"/>
        <IconButton type="globeIcon" />
        <IconButton type="globeIcon" color="gray" />

    </div>
);
