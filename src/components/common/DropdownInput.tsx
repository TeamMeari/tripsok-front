import React, { useState, useRef, forwardRef, useEffect } from 'react';
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
                    readOnly
                    leftIcon={leftIcon}
                    style={{  cursor: 'pointer',
                        outline: 'none',
                        boxShadow: 'none',
                        caretColor: 'transparent',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',}}
                    onClick={() => setIsOpen(true)} // Input 클릭 시 열림
                    rightElement={
                        <button
                            type="button"
                            className={styles.arrowBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen); // 버튼 클릭으로 토글
                            }}
                        >
                            {isOpen ? '▲' : '▼'}
                        </button>
                    }
                />

                {isOpen && (
                    <div className={styles.dropdown} style={type === 'date' ? { maxHeight: 'none' } : {} }>
                        {type === 'date' ? (
                            <DatePicker
                                inline
                                selected={value ? new Date(value) : null}
                                onChange={(date) => {
                                    if (!date) return;
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    // const selectedDate = new Date(date);

                                    const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                                    selectedDate.setHours(0, 0, 0, 0);
                                    // 오늘 이후 날짜만 선택 가능
                                    if (selectedDate >= today) {
                                        onChange(
                                            `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
                                        );
                                        setIsOpen(false);
                                    }
                                }}
                                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
                                minDate={new Date()}
                                dayClassName={(date) => (date < new Date() ? styles.disabledDate : '')} // 회색 표시
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
