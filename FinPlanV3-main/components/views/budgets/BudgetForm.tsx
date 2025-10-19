
import React, { useState, useMemo } from 'react';
import { Budget, Category } from '../../../types.ts';
import Button from '../../common/Button.tsx';
import Input from '../../common/Input.tsx';
import Select from '../../common/Select.tsx';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';

interface BudgetFormProps {
  onSubmit: (data: { category: Category; limit: number; }) => void;
  categories: Category[];
  existingBudgets: Budget[];
  initialData?: Budget | null;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, categories, existingBudgets, initialData }) => {
  const { t } = useLanguage();
  const availableCategories = useMemo(() => {
    const expenseCategories = ['Salary', 'Investment', 'Savings'];
    return categories.filter(c => 
      !expenseCategories.includes(c) && (c === initialData?.category || !existingBudgets.some(b => b.category === c))
    );
  }, [categories, existingBudgets, initialData]);

  const [category, setCategory] = useState<Category>(initialData?.category || availableCategories[0] || '');
  const [limit, setLimit] = useState<string>(initialData?.limit.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limit || parseFloat(limit) <= 0) {
      alert(t('budgets.form.error'));
      return;
    }
    onSubmit({
      category,
      limit: parseFloat(limit),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
          {t('budgets.form.categoryLabel')}
        </label>
        <Select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          required
          disabled={!!initialData}
        >
          {availableCategories.length > 0 ? (
             availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))
          ) : (
            <option disabled value="">{t('budgets.form.noCategories')}</option>
          )}
        </Select>
        {initialData && <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{t('budgets.form.categoryUnchangeable')}</p>}
      </div>
      <div>
        <label htmlFor="limit" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
          {t('budgets.form.limitLabel')}
        </label>
        <Input
          id="limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
          step="0.01"
          min="0.01"
          placeholder={t('budgets.form.limitPlaceholder')}
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" className="w-full">
          {initialData ? t('budgets.form.saveButton') : t('budgets.form.createButton')}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;