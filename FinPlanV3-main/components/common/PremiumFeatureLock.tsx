
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface PremiumFeatureLockProps {
  isPremium: boolean;
  // Fix: Explicitly type `children`'s props as `any` to allow spreading.
  // The default inference can lead to type errors in strict mode.
  children: React.ReactElement<any>;
  onUpgrade: () => void;
}

const PremiumFeatureLock: React.FC<PremiumFeatureLockProps> = ({ isPremium, children, onUpgrade }) => {
  const { t } = useLanguage();
  if (isPremium) {
    return children;
  }

  // Fix: Spread children.props first to avoid overwriting and fix potential type error.
  const lockedChild = React.cloneElement(children, {
    ...children.props,
    disabled: true,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onUpgrade();
    },
  });

  return (
    <div className="relative group w-full">
      {lockedChild}
      <div className="absolute bottom-full mb-2 w-max px-2 py-1 text-sm bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {t('premiumFeatureLock.tooltip')}
        <svg className="absolute text-gray-800 dark:text-gray-200 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
        </svg>
      </div>
    </div>
  );
};

export default PremiumFeatureLock;