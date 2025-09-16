import { SearchX } from 'lucide-react';
import styles from './EmptyList.module.css';
import { useTranslation } from 'react-i18next';

interface EmptyListProps {
  message?: string;
}

const EmptyList = ({ message = 'noSearchResult' }: EmptyListProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
        <SearchX size={64} />
      <div className={styles.message}>{t(message)}</div>
    </div>
  );
};

export default EmptyList;