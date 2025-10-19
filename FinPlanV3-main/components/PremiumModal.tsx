
import React from 'react';
import Modal from './common/Modal.tsx';
import Button from './common/Button.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumFeature: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <li className="flex items-start space-x-3">
        <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <div>
            <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-dark-text-primary">{title}</h3>
            <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">{description}</p>
        </div>
    </li>
);

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const { t } = useLanguage();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('premiumModal.title')}>
      <div className="space-y-6">
        <p className="text-center text-lg text-text-secondary dark:text-dark-text-secondary">{t('premiumModal.description')}</p>
        <ul className="space-y-4">
            <PremiumFeature title={t('premiumModal.feature1.title')} description={t('premiumModal.feature1.description')} />
            <PremiumFeature title={t('premiumModal.feature2.title')} description={t('premiumModal.feature2.description')} />
            <PremiumFeature title={t('premiumModal.feature3.title')} description={t('premiumModal.feature3.description')} />
        </ul>
        <Button onClick={onUpgrade} className="w-full bg-accent hover:brightness-95 text-white font-bold py-3 text-lg">
            {t('premiumModal.upgradeButton')}
        </Button>
      </div>
    </Modal>
  );
};

export default PremiumModal;