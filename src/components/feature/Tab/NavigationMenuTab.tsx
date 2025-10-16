import React, { useEffect, useRef, useState } from 'react';
import styles from './NavigationMenuTab.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { menuTabs } from '../../../types/menuTabs';
import { PlaceType } from '../../../types/menuTabs';

interface NavigationMenuTabProps {
  isIcon? : boolean;
}

const NavigationMenuTab = ({ isIcon }: NavigationMenuTabProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTabClick = (key: PlaceType) => {
    navigate('/list', {state: {tab: menuTabs[key].uri}});
  };

  return (
    <div className={styles.tabContainer}>
      {(Object.keys(menuTabs) as PlaceType[]).map((key: PlaceType) => (
        <div
          key={key}
          className={`${styles.tabItem}`}
          onClick={() => handleTabClick(key)}
        >
          {isIcon && <img src={menuTabs[key].icon} alt={menuTabs[key].label} className={styles.tabIcon} />}
          <div className={styles.tabTextContainer}>
            <span className={styles.tabText}>{t(menuTabs[key].label)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavigationMenuTab;

