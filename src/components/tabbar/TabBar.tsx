import styles from './TabBar.module.css';

interface TabBarProps {
    type?: 'shadowed' | 'inTheAir'
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

const TabBar = ({ type = 'shadowed', children, style }: TabBarProps) => {
    return (
        <div className={`${styles.tabBar} ${styles[type]}`} style={style}>
            {children}
        </div>
    )
}

export default TabBar;