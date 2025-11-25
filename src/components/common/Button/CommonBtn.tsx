// Button.tsx
import React from 'react';
import styles from './CommonBtn.module.css';

type ButtonVariant = 'primary' |'grayPrimary'| 'secondary' | 'orangeOutline' | 'grayDashed' | 'blackOutline' | 'disabled';
type PrimaryButtonSize = 'small' | 'large' | 'mini'; // primary 전용 width 옵션
type ButtonRadius = 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: PrimaryButtonSize;       // primary 버튼만 사용
    radius?: ButtonRadius;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
        variant = 'primary',
        size,
        radius = 'medium',
        children,
        style,
        onClick,
        disabled = false,
        isLoading,
        ...props
    }) => {
    // button size에 따른 width 값
    const width = 
        size === 'mini' ? '140px'
        : size === 'small' ? '280px'
        : size === 'large' ? '312px'
        : undefined;

    const borderRadius = 
        radius === "medium" ? '12px' 
        : radius === "large" ? '48px'
        : undefined;

    return (
        <div className={styles.commonBtn} onClick={onClick}>
            <button
                className={`${styles.button} ${styles[disabled ? 'disabled' : variant]}`}
                style={{width, borderRadius, ...style}}
                {...props}
                disabled={disabled || isLoading}
            >
                {children}
            </button>
        </div>
    );
};

export default Button;
