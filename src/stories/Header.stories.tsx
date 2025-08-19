import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../components/header/Header";

const meta: Meta<typeof Header> = {
    title: "Layout/Header",
    component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
    render: () => (
        <BrowserRouter>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* 배경 없는 Header */}
                <Header />

                {/* 배경 있는 Header */}
                <Header useBackground={true} />
            </div>
        </BrowserRouter>
    ),
};
