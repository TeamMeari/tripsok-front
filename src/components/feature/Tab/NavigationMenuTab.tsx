import React, { useEffect, useRef, useState } from 'react';
import styles from './NavigationMenuTab.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface MenuTabProps {
  tabs: {
    label: string;
    icon: string;
    uri: string;
    key: string;
  }[];
  isIcon? : boolean;
}

const MenuTab = ({ tabs, isIcon }: MenuTabProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    navigate('/list', {state: {tab: tabs[index].key}});
  };

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab: { label: string; icon: string; uri: string }, index: number) => (
        <div
          key={index}
          className={`${styles.tabItem}`}
          onClick={() => handleTabClick(index)}
        >
          {isIcon && <img src={tab.icon} alt={tab.label} className={styles.tabIcon} />}
          <div className={styles.tabTextContainer}>
            <span className={styles.tabText}>{t(tab.label)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuTab;

