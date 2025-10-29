// Button.tsx
import React from 'react';
import styles from './CommonBtn.module.css';

type ButtonVariant = 'primary' |'grayPrimary'| 'secondary' | 'orangeOutline' | 'grayDashed' | 'blackOutline';
type PrimaryButtonSize = 'small' | 'large' | 'mini'; // primary 전용 width 옵션

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: PrimaryButtonSize;       // primary 버튼만 사용
    borderRadius?: string;
    children: React.ReactNode;
    onClick?: () => void
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                           variant = 'primary',
                                           size = 'small',
                                           borderRadius = '12px',
                                           children,
                                           style,
                                           onClick,
                                           isLoading,
                                           ...props
                                       }) => {
    const width =
        variant === 'primary' || variant === 'grayPrimary' || variant === 'orangeOutline' || variant === 'grayDashed' || variant == 'blackOutline' ? (size === 'mini'
            ? '140px'   // mini 버튼 길이
            : size === 'small'
                ? '280px'
                : '312px') : undefined;

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
