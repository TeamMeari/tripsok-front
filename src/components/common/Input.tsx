import styles from './Input.module.css'
import React, { forwardRef } from 'react'

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
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    type="text",
    width = 312, 
    value,
    leftIcon,
    rightElement,
    placeholder = "",
    onFocus,
    onChange,
    onKeyDown,
    style
}, ref) => {
    const containerStyle = {
        width: `${width}px`,
        ...style
    }

    return <div className={styles.inputContainer} style={containerStyle}>
        { leftIcon }
        <input
            ref={ref}
            type={type}
            value={value}
            className={styles.input}
            placeholder={placeholder}
            onFocus={onFocus}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
        { rightElement }
    </div>
})

export default React.memo(Input);