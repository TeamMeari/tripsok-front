import styles from "../../../pages/SignupPage.module.css";
import Button from "../../common/Button/CommonBtn";

interface CompleteProps {
    nickname: string;
}

const Complete = ({ nickname }: CompleteProps) => {
    return <div className={styles.step}>
        <p className={styles.message}>{nickname}님, 반가워요!<br />관심있는 여행이 있으신가요?</p>
        <div className={styles.buttonFixedTab}>
            <a href="/"><Button borderRadius="12px" size="large">홈으로</Button></a>
        </div>
    </div>
}

export default Complete;