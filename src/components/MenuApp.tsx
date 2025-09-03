import React, { useState } from "react";
import styles from "./MenuApp.module.css";
import { useTranslation } from "react-i18next";

interface MenuItem {
    key: string; // i18n 키
    iconDefault: string;
    iconSelected: string;
}

const menuItems: MenuItem[] = [
    {
        key: "tabNavigation",
        iconDefault: "/menuIcon/explore_basic.svg",
        iconSelected: "/menuIcon/explore_select.svg",
    },
    {
        key: "tabMyPlan",
        iconDefault: "/menuIcon/myTrip_basic.svg",
        iconSelected: "/menuIcon/myTrip_select.svg",
    },
    {
        key: "tabCustomerService",
        iconDefault: "/menuIcon/customer_basic.svg",
        iconSelected: "/menuIcon/customer_select.svg",
    },
];

const MenuApp: React.FC = () => {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    return (
        <div className={styles.menuContainer}>
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={styles.menuItem}
                    onClick={() => setSelectedIndex(index)}
                >
                    <img
                        src={selectedIndex === index ? item.iconSelected : item.iconDefault}
                        alt={t(item.key)}
                        className={styles.icon}
                    />
                    <span
                        className={
                            selectedIndex === index ? styles.labelSelected : styles.label
                        }
                    >
                        {t(item.key)}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default MenuApp;
