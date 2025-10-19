import React, { useEffect, useRef, useState } from 'react';
import styles from './MenuTab.module.css';
import { animate, timeline } from '@motionone/dom';
import { useTranslation } from 'react-i18next';
import { menuTabs } from '../../../types/menuTabs';
import { PlaceType } from '../../../types/menuTabs';

interface MenuTabProps {
  activeTab: PlaceType;
  isIcon? : boolean;
  tabOnClick: (tab: PlaceType) => void;
  isDot?: Record<PlaceType, boolean>;
}

const MenuTab = ({ activeTab, isIcon, tabOnClick, isDot = { tour: false, restaurant: false, accommodation: false } }: MenuTabProps) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

  const tabWidth = 64;
  const tabGap = 24;

  const handleTabClick = (tab: PlaceType) => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (lineRef.current) {
        animate(lineRef.current, {
            x: `${(menuTabs[tab].id - 2) * (tabWidth + tabGap)}px`,
        }, {
            duration: 0.3,
            easing: 'ease-in-out',
        }).finished.then(() => {
            setIsAnimating(false);
            tabOnClick(tab);
        });
    }
  };

  useEffect(() => {
    if (lineRef.current) {
        const tl = timeline([
            [lineRef.current, {
                width: ['0px', `${tabWidth}px`],
            }],
            [lineRef.current, {
                x: ['calc(-50vw + 50%)', `${(tabWidth + tabGap) * (menuTabs[activeTab].id - 2)}px`],
            }],
        ], {
            duration: 0.3,
        });
        tl.play();
    }
  }, []);

  return (
    <div className={styles.tabContainer}>
      {(Object.keys(menuTabs) as PlaceType[]).map((key) => (
        <div
          key={key}
          className={`${styles.tabItem} ${activeTab === key ? styles.active : ''}`}
          onClick={() => handleTabClick(key as PlaceType)}
        >
          {isIcon && <img src={menuTabs[key].icon} alt={menuTabs[key].label} className={styles.tabIcon} />}
          <div className={styles.tabTextContainer}>
            <span className={styles.tabText}>{t(menuTabs[key].label)}</span>
            {isDot[key] && <div className={styles.dot} />}
          </div>
        </div>
      ))}
      <div className={styles.line} ref={lineRef} />
    </div>
  );
};

export default MenuTab;

