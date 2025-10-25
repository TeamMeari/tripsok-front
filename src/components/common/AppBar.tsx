import styles from './AppBar.module.css';

const AppBar = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    return (
        <div className={styles.appBar}>
            { children }
        </div>
    );
};

export default AppBar;