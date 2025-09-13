import React from "react";
import MenuApp from "../components/MenuApp";
import { BrowserRouter } from "react-router-dom";

export default {
    title: "Components/MenuApp",
    component: MenuApp,
};

export const DefaultMenu = () => <BrowserRouter><MenuApp /></BrowserRouter>;
