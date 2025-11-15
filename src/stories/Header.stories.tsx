import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../components/header/Header";
import TransparentHeader from "../components/header/TransparentHeader";

const meta: Meta<typeof Header> = {
    title: "Layout/Header",
    component: Header,
};


export default meta;
type Story = StoryObj<typeof Header>;

const Screen = ({ children }: { children: JSX.Element }) => 
    <div style={{
        width: "360px",
        height: "800px",
        backgroundColor: "black",
        position: "relative"
    }}>
        { children }
    </div>

export const WhiteRefactored: Story = {
    render: () => (
        <BrowserRouter>
        <div style={{
            display: "flex",
            gap: "3px"
        }}>
            <Screen>
                <Header backgroundType={"white"} isAuth isLogo />
            </Screen>
            <Screen>
                <Header backgroundType={"white"} isAuth />
            </Screen>
            <Screen>
                <Header backgroundType={"white"} />
            </Screen>
        </div>
        </BrowserRouter>
    )
}

export const BackgroundImageRefactored: Story = {
    render: () => (
        <BrowserRouter>
        <div style={{
            display: "flex",
            gap: "3px"
        }}>
            <Screen>
                <Header backgroundType={"image"} isAuth isLogo />
            </Screen>
            <Screen>
                <Header backgroundType={"image"} isAuth />
            </Screen>
            <Screen>
                <Header backgroundType={"image"} />
            </Screen>
        </div>
        </BrowserRouter>
    )
}

export const TransparentRefactored: Story = {
    render: () => (
        <BrowserRouter>
        <div style={{
            display: "flex",
            gap: "3px",
        }}>
            <Screen>
                <Header backgroundType={"transparent"} isAuth isLogo />
            </Screen>
            <Screen>
                <Header backgroundType={"transparent"} isAuth />
            </Screen>
            <Screen>
                <Header backgroundType={"transparent"} />
            </Screen>
        </div>
        </BrowserRouter>
    )
}

// export const Default: Story = {
//     render: () => (
//         <BrowserRouter>
//             <div style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "24px",
//             }}>

//                 {/* 배경 없는 Header */}
//                 <Header />

//                 {/* 배경 있는 Header */}
//                 <Header useBackground={true} />

//                 {/* 투명 Header  */}
//                 <TransparentHeader />

//                 <TransparentHeader type="auth" />
//             </div>
//         </BrowserRouter>
//     ),
// };

// export const NoLogo: Story = {
//     render: () => (
//         <BrowserRouter>
//             <Header isLogo={false} />
//         </BrowserRouter>
//     ),
// };
