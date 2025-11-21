import React from "react";
import IconButton from "../components/common/Button/IconBtn";
import { ArrowLeft, Search } from "lucide-react";
import LanguageIcon from "../components/header/LanguageButton";

export default {
    title: "Button/IconButton",
    component: IconButton,
};

export const MultipleButtons = () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "16px", background: "black"}}>
            <IconButton Icon={Search} />
            <IconButton Icon={ArrowLeft} />
        </div>
        
        <IconButton Icon={ArrowLeft} color="gray"/>
        <LanguageIcon />
        <LanguageIcon color="gray" />
    </div>
);
