import styles from './Dropdown.module.css'
import { useEffect, useState, useRef } from 'react'
import { sortKey, SortType } from '../../types/sortOptions';
import { useTranslation } from 'react-i18next';

interface DropdownProps {
    current: SortType;
    onClickOption: (option: SortType) => void;
}

const Dropdown = ({ current, onClickOption }: DropdownProps) => {
    const { t } = useTranslation();
    const [isHidden, setIsHidden] = useState(true);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleHidden = () => { setIsHidden(!isHidden) }

    const handleClickOption = (option: SortType) => {
        onClickOption(option)
        setIsHidden(true);
    }

    // 외부 클릭
    const handleClickOutside = (e: MouseEvent) => {
        // ref.current가 존재하고, 클릭된 곳이 ref 내부에 포함되지 않을 때
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
            setIsHidden(true); // 컴포넌트를 숨깁니다.
        }
    };

    useEffect(() => {
        // 컴포넌트가 마운트되면 이벤트 리스너를 추가합니다.
        document.addEventListener('mousedown', handleClickOutside);
        
        // 컴포넌트가 언마운트되면 이벤트 리스너를 제거합니다.
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    
    return <div className={styles.dropdown} ref={wrapperRef}>
        <button
            className={styles.dropdownButton}
            onClick={toggleHidden}
        >
            <p className={styles.value}>{t(`sort.${sortKey[current].value}`)}</p>
            <p className={styles.arrow}>{ isHidden ? "▼" : "▲"}</p>
        </button>
        {!isHidden && <div
            className={styles.dropdownOptionContainer}
            aria-hidden={isHidden}
        >
            {Object.keys(sortKey).map((key) => <button
                    key={key}
                    className={`${styles.dropdownOption} ${current === key ? styles.selected : ""}`}
                    onClick={() => handleClickOption(key as SortType)}
                >
                    {t(`sort.${sortKey[key as SortType].value}`)}
                </button>
            )}
        </div>}
    </div>
}

export default Dropdown