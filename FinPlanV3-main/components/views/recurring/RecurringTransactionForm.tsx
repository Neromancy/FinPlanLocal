
import React, { useState, useMemo, useEffect } from 'react';
import { RecurringTransaction, Category, TransactionType, Frequency } from '../../../types.ts';
import Button from '../../common/Button.tsx';
import Input from '../../common/Input.tsx';
import Select from '../../common/Select.tsx';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';

interface RecurringTransactionFormProps {
  onSubmit: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  categories: string[];
}

const RecurringTransactionForm: React.FC<RecurringTransactionFormProps> = ({ onSubmit, categories }) => {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Other');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const incomeOnlyCategories = useMemo(() => ['Salary', 'Investment'], []);

  const availableCategories = useMemo(() => {
    if (type === 'income') {
      // For income, show income-specific categories plus 'Other' if it exists.
      return categories.filter(c => incomeOnlyCategories.includes(c) || c === 'Other');
    }
    // For expense, show all categories except income-only ones.
    return categories.filter(c => !incomeOnlyCategories.includes(c));
  }, [type, categories, incomeOnlyCategories]);

  useEffect(() => {
    // When the available categories change (due to type changing),
    // check if the current category is still valid. If not, reset it.
    if (!availableCategories.includes(category)) {
      setCategory(availableCategories.includes('Other') ? 'Other' : availableCategories[0] || '');
    }
  }, [availableCategories, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !startDate) {
        alert(t('recurring.form.fillFieldsError'));
        return;
    }
    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category,
      frequency,
      startDate,
      endDate: endDate || undefined,
      isActive: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('recurring.form.descriptionLabel')}</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('recurring.form.amountLabel')}</label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required step="0.01" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('recurring.form.typeLabel')}</label>
          <Select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
            <option value="expense">{t('recurring.form.types.expense')}</option>
            <option value="income">{t('recurring.form.types.income')}</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('recurring.form.categoryLabel')}</label>
          <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('recurring.form.frequencyLabel')}</label>
          <Select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
            <option value="daily">{t('recurring.form.frequencies.daily')}</option>
            <option value="weekly">{t('recurring.form.frequencies.weekly')}</option>
            <option value="monthly">{t('recurring.form.frequencies.monthly')}</option>
            <option value="yearly">{t('recurring.form.frequencies.yearly')}</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('recurring.form.startDateLabel')}</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('recurring.form.endDateLabel')}</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>
      <Button type="submit" className="w-full">{t('recurring.form.addButton')}</Button>
    </form>
  );
};

export default RecurringTransactionForm;