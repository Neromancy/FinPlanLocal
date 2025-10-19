
import React, { useState, useMemo } from 'react';
import { Goal, User, Transaction } from '../../types.ts';
import Button from '../common/Button.tsx';
import Modal from '../common/Modal.tsx';
import GoalForm from './goals/GoalForm.tsx';
import GoalList from './goals/GoalList.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { useLoading } from '../../contexts/LoadingContext.tsx';

interface GoalsViewProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'savedAmount' | 'isCompleted' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  addFundsToGoal: (goalId: string, amount: number) => string | void;
  updateGoalPlan: (goalId: string, plan: string) => void;
  transactions: Transaction[];
  suggestGoalsAI: (summary: { income: number; expenses: number; balance: number }) => Promise<Omit<Goal, 'id' | 'savedAmount' | 'isCompleted' | 'createdAt'>[]>;
  generateBudgetPlanAI: (
    goal: Goal, 
    transactions: Transaction[], 
    balance: number, 
    language: 'en' | 'id' | 'ja',
    formatCurrency: (amount: number) => string
  ) => Promise<string>;
}

const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  addGoal,
  deleteGoal,
  addFundsToGoal,
  updateGoalPlan,
  transactions,
  suggestGoalsAI,
  generateBudgetPlanAI,
}) => {
  const { t, language, formatCurrency } = useLanguage();
  const { setLoadingMessage } = useLoading();
  const [isModalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const handleSuggestGoals = async () => {
    setLoadingMessage(t('loading.suggestingGoals'));
    try {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const suggestions = await suggestGoalsAI({ income, expenses, balance: income - expenses });
        suggestions.forEach(goal => addGoal(goal));
    } catch (error) {
        console.error("Failed to suggest goals", error);
        alert(t('goals.aiError'));
    } finally {
        setLoadingMessage('');
    }
  };

  const wrappedGeneratePlan = (goal: Goal, transactions: Transaction[], balance: number) => {
    return generateBudgetPlanAI(goal, transactions, balance, language, formatCurrency);
  };
  
  const sortedAndFilteredGoals = useMemo(() => {
    const filtered = goals.filter(g => {
        if (filter === 'active') return !g.isCompleted;
        if (filter === 'completed') return g.isCompleted;
        return true; // for 'all'
    });

    return filtered.sort((a, b) => {
        // Sort completed goals by completion date (newest first)
        if (filter === 'completed' && b.completedAt && a.completedAt) {
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        }

        // For active and all, sort by progress percentage (highest first)
        const progressA = a.targetAmount > 0 ? (a.savedAmount / a.targetAmount) : 0;
        const progressB = b.targetAmount > 0 ? (b.savedAmount / b.targetAmount) : 0;
        
        if (progressB !== progressA) {
            return progressB - progressA;
        }

        // Fallback sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [goals, filter]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
           <h2 className="text-3xl font-bold">{t('goals.title')}</h2>
           <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-surface p-1 rounded-lg">
                <Button size="sm" variant={filter === 'active' ? 'secondary' : 'ghost'} onClick={() => setFilter('active')}>{t('goals.filters.active')}</Button>
                <Button size="sm" variant={filter === 'completed' ? 'secondary' : 'ghost'} onClick={() => setFilter('completed')}>{t('goals.filters.completed')}</Button>
                <Button size="sm" variant={filter === 'all' ? 'secondary' : 'ghost'} onClick={() => setFilter('all')}>{t('goals.filters.all')}</Button>
            </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setModalOpen(true)} variant="primary" className="w-full">
            {t('goals.addGoalButton')}
          </Button>
          <Button variant="secondary" onClick={handleSuggestGoals} className="w-full">
              {t('goals.aiSuggestButton')}
          </Button>
        </div>
      </div>

      <GoalList
        goals={sortedAndFilteredGoals}
        onDelete={deleteGoal}
        onAddFunds={addFundsToGoal}
        onGeneratePlan={wrappedGeneratePlan}
        updateGoalPlan={updateGoalPlan}
        transactions={transactions}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('goals.modalTitle')}>
        <GoalForm
          onSubmit={(goal) => {
            addGoal(goal);
            setModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default GoalsView;