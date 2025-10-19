
import React from 'react';
import { Budget } from '../../../types.ts';
import Button from '../../common/Button.tsx';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';

interface BudgetCardProps {
  budget: Budget;
  spentAmount: number;
  onEdit: () => void;
  onDelete: () => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, spentAmount, onEdit, onDelete }) => {
  const { t, formatCurrency } = useLanguage();
  const progress = budget.limit > 0 ? (spentAmount / budget.limit) * 100 : 0;
  const remaining = budget.limit - spentAmount;

  let progressBarColor = 'bg-primary';
  let progressTextColor = 'text-primary';
  if (progress > 100) {
    progressBarColor = 'bg-danger';
    progressTextColor = 'text-danger';
  } else if (progress > 75) {
    progressBarColor = 'bg-yellow-500';
    progressTextColor = 'text-yellow-500';
  }
  
  return (
    <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold dark:text-dark-text-primary">{budget.category}</h3>
          <span className={`font-semibold ${progressTextColor}`}>{progress.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between items-baseline mt-1">
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm">{t('budgets.card.spent')}: {formatCurrency(spentAmount)}</p>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm">{t('budgets.card.limit')}: {formatCurrency(budget.limit)}</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 my-3">
          <div
            className={`${progressBarColor} h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, progress)}%` }}
          ></div>
        </div>
        {remaining >= 0 ? (
          <p className="text-sm text-center text-primary">{formatCurrency(remaining)} {t('budgets.card.remaining')}</p>
        ) : (
          <p className="text-sm text-center text-danger">{formatCurrency(Math.abs(remaining))} {t('budgets.card.overBudget')}</p>
        )}
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
        <Button onClick={onEdit} variant="ghost" size="sm" className="w-full">{t('budgets.card.editButton')}</Button>
        <Button onClick={onDelete} variant="danger" size="sm" className="w-full">{t('budgets.card.deleteButton')}</Button>
      </div>
    </div>
  );
};

export default BudgetCard;