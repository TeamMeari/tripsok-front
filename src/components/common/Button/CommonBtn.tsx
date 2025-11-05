// Button.tsx
import React from 'react';
import styles from './CommonBtn.module.css';

type ButtonVariant = 'primary' |'grayPrimary'| 'secondary' | 'orangeOutline' | 'grayDashed' | 'blackOutline';
type PrimaryButtonSize = 'small' | 'large' | 'mini'; // primary 전용 width 옵션
type ButtonRadius = 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: PrimaryButtonSize;       // primary 버튼만 사용
    radius?: ButtonRadius;
    children: React.ReactNode;
    onClick?: () => void
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
        variant = 'primary',
        size,
        radius = 'medium',
        children,
        style,
        onClick,
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
                className={`${styles.button} ${styles[variant]}`}
                style={{width, borderRadius, ...style}}
                {...props}
                disabled={isLoading}
            >
                {children}
            </button>
        </div>
    );
};

export default Button;
