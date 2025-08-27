import Button from "./CommonBtn";

interface ValidationBtnProps {
    children: React.ReactNode;
    onClick: () => void;
    isDisabled: boolean;
}

const ValidationBtn = ({ children, onClick, isDisabled }: ValidationBtnProps) => {
    return <Button
        onClick={onClick}
        borderRadius="12px"
        size="large"
        style={{ backgroundColor: isDisabled ? "#666666" : "#FF6B2C", color: "#ffffff" }}
        disabled={isDisabled}
    >
        {children}
    </Button>
}

export default ValidationBtn;