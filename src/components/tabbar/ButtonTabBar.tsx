import TabBar from "./TabBar"

interface IconButtonTabBarProps {
    type?: "shadowed" | "inTheAir"
    IconButton?: React.ReactNode
    Button: React.ReactNode
}

const IconButtonTabBar = ({ type = "shadowed", IconButton, Button }: IconButtonTabBarProps) => {
    return (
        <TabBar
            type={type}
            style={{
                gap: '16px',
                padding: IconButton? "15px" : "24px"
            }}
        >
            {IconButton}
            {Button}
        </TabBar>
    )
}

export default IconButtonTabBar;