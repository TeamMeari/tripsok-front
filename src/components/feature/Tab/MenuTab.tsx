import React, { useEffect, useRef, useState } from 'react';
import styles from './MenuTab.module.css';
import { animate, timeline } from '@motionone/dom';

interface MenuTabProps {
  isIcon? : boolean;
}

const MenuTab = ({ isIcon }: MenuTabProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

  const tabs = ['관광지', '식사', '숙소'];
  const icons = ['typeIcon/spot.png', 'typeIcon/restaurant.png', 'typeIcon/accommodation.png'];
  const tabWidth = 64;
  const tabGap = 24;

  const handleTabClick = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (lineRef.current) {
        animate(lineRef.current, {
            x: `${(index - 1) * (tabWidth + tabGap)}px`,
        }, {
            duration: 0.3,
            easing: 'ease-in-out',
        }).finished.then(() => {
            setIsAnimating(false);
            setActiveTab(index);
        });
    }
  };

  useEffect(() => {
    if (lineRef.current) {
        const tl = timeline([
            [lineRef.current, {
                width: ['0px', '64px'],
            }],
            [lineRef.current, {
                x: ['calc(-50vw + 50%)', `-${tabWidth + tabGap}px`],
            }],
        ], {
            duration: 0.3,
        });
        tl.play();
    }
  }, []);

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`${styles.tabItem} ${activeTab === index ? styles.active : ''}`}
          onClick={() => handleTabClick(index)}
        >
          {isIcon && <img src={icons[index]} alt={tab} className={styles.tabIcon} />}
          <div className={styles.tabTextContainer}>
            <span className={styles.tabText}>{tab}</span>
          </div>
        </div>
      ))}
      <div className={styles.line} ref={lineRef} />
    </div>
  );
};

export default MenuTab;

