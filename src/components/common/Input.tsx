import styles from './Input.module.css'
import React, { forwardRef, useState } from 'react'

interface InputProps {
    type?: string;
    width?: number;
    value?: string;
    leftIcon?: React.ReactNode;
    rightElement?: React.ReactNode;
    placeholder?: string;
    onFocus?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    style?: Record<string, string>;
    maxLength?: number;
    readOnly?: boolean;
    onClick?: () => void;
    onFocusDisabled?: boolean;
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
    readOnly,
    style,
    maxLength,
    onFocusDisabled = false,
}, ref) => {
    const containerStyle = {
        width: `${width}px`,
        ...style
    }

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return <div 
        className={styles.inputContainer} 
        style={{
            ...containerStyle,
            borderColor: !onFocusDisabled && isFocused ? '#111111' : '#D9D9D9',
            ...style
        }}
    >
        { leftIcon }
        <input
            ref={ref}
            type={type}
            value={value}
            className={styles.input}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            readOnly={readOnly}
        />
        { rightElement }
    </div>
})

export default React.memo(Input);