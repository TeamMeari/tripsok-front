import { useEffect, useState } from "react";
import styles from "./DocumentPage.module.css";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface DocumentPageProps {
    markdownPath: string;
    titleKey: string;
}

const DocumentPage = ({markdownPath, titleKey}: DocumentPageProps) => {
    const { t, i18n } = useTranslation();
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(`${markdownPath}_${i18n.language}.md`)
        // fetch(`/termAndPrivacy/privacy_${i18n.language}.md`)
      .then(res => res.text())
      .then(setContent);
    }, [i18n.language]);

    return (
        <div className={styles.page}>
            <div className={styles.step}>
                <p className={styles.message}>{t(titleKey)}</p>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
}

export default DocumentPage;