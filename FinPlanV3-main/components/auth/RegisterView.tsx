
import React, { useState } from 'react';
import { RegisteredUser } from '../../types.ts';
import Button from '../common/Button.tsx';
import Input from '../common/Input.tsx';
import Logo from '../Logo.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface RegisterViewProps {
  onRegister: (newUser: Omit<RegisteredUser, 'id'>) => boolean;
  onSwitchToLogin: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onRegister({ name, email, password });
    if (success) {
      onSwitchToLogin();
    } else {
      setError(t('register.error'));
    }
  };

  return (
    <div className="w-full max-w-sm p-8 space-y-8 bg-surface dark:bg-dark-surface rounded-2xl shadow-xl relative">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Logo className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Fin<span className="text-primary">Plan</span></h1>
        </div>
        <h2 className="text-xl text-text-secondary dark:text-dark-text-secondary">{t('register.title')}</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          placeholder={t('register.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label={t('register.namePlaceholder')}
        />
        <Input
          type="email"
          placeholder={t('register.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label={t('register.emailPlaceholder')}
        />
        <Input
          type="password"
          placeholder={t('register.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label={t('register.passwordPlaceholder')}
        />
        {error && <p className="text-sm text-danger text-center">{error}</p>}
        <Button type="submit" className="w-full py-3">{t('register.registerButton')}</Button>
      </form>
      <p className="text-sm text-center text-text-secondary dark:text-dark-text-secondary">
        {t('register.hasAccount')}{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-primary hover:underline focus:outline-none">
          {t('register.loginLink')}
        </button>
      </p>
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

export default RegisterView;