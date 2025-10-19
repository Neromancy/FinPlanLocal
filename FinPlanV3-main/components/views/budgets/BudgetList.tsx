
import React from 'react';
import { Budget, Transaction } from '../../../types.ts';
import BudgetCard from './BudgetCard.tsx';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, transactions, onEdit, onDelete }) => {
  const { t } = useLanguage();
  if (budgets.length === 0) {
    return (
      <div className="text-center py-10 bg-surface dark:bg-dark-surface rounded-lg shadow-md">
        <p className="text-text-secondary dark:text-dark-text-secondary">
          {t('budgets.list.noBudgets')}
        </p>
      </div>
    );
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const spentAmounts = budgets.reduce((acc, budget) => {
    const amount = transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return (
          tx.type === 'expense' &&
          tx.category === budget.category &&
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
    acc[budget.id] = amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map(budget => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          spentAmount={spentAmounts[budget.id] || 0}
          onEdit={() => onEdit(budget)}
          onDelete={() => onDelete(budget.id)}
        />
      ))}
    </div>
  );
};

export default BudgetList;