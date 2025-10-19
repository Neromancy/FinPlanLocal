
import React from 'react';
import { View, RegisteredUser } from '../types.ts';
import Logo from './Logo.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface SidebarProps {
  user: RegisteredUser;
  currentView: View;
  onNavigate: (view: View) => void;
  points: number;
  isPremium: boolean;
  onUpgrade: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

// Icons for navigation items
const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const TransactionsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const GoalsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.697 16.126A9.002 9.002 0 0112 15a9.002 9.002 0 016.303 1.126M12 12a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const BudgetsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25-2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
);
const RecurringIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v-4.99" />
    </svg>
);
const CategoriesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);
const ReportsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14" />
  </svg>
);
const ProfileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const navItems: { view: View; icon: React.FC<{ className?: string }>; translationKey: string }[] = [
    { view: View.Dashboard, icon: DashboardIcon, translationKey: 'sidebar.dashboard' },
    { view: View.Transactions, icon: TransactionsIcon, translationKey: 'sidebar.transactions' },
    { view: View.Goals, icon: GoalsIcon, translationKey: 'sidebar.goals' },
    { view: View.Budgets, icon: BudgetsIcon, translationKey: 'sidebar.budgets' },
    { view: View.Recurring, icon: RecurringIcon, translationKey: 'sidebar.recurring' },
    { view: View.Categories, icon: CategoriesIcon, translationKey: 'sidebar.categories' },
    { view: View.Reports, icon: ReportsIcon, translationKey: 'sidebar.reports' },
    { view: View.Profile, icon: ProfileIcon, translationKey: 'sidebar.profile' },
];

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, onNavigate, points, isPremium, onUpgrade, isOpen, setIsOpen, onLogout }) => {
  const { t } = useLanguage();
  
  const handleNavClick = (view: View) => {
    onNavigate(view);
    setIsOpen(false);
  };
  
  const getNavItemClasses = (view: View) => {
    const base = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors";
    if (view === currentView) {
      return `${base} bg-primary text-white`;
    }
    return `${base} text-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-gray-700 dark:hover:text-dark-text-primary`;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border">
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Profile Section */}
          <div className="px-4 pt-4 pb-4 border-b border-gray-200 dark:border-dark-border">
            <button 
                onClick={() => handleNavClick(View.Profile)}
                className="flex items-center gap-3 p-3 w-full text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <img src={user.profilePictureUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover bg-gray-200" />
              <div className="flex-1 truncate">
                <h2 className="text-md font-bold text-text-primary dark:text-dark-text-primary truncate">{user.name}</h2>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{t('sidebar.viewProfile')}</p>
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-4 space-y-2">
              {navItems.map(({ view, icon: Icon, translationKey }) => (
                  <button key={view} onClick={() => handleNavClick(view)} className={getNavItemClasses(view)}>
                      <Icon className="h-5 w-5" />
                      <span>{t(translationKey)}</span>
                  </button>
              ))}
          </nav>
        </div>


        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-dark-border space-y-3 flex-shrink-0">
             <div className="flex items-center justify-between gap-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300 px-3 py-1.5 rounded-full">
               <div className="flex items-center gap-2">
                 <StarIcon className="w-5 h-5 text-accent" />
                 <span className="font-bold">{points} {t('sidebar.points')}</span>
               </div>
            </div>
            {!isPremium && (
              <button 
                onClick={() => { onUpgrade(); setIsOpen(false); }}
                className="w-full bg-accent hover:brightness-95 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                {t('sidebar.upgradeButton')}
              </button>
            )}
             {isPremium && (
                <div className="flex items-center justify-center gap-2 text-accent font-bold p-2 bg-accent/10 rounded-md">
                    <StarIcon className="w-5 h-5"/>
                    <span>{t('sidebar.premiumMember')}</span>
                </div>
            )}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-gray-700 dark:hover:text-dark-text-primary"
            >
              <LogoutIcon className="h-5 w-5" />
              <span>{t('sidebar.logout')}</span>
            </button>
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition duration-300 ${isOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div 
            className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setIsOpen(false)}
        ></div>
        {/* Content */}
        <div className={`relative w-64 h-full transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;