import { ArrowUp } from "lucide-react";
import styles from "./TopButton.module.css";

const TopButton = ({ ref }: { ref?: React.RefObject<HTMLDivElement> }) => {
    const handleScrollToTop = (ref?: React.RefObject<HTMLDivElement>) => {
        if (ref) {
            ref.current?.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
    return (
        <button className={styles.topButton} onClick={() => handleScrollToTop(ref)}>
            <ArrowUp />
        </button>
    )   
}

export default TopButton;