

import React from 'react';
import { useTheme } from '../contexts/ThemeContext.tsx';
import Logo from './Logo.tsx';

interface HeaderProps {
  onMenuClick: () => void;
}

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-surface dark:bg-dark-surface shadow-sm sticky top-0 z-30 h-16 flex-shrink-0">
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            {/* Left side: Hamburger menu */}
            <div className="flex-1 flex justify-start">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-gray-700"
                    aria-controls="sidebar"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon className="block h-6 w-6" />
                </button>
            </div>

            {/* Center: Logo */}
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Fin<span className="text-primary">Plan</span></h1>
            </div>

            {/* Right side: Theme toggle */}
            <div className="flex-1 flex justify-end">
                <ThemeToggle />
            </div>
        </div>
    </header>
  );
};

export default Header;