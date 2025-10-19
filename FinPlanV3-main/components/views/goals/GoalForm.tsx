
import React, { useState } from 'react';
import { Goal } from '../../../types.ts';
import Button from '../../common/Button.tsx';
import Input from '../../common/Input.tsx';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';

interface GoalFormProps {
  // FIX: Omit 'createdAt' from the type, as the form is not responsible for providing it.
  // The parent component (`App.tsx`) generates this value when adding a new goal.
  onSubmit: (goal: Omit<Goal, 'id' | 'savedAmount' | 'isCompleted' | 'createdAt'>) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) {
        alert(t('goals.form.fillAllFieldsError'));
        return;
    }
    onSubmit({
      name,
      targetAmount: parseFloat(targetAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="goal-name" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('goals.form.nameLabel')}</label>
        <Input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('goals.form.namePlaceholder')} required />
      </div>
      <div>
        <label htmlFor="target-amount" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('goals.form.targetAmountLabel')}</label>
        <Input 
            id="target-amount" 
            type="number" 
            value={targetAmount} 
            onChange={(e) => setTargetAmount(e.target.value)} 
            placeholder={t('goals.form.targetAmountPlaceholder')} 
            required 
            step="0.01" 
            min="0.01"
        />
      </div>
      <Button type="submit" className="w-full">{t('goals.form.addButton')}</Button>
    </form>
  );
};

export default GoalForm;