
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import { View, Transaction, Goal, RecurringTransaction, User, Category, Budget, RegisteredUser } from './types.ts';
import { GAMIFICATION_POINTS, DEFAULT_CATEGORIES } from './constants.ts';
import { useTheme } from './contexts/ThemeContext.tsx';

import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/views/Dashboard.tsx';
import TransactionsView from './components/views/TransactionsView.tsx';
import GoalsView from './components/views/GoalsView.tsx';
import RecurringTransactionsView from './components/views/RecurringTransactionsView.tsx';
import CategoriesView from './components/views/CategoriesView.tsx';
import ReportsView from './components/views/ReportsView.tsx';
import PremiumModal from './components/PremiumModal.tsx';
import BudgetsView from './components/views/BudgetsView.tsx';
import LoginView from './components/auth/LoginView.tsx';
import RegisterView from './components/auth/RegisterView.tsx';
import LanguageSelectionView from './components/auth/LanguageSelectionView.tsx';
import ProfileView from './components/views/ProfileView.tsx';
import { useLanguage } from './contexts/LanguageContext.tsx';

import {
  categorizeTransaction,
  scanReceipt,
  suggestGoals as suggestGoalsAI,
  generateBudgetPlan as generateBudgetPlanAI,
} from './services/geminiService.ts';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const App: React.FC = () => {
  const { theme } = useTheme();
  const { language, setLanguage: setGlobalLanguage, t, formatCurrency } = useLanguage();
  
  // Auth state
  const [registeredUsers, setRegisteredUsers] = useLocalStorage<RegisteredUser[]>('registeredUsers', []);
  const [currentUser, setCurrentUser] = useLocalStorage<RegisteredUser | null>('currentUser', null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [needsLanguageSelection, setNeedsLanguageSelection] = useState(false);

  // App state
  const [view, setView] = useState<View>(View.Dashboard);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);

  // Prefix keys for user-specific data in localStorage
  const dataKeyPrefix = currentUser ? `${currentUser.id}_` : 'guest_';

  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(`${dataKeyPrefix}transactions`, []);
  const [goals, setGoals] = useLocalStorage<Goal[]>(`${dataKeyPrefix}goals`, []);
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage<RecurringTransaction[]>(`${dataKeyPrefix}recurringTransactions`, []);
  const [user, setUser] = useLocalStorage<User>(`${dataKeyPrefix}user`, { isPremium: false, points: 0 });
  const [budgets, setBudgets] = useLocalStorage<Budget[]>(`${dataKeyPrefix}budgets`, []);
  const [categories, setCategories] = useLocalStorage<Category[]>(`${dataKeyPrefix}categories`, DEFAULT_CATEGORIES);
  const [lastRecurringCheck, setLastRecurringCheck] = useLocalStorage<string>(`${dataKeyPrefix}lastRecurringCheck`, new Date().toISOString());
  
  const processedRecurringRef = useRef<string | null>(null);

  const currentBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => acc + (tx.type === 'income' ? tx.amount : -tx.amount), 0);
  }, [transactions]);


  // Effect to load data when user changes
  useEffect(() => {
    const loadUserData = (userId: string | null) => {
        const prefix = userId ? `${userId}_` : 'guest_';
        const load = <T,>(key: string, defaultValue: T): T => {
            try {
                const item = window.localStorage.getItem(prefix + key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error(`Error loading ${key} from localStorage`, e);
                return defaultValue;
            }
        };

        setTransactions(load('transactions', []));
        setGoals(load('goals', []));
        setBudgets(load('budgets', []));
        setRecurringTransactions(load('recurringTransactions', []));
        setUser(load('user', { isPremium: false, points: 0 }));
        setCategories(load('categories', DEFAULT_CATEGORIES)); // Always start with default categories for simplicity
        setLastRecurringCheck(load('lastRecurringCheck', new Date().toISOString()));
    };

    if (currentUser) {
        loadUserData(currentUser.id);
        if (currentUser.language) {
          setGlobalLanguage(currentUser.language);
        }
    } else {
        loadUserData(null); // Clear data for guest/logged-out state
    }
  }, [currentUser, setGlobalLanguage, setTransactions, setGoals, setBudgets, setRecurringTransactions, setUser, setCategories, setLastRecurringCheck]);

  // Effect to process recurring transactions
  useEffect(() => {
    if (!currentUser || processedRecurringRef.current === currentUser.id) {
      return;
    }

    const processRecurring = () => {
      const now = new Date();
      const lastCheckDate = new Date(lastRecurringCheck);
      const newTransactions: Omit<Transaction, 'id'>[] = [];

      recurringTransactions.forEach(rtx => {
        if (!rtx.isActive) return;

        const startDate = new Date(rtx.startDate);
        let nextDueDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
        
        const rtxEndDate = rtx.endDate ? new Date(rtx.endDate) : null;
        if (rtxEndDate) {
            rtxEndDate.setUTCHours(23, 59, 59, 999);
        }

        while (nextDueDate < lastCheckDate) {
          switch (rtx.frequency) {
            case 'daily': nextDueDate.setUTCDate(nextDueDate.getUTCDate() + 1); break;
            case 'weekly': nextDueDate.setUTCDate(nextDueDate.getUTCDate() + 7); break;
            case 'monthly': nextDueDate.setUTCMonth(nextDueDate.getUTCMonth() + 1); break;
            case 'yearly': nextDueDate.setUTCFullYear(nextDueDate.getUTCFullYear() + 1); break;
          }
        }

        while (nextDueDate <= now) {
          if (rtxEndDate && nextDueDate > rtxEndDate) {
            break;
          }

          const dateString = formatDate(nextDueDate);
          const alreadyExists = transactions.some(t => t.recurringId === rtx.id && t.date === dateString);

          if (!alreadyExists) {
            newTransactions.push({
              description: rtx.description,
              amount: rtx.amount,
              type: rtx.type,
              category: rtx.category,
              date: dateString,
              recurringId: rtx.id,
            });
          }

          switch (rtx.frequency) {
            case 'daily': nextDueDate.setUTCDate(nextDueDate.getUTCDate() + 1); break;
            case 'weekly': nextDueDate.setUTCDate(nextDueDate.getUTCDate() + 7); break;
            case 'monthly': nextDueDate.setUTCMonth(nextDueDate.getUTCMonth() + 1); break;
            case 'yearly': nextDueDate.setUTCFullYear(nextDueDate.getUTCFullYear() + 1); break;
          }
        }
      });

      if (newTransactions.length > 0) {
        const transactionsToAdd = newTransactions.map((tx, index) => ({ ...tx, id: `tx_recur_${Date.now()}_${index}` }));
        setTransactions(prev => [...prev, ...transactionsToAdd]);
      }

      setLastRecurringCheck(now.toISOString());
      processedRecurringRef.current = currentUser.id;
    };

    // A short delay to ensure state is settled after login
    const timer = setTimeout(processRecurring, 100);
    return () => clearTimeout(timer);
    
  }, [currentUser, recurringTransactions, transactions, lastRecurringCheck, setTransactions, setLastRecurringCheck]);


  // --- GAMIFICATION ---
  const addPoints = useCallback((points: number) => {
    setUser(prev => ({ ...prev, points: prev.points + points }));
  }, [setUser]);


  // --- TRANSACTIONS ---
  const addTransaction = (tx: Omit<Transaction, 'id'>): string | void => {
      const hasIncome = transactions.some(t => t.type === 'income');
      
      if (!hasIncome && tx.type === 'expense') {
        return t('errors.noIncomeRecorded');
      }
      
      if (tx.type === 'expense' && tx.amount > currentBalance) {
          return t('errors.insufficientBalance');
      }

      setTransactions(prev => [...prev, { ...tx, id: `tx${Date.now()}` }]);
      addPoints(GAMIFICATION_POINTS.ADD_TRANSACTION);
  };
  const updateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
  };
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // --- GOALS ---
  const addGoal = (goal: Omit<Goal, 'id' | 'savedAmount' | 'isCompleted' | 'createdAt'>) => {
    setGoals(prev => [
      ...prev,
      {
        ...goal,
        id: `goal${Date.now()}`,
        savedAmount: 0,
        isCompleted: false,
        createdAt: formatDate(new Date()),
      },
    ]);
    addPoints(GAMIFICATION_POINTS.CREATE_GOAL);
  };
  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };
 const addFundsToGoal = (goalId: string, amount: number): string | void => {
      if (amount > currentBalance) {
        return t('errors.insufficientBalance');
      }

      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      addTransaction({
          description: `Contribution to goal: ${goal.name}`,
          amount: amount,
          type: 'expense',
          category: 'Savings',
          date: formatDate(new Date()),
      });
      
      setGoals(prevGoals => prevGoals.map(g => {
          if (g.id === goalId) {
              const newSavedAmount = g.savedAmount + amount;
              const isCompleted = newSavedAmount >= g.targetAmount;
              if (isCompleted && !g.isCompleted) {
                  addPoints(GAMIFICATION_POINTS.COMPLETE_GOAL);
              }
              return { 
                ...g, 
                savedAmount: newSavedAmount, 
                isCompleted,
                ...(isCompleted && !g.completedAt && { completedAt: formatDate(new Date()) })
              };
          }
          return g;
      }));
  };
  const updateGoalPlan = (goalId: string, plan: string) => {
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, aiPlan: plan } : g));
  };


  // --- RECURRING TRANSACTIONS ---
  const addRecurringTransaction = (rtx: Omit<RecurringTransaction, 'id'>) => {
    setRecurringTransactions(prev => [...prev, { ...rtx, id: `rtx${Date.now()}` }]);
  };
  const toggleRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.map(rtx => rtx.id === id ? { ...rtx, isActive: !rtx.isActive } : rtx));
  };
  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(rtx => rtx.id !== id));
  };
  
  // --- CATEGORIES ---
  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };
  const updateCategory = (oldCategory: string, newCategory: string) => {
    setCategories(prev => prev.map(c => c === oldCategory ? newCategory : c));
    setTransactions(prev => prev.map(tx => tx.category === oldCategory ? { ...tx, category: newCategory } : tx));
    setRecurringTransactions(prev => prev.map(rtx => rtx.category === oldCategory ? { ...rtx, category: newCategory } : rtx));
    setBudgets(prev => prev.map(b => b.category === oldCategory ? { ...b, category: newCategory } : b));
  };
  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    setTransactions(prev => prev.map(tx => tx.category === category ? { ...tx, category: 'Other' } : tx));
    setRecurringTransactions(prev => prev.map(rtx => rtx.category === category ? { ...rtx, category: 'Other' } : rtx));
    setBudgets(prev => prev.filter(b => b.category !== category));
  };

  // --- BUDGETS ---
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    setBudgets(prev => [...prev, { ...budget, id: `b${Date.now()}` }]);
  };
  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b));
  };
  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };
  
  // --- AUTH ---
  const handleRegister = (newUser: Omit<RegisteredUser, 'id' | 'language'>): boolean => {
      const userExists = registeredUsers.some(u => u.email === newUser.email);
      if (userExists) {
          return false;
      }
      const newRegisteredUser = {
        ...newUser,
        id: `user_${Date.now()}`,
        profilePictureUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(newUser.name)}`,
      };
      setRegisteredUsers(prev => [...prev, newRegisteredUser]);
      return true;
  };

  const handleLogout = () => {
    processedRecurringRef.current = null;
    setCurrentUser(null);
    setView(View.Dashboard);
    setAuthView('login');
  };

  const handleUpdateUser = (updatedUser: RegisteredUser) => {
    setCurrentUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleLanguageSelection = (selectedLanguage: 'en' | 'id' | 'ja') => {
      if (currentUser) {
        const updatedUser = { ...currentUser, language: selectedLanguage };
        handleUpdateUser(updatedUser);
        setGlobalLanguage(selectedLanguage);
        setNeedsLanguageSelection(false);
      }
  };

  if (!currentUser) {
    const handleQuickLogin = (userToLogin: RegisteredUser) => {
      setCurrentUser(userToLogin);
      if (userToLogin.language) {
        setGlobalLanguage(userToLogin.language);
      } else {
        setNeedsLanguageSelection(true);
      }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-background dark:bg-dark-background font-sans p-4">
           {authView === 'login' ? (
                <LoginView 
                    users={registeredUsers}
                    onUserSelect={handleQuickLogin} 
                    onAddAccount={() => setAuthView('register')} 
                />
           ) : (
                <RegisterView 
                    onRegister={handleRegister} 
                    onSwitchToLogin={() => {
                        setAuthView('login');
                    }} 
                />
           )}
        </div>
    );
  }

  if (needsLanguageSelection) {
      return <LanguageSelectionView onSelectLanguage={handleLanguageSelection} />;
  }

  const views: { [key in View]: React.ReactNode } = {
    [View.Dashboard]: <Dashboard transactions={transactions} goals={goals} budgets={budgets} />,
    [View.Transactions]: <TransactionsView 
        transactions={transactions}
        addTransaction={addTransaction}
        updateTransaction={updateTransaction}
        deleteTransaction={deleteTransaction}
        categorizeTransaction={categorizeTransaction}
        scanReceipt={scanReceipt}
        categories={categories}
      />,
    [View.Goals]: <GoalsView 
        goals={goals} 
        addGoal={addGoal}
        deleteGoal={deleteGoal}
        addFundsToGoal={addFundsToGoal}
        updateGoalPlan={updateGoalPlan}
        transactions={transactions}
        suggestGoalsAI={suggestGoalsAI}
        generateBudgetPlanAI={generateBudgetPlanAI}
      />,
    [View.Budgets]: <BudgetsView
        budgets={budgets}
        transactions={transactions}
        categories={categories}
        addBudget={addBudget}
        updateBudget={updateBudget}
        deleteBudget={deleteBudget}
      />,
    [View.Recurring]: <RecurringTransactionsView
        recurringTransactions={recurringTransactions}
        addRecurringTransaction={addRecurringTransaction}
        toggleRecurringTransaction={toggleRecurringTransaction}
        deleteRecurringTransaction={deleteRecurringTransaction}
        categories={categories}
      />,
    [View.Categories]: <CategoriesView
        categories={categories}
        addCategory={addCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
      />,
    [View.Reports]: <ReportsView transactions={transactions} />,
    [View.Profile]: <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} />,
  };
  
  return (
    <div className={`App theme-${theme} flex h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary font-sans`}>
      <Sidebar 
        user={currentUser}
        currentView={view} 
        onNavigate={setView}
        points={user.points}
        isPremium={user.isPremium}
        onUpgrade={() => setPremiumModalOpen(true)}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {views[view]}
        </main>
      </div>

      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setPremiumModalOpen(false)}
        onUpgrade={() => {
          setUser(prev => ({ ...prev, isPremium: true }));
          setPremiumModalOpen(false);
        }}
      />
    </div>
  );
};

export default App;