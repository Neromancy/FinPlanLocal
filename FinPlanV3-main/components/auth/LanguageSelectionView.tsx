
import React from 'react';
import Button from '../common/Button.tsx';
import Logo from '../Logo.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface LanguageSelectionViewProps {
  onSelectLanguage: (language: 'en' | 'id' | 'ja') => void;
}

const LanguageSelectionView: React.FC<LanguageSelectionViewProps> = ({ onSelectLanguage }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center min-h-screen bg-background dark:bg-dark-background font-sans">
        <div className="w-full max-w-sm p-8 space-y-8 bg-surface dark:bg-dark-surface rounded-2xl shadow-xl text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Logo className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Fin<span className="text-primary">Plan</span></h1>
            </div>
            <h2 className="text-xl text-text-secondary dark:text-dark-text-secondary">{t('language.title')}</h2>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{t('language.subtitle')}</p>
            <div className="flex flex-col gap-4 pt-4">
                <Button onClick={() => onSelectLanguage('en')} className="w-full py-3">{t('language.englishButton')}</Button>
                <Button onClick={() => onSelectLanguage('id')} className="w-full py-3" variant="secondary">{t('language.indonesianButton')}</Button>
                <Button onClick={() => onSelectLanguage('ja')} className="w-full py-3" variant="primary">{t('language.japaneseButton')}</Button>
            </div>
        </div>
    </div>
  );
};

export default LanguageSelectionView;