import styles from './Input.module.css'

interface InputProps {
    type?: string;
    width?: number;
    value?: string;
    leftIcon?: React.ReactNode;
    rightButton?: React.ReactNode;
    placeholder?: string;
    onFocus?: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    style?: Record<string, string>
}

const Input = ({
    type="text",
    width = 312, 
    value,
    leftIcon,
    rightButton,
    placeholder = "",
    onFocus,
    onChange,
    onKeyDown,
    style
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
        />
        { rightButton }
    </div>
}

export default Input;