
import React from 'react';
import { RegisteredUser } from '../../types.ts';
import Logo from '../Logo.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface LoginViewProps {
  users: RegisteredUser[];
  onUserSelect: (user: RegisteredUser) => void;
  onAddAccount: () => void;
}

const UserAvatar: React.FC<{ user: RegisteredUser; onSelect: () => void }> = ({ user, onSelect }) => {
  const { t } = useLanguage();
  return (
    <button onClick={onSelect} className="flex flex-col items-center gap-2 group text-center w-28">
      <img
        src={user.profilePictureUrl}
        alt={user.name}
        className="h-20 w-20 rounded-full object-cover bg-gray-200 transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg ring-2 ring-transparent group-hover:ring-primary"
      />
      <span className="font-semibold text-text-primary dark:text-dark-text-primary truncate w-full">{user.name}</span>
      <span className="text-xs text-text-secondary dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">{t('login.clickToLogin')}</span>
    </button>
  );
};

const AddAccountButton: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
    const { t } = useLanguage();
    return (
        <button onClick={onAdd} className="flex flex-col items-center gap-2 group text-center w-28">
            <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg ring-2 ring-transparent group-hover:ring-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <span className="font-semibold text-text-primary dark:text-dark-text-primary">{t('login.addAccount')}</span>
        </button>
    );
};


const LoginView: React.FC<LoginViewProps> = ({ users, onUserSelect, onAddAccount }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const accountsContainerClasses = users.length === 0
    ? 'flex justify-center pt-4'
    : 'grid grid-cols-2 gap-x-4 gap-y-8 justify-items-center pt-4';

  return (
    <div className="w-full max-w-sm p-8 space-y-8 bg-surface dark:bg-dark-surface rounded-2xl shadow-xl relative animate-modal-enter">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Logo className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Fin<span className="text-primary">Plan</span></h1>
        </div>
        <h2 className="text-xl text-text-secondary dark:text-dark-text-secondary">{t('login.welcome')}</h2>
      </div>

      <div className="space-y-4">
          <h3 className="text-center font-semibold text-text-secondary dark:text-dark-text-secondary">{t('login.quickLogin')}</h3>
          <div className={accountsContainerClasses}>
              {users.map(user => (
                  <UserAvatar key={user.id} user={user} onSelect={() => onUserSelect(user)} />
              ))}
              <AddAccountButton onAdd={onAddAccount} />
          </div>
      </div>
      
       <div className="absolute top-4 right-4">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                }
            </button>
       </div>
    </div>
  );
};

export default LoginView;