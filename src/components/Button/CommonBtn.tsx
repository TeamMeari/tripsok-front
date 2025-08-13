// Button.tsx
import React from 'react';
import styles from './CommonBtn.module.css';

type ButtonVariant = 'primary' | 'secondary';
type PrimaryButtonSize = 'small' | 'large'; // primary 전용 width 옵션

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: PrimaryButtonSize;       // primary 버튼만 사용
    borderRadius?: string;
    children: React.ReactNode;
    onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
                                           variant = 'primary',
                                           size = 'small',
                                           borderRadius,
                                           children,
                                           style,
                                           onClick,
                                           ...props
                                       }) => {
    const width =
        variant === 'primary' ? (size === 'small' ? '280px' : '312px') : undefined;

    return (
        <div className={styles.commonBtn} onClick={onClick}>
            <button
                className={`${styles.button} ${styles[variant]}`}
                style={{width, borderRadius, ...style}}
                {...props}
            >
                {children}
            </button>
        </div>
    );
};

export default Button;
