import React, { useState, useRef, forwardRef } from 'react';
import Input from './Input';
import styles from './DropdownInput.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatepikerCustom.css'

interface DropdownInputProps {
    value: string;
    options?: string[];
    onChange: (value: string) => void;
    placeholder?: string;
    width?: number;
    leftIcon?: React.ReactNode;
    type?: 'default' | 'date';
}

const DropdownInput = forwardRef<HTMLInputElement, DropdownInputProps>(
    ({ value, options = [], onChange, placeholder, width = 312, leftIcon, type = 'default' }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const wrapperRef = useRef<HTMLDivElement>(null);

        const toggleDropdown = () => setIsOpen(!isOpen);

        const handleSelect = (option: string) => {
            onChange(option);
            setIsOpen(false);
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        React.
            useEffect(() => {
                const handleClickOutside = (e: MouseEvent) => {
                    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                        setIsOpen(false);
                    }
                };
                document.addEventListener('mousedown', handleClickOutside);
                return () => {
                    document.removeEventListener('mousedown', handleClickOutside);
                };
            }, []);
        return (
            <div className={styles.wrapper} ref={wrapperRef} style={{ width }}>
                <Input
                    ref={ref}
                    value={value}
                    placeholder={placeholder}
                    width={width}
                    leftIcon={leftIcon}
                    onChange={(e) => onChange(e.target.value)}
                    rightElement={
                        <button type="button" className={styles.arrowBtn} onClick={toggleDropdown}>
                            {isOpen ? '▲' : '▼'}
                        </button>
                    }
                />
                {isOpen && (
                    <div className={styles.dropdown}>
                        {type === 'date' ? (
                            <DatePicker
                                inline
                                selected={value ? new Date(value) : null}
                                onChange={(date) =>{
                                    onChange(date ? date.toISOString().split('T')[0] : '')
                                    setIsOpen(false);
                                }}
                                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}

                            />
                        ) : (
                            options.map((option, idx) => (
                                <button
                                    key={idx}
                                    className={styles.option}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    }
);


DropdownInput.displayName = 'DropdownInput';

export default React.memo(DropdownInput);
