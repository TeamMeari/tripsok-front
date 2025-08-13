import React, { useState } from "react";
import styles from "./Menu_app.module.css";

interface MenuItem {
    label: string;
    iconDefault: string;
    iconSelected: string;
}

const menuItems: MenuItem[] = [
    {
        label: "탐색",
        iconDefault: "/menuIcon/explore_basic.png",
        iconSelected: "/menuIcon/explore_select.png",
    },
    {
        label: "나의 여정",
        iconDefault: "/menuIcon/myTrip_basic.png",
        iconSelected: "/menuIcon/myTrip_select.png",
    },
    {
        label: "고객센터",
        iconDefault: "/menuIcon/customer_basic.png",
        iconSelected: "/menuIcon/customer_select.png",
    },
];

const MenuApp: React.FC = () => {
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
                        alt={item.label}
                        className={styles.icon}
                    />
                    <span
                        className={
                            selectedIndex === index ? styles.labelSelected : styles.label
                        }
                    >
            {item.label}
          </span>
                </div>
            ))}
        </div>
    );
};

export default MenuApp;
