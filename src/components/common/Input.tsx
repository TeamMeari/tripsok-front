import styles from './Input.module.css'
import React from 'react'

interface InputProps {
    type?: string;
    width?: number;
    value?: string;
    leftIcon?: React.ReactNode;
    rightElement?: React.ReactNode;
    placeholder?: string;
    onFocus?: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    style?: Record<string, string>;
    autoFocus?: boolean;
}

const Input = ({
    type="text",
    width = 312, 
    value,
    leftIcon,
    rightElement,
    placeholder = "",
    onFocus,
    onChange,
    onKeyDown,
    style,
    autoFocus
}: InputProps) => {
    const containerStyle = {
        width: `${width}px`,
        ...style
    }

    return <div className={styles.inputContainer} style={containerStyle}>
        { leftIcon }
        <input
            type={type}
            value={value}
            className={styles.input}
            placeholder={placeholder}
            onFocus={onFocus}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
        />
        { rightElement }
    </div>
}

export default React.memo(Input);