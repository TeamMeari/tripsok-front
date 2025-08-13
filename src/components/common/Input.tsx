import styles from './Input.module.css'

interface InputProps {
    width?: number;
    value: string;
    leftIcon?: React.ReactNode;
    rightButton?: React.ReactNode;
    placeholder?: string;
    onFocus?: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: Record<string, string>
}

const Input = ({
    width = 312, 
    value,
    leftIcon,
    rightButton,
    placeholder = "",
    onFocus,
    onChange,
    style
}: InputProps) => {
    const containerStyle = {
        width: `${width}px`,
        ...style
    }

    return <div className={styles.inputContainer} style={containerStyle}>
        { leftIcon }
        <input
            type="text"
            value={value}
            className={styles.input}
            placeholder={placeholder}
            onFocus={onFocus}
            onChange={onChange}
        />
        { rightButton }
    </div>
}

export default Input;