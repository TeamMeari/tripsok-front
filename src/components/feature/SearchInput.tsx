import { useCallback, useRef, useState } from 'react';
import Input from '../common/Input';
import styles from './SearchInput.module.css';
import CameraIcon from '../Icons/CameraIcon';
import SearchIcon from '../Icons/SearchIcon';
import { animate } from "@motionone/dom";

interface SearchInputProps {
    searchWord: string
}

const SearchInput = ({ searchWord }: SearchInputProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(searchWord);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }

    const toggleSearchImage = useCallback(() => {
        setIsOpen(prev => {
            const next = !prev;

            //애니메이션 추가
            if (buttonRef.current) {
                animate(buttonRef.current, { scale: [1, 1.2, 1] }, { duration: 0.3 });
            }

            return next;
        });
    }, []);

    const cameraButton = (
        <button
            className={styles.cameraButton}
            onClick={toggleSearchImage}
            ref={buttonRef}
        >
            <CameraIcon filled={isOpen} color={searchWord ? '#FF6B2C' : '#666666'}/>
        </button>
    )

    return <Input
        value={searchInput}
        leftIcon={<SearchIcon color={searchWord ? '#FF6B2C' : '#666666'}/>}
        placeholder="이미지를 이용해 더 편하게 검색"
        rightButton={cameraButton}
        onChange={handleChangeInput}
        style={searchWord ? {
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.32)',
            border: '2px solid #FF6B2C'
        } : {}}
    />
}

export default SearchInput;