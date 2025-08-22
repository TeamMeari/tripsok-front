import MenuTab from '../components/feature/Tab/ListMenuTab';
import styles from './ListPage.module.css';
import { Tag } from '../types/Tag';
import { useEffect, useRef, useState } from 'react';
import HashtagButton from '../components/common/HashtagBtn';
import Dropdown from '../components/common/Dropdown';
import CardType from '../types/Card';
import Card from '../components/common/Card';

const ListPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Set<number>>(new Set());
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [cards, setCards] = useState<CardType[]>([]);
  const tagContainerRef = useRef<HTMLDivElement>(null);
  
  const options = {
    1: '인기순',
    2: '최신순',
    3: '오래된 순',
  };

  const handleTagClick = (tagId: number) => {
    if (selectedTag.has(tagId)) {
      setSelectedTag((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tagId);
        return newSet;
      });
    } else {
      setSelectedTag((prev) => {
        const newSet = new Set(prev);
        newSet.add(tagId);
        return newSet;
      });
    };
  }

  const handleOptionClick = (option: number) => {
    setSelectedOption(option);
  }

  // 태그 예시 데이터
  useEffect(() => {
    setTags([
      { id: 1, name: '바다' },
      { id: 2, name: 'K-POP' },
      { id: 3, name: '자연' },
      { id: 4, name: '체험' },
      { id: 5, name: '미술관' },
    ]);
    setCards(Array(20).fill(0).map((_, index) => ({
      id: index,
      title: `카드 ${index}`,
      description: `카드 ${index} 설명`,
      image: 'data:image/png;base64,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',
    })));
  }, []);

  
  // wheel로 넘길수 있도록 설정
  useEffect(() => {
    const el = tagContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft -= e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className={styles.listPage}>
      <MenuTab />
      <div className={styles.tagContainer} ref={tagContainerRef}>
        {tags.map((tag) => (
          <HashtagButton key={tag.id} label={tag.name} onClick={() => {
            handleTagClick(tag.id);
          }} />
        ))}
      </div>
      <div className={styles.listContainer}>
        <div className={styles.info}>
          <div className={styles.listCount}>
            총 <span>245개</span> 검색
          </div>
          <Dropdown current={selectedOption} options={options} onClickOption={handleOptionClick} />
        </div>
        <div className={styles.list}>
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
        <div>다음 페이지 로드</div>
      </div>
    </div>
  );
}

export default ListPage;