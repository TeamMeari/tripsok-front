import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import styles from './SearchInput.module.css';
import CameraIcon from '../Icons/CameraIcon';
import SearchIcon from '../Icons/SearchIcon';
import { Upload } from 'lucide-react';
import { animate } from "@motionone/dom";
import Button from '../common/Button/CommonBtn';

interface SearchInputProps {
    searchWord: string;
}

const SearchInput = ({ searchWord }: SearchInputProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchInput, setSearchInput] = useState(searchWord);
    const [preview, setPreview] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const imageSearchRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const search = () => {
        navigate('/search');
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }

    const handleChangeDrapAndDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            search();
        }
    }

    const toggleSearchImage = useCallback(() => {
        setIsOpen(prev => {
            const next = !prev;

            // 카메라 버튼 애니메이션
            if (buttonRef.current) {
                animate(buttonRef.current, { scale: [1, 1.2, 1] }, { duration: 0.3 });
            }

            // 닫힐 때는 isAnimating을 true로 설정
            if (!next) {
                setIsAnimating(true);
            }

            return next;
        });
    }, []);

    // isOpen 상태가 변경될 때 애니메이션 실행
    useEffect(() => {
        setTimeout(() => setPreview(null), 300);
        if (isOpen) {
            if (imageSearchRef.current) {
                animate(imageSearchRef.current, 
                    { transform: ['translateY(calc(100% - 2px))', 'translateY(calc(100% + 2px))'], opacity: [0, 1] }, 
                    { duration: 0.3, easing: "ease-out" }
                );
            }
        } else if (isAnimating) {
            // 닫힐 때: 애니메이션 후 제거
            setIsAnimating(true);
            if (imageSearchRef.current) {
                animate(imageSearchRef.current, 
                    { transform: ['translateY(calc(100% + 2px))', 'translateY(calc(100% - 2px))'], opacity: [1, 0] }, 
                    { duration: 0.3, easing: "ease-in" }
                );
            }
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [isOpen, isAnimating]);

    const cameraButton = (
        <button
            className={styles.cameraButton}
            onClick={toggleSearchImage}
            ref={buttonRef}
        >
            <CameraIcon filled={isOpen} color={searchWord ? '#FF6B2C' : '#666666'}/>
        </button>
    )

    return (
        <div className={styles.searchContainer}>
            <Input
                value={searchInput}
                leftIcon={<SearchIcon color={searchWord ? '#FF6B2C' : '#666666'}/>}
                placeholder="이미지를 이용해 더 편하게 검색"
                rightButton={cameraButton}
                onChange={handleChangeInput}
                onKeyDown={handleKeyDown}
                style={searchWord ? {
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.32)',
                    border: '2px solid #FF6B2C'
                } : {}}
            />
            {(isOpen || isAnimating) &&
                <div
                    ref={imageSearchRef}
                    className={styles.imageSearchContainer}
                    style={{
                        ...(searchWord ? {
                            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.32)',
                            border: '2px solid #FF6B2C'
                        } : {})
                    }}
                >
                    <h3>이미지로 검색하기</h3>
                    <p className={styles.imageSearchIntro}>사진의 문구를 인식해 검색해드려요!</p>
                    
                    {   
                        preview ?
                        <>
                            <img
                                className={styles.preview}
                                src={preview}
                                alt="미리보기"
                            />
                            <Button
                                size="small"
                                borderRadius="12px"
                                onClick={search}
                            >검색</Button>
                        </> :
                        <>
                            <button
                                className={styles.uploadButton}
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload width={32} height={32} color='#FF6B2C' />
                                <span
                                    className={styles.uploadButtonText}
                                >이미지 선택하기</span>
                            </button>
                        </>
                    }
                    <input ref={fileInputRef} type="file" onChange={handleChangeDrapAndDrop}/>
                </div>
            }
        </div>
    )
}

export default SearchInput;