import React, { useState } from "react";
import styles from "./MenuApp.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface MenuItem {
    key: string; // i18n 키
    iconDefault: string;
    iconSelected: string;
    route?: string;
}

interface MenuAppProps {
    defaultIndex?: number;
}

const menuItems: MenuItem[] = [
    {
        key: "tabNavigation",
        iconDefault: "/menuIcon/explore_basic.svg",
        iconSelected: "/menuIcon/explore_select.svg",
        route: "/",
    },
    {
        key: "tabMyPlan",
        iconDefault: "/menuIcon/myTrip_basic.svg",
        iconSelected: "/menuIcon/myTrip_select.svg",
        route: "/myplan",
    },
    {
        key: "tabCustomerService",
        iconDefault: "/menuIcon/customer_basic.svg",
        iconSelected: "/menuIcon/customer_select.svg",
    },
];

const MenuApp: React.FC<MenuAppProps> = ({ defaultIndex = 0 }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);

    const handleClick = (index: number) => {
        setSelectedIndex(index);
        const route = menuItems[index].route;
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className={styles.menuContainer}>
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={styles.menuItem}
                    onClick={() => handleClick(index)}
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
