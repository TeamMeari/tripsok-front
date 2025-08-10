import styles from './Input.module.css'
import { useState } from 'react';

interface InputProps {
    width?: number;
    value?: string;
    leftIcon?: React.ElementType;
    rightIcon?: React.ElementType;
    placeholder?: string;
    shadow: boolean;
    onFocus: () => void;
}

const Input = ({
    width = 312, 
    value,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    placeholder = "",
    shadow = false,
    onFocus
}: InputProps) => {
    return <div className={`${styles.inputContainer} ${shadow ? styles.shadow : ""}`} style={{ width: `${width}px`}}>
        { LeftIcon && <LeftIcon /> }
        <input
            type="text"
            value={value}
            className={styles.input}
            placeholder={placeholder}
            onFocus={onFocus}
        />
        { RightIcon && <RightIcon />}
    </div>
}

export default Input;