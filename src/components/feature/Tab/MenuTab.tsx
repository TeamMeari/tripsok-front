import React, { useEffect, useRef, useState } from 'react';
import styles from './MenuTab.module.css';
import { animate, timeline } from '@motionone/dom';
import { useTranslation } from 'react-i18next';

interface MenuTabProps {
  tabs: {
    label: string;
    icon: string;
    uri: string;
  }[];
  activeTab: number;
  isIcon? : boolean;
  tabOnClick: (index: number) => void;
  isDot?: boolean[];
}

const MenuTab = ({ tabs, activeTab, isIcon, tabOnClick, isDot = [ false, false, false ] }: MenuTabProps) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

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
            tabOnClick(index);
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
      {tabs.map((tab: { label: string; icon: string; uri: string }, index: number) => (
        <div
          key={index}
          className={`${styles.tabItem} ${activeTab === index ? styles.active : ''}`}
          onClick={() => handleTabClick(index)}
        >
          {isIcon && <img src={tab.icon} alt={tab.label} className={styles.tabIcon} />}
          <div className={styles.tabTextContainer}>
            <span className={styles.tabText}>{t(tab.label)}</span>
            {isDot[index] && <div className={styles.dot} />}
          </div>
        </div>
      ))}
      <div className={styles.line} ref={lineRef} />
    </div>
  );
};

export default MenuTab;

