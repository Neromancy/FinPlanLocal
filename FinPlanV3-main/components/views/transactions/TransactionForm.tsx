
import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../../../types.ts';
import Button from '../../common/Button.tsx';
import Input from '../../common/Input.tsx';
import Select from '../../common/Select.tsx';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  initialData?: Transaction | null;
  categorizeTransaction: (description: string) => Promise<{ category: Category; confidence: number }>;
  categories: string[];
  error?: string | null;
}

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialData, categorizeTransaction, categories, error }) => {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ category: Category; confidence: number } | null>(null);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setAmount(initialData.amount.toString());
      setType(initialData.type);
      setCategory(initialData.category);
      setDate(initialData.date);
      setAiSuggestion(null);
    } else {
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('Other');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);


  const handleDescriptionBlur = async () => {
    if (description.trim().length > 3 && !aiSuggestion) {
      setIsCategorizing(true);
      try {
        const { category: suggestedCategory, confidence } = await categorizeTransaction(description);
        if (confidence > 0.7) {
            setAiSuggestion({ category: suggestedCategory, confidence });
        }
      } catch (error) {
        console.error("Failed to get category suggestion:", error);
      } finally {
        setIsCategorizing(false);
      }
    }
  };

  const handleAcceptSuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion.category);
      setAiSuggestion(null);
    }
  };

  const handleDismissSuggestion = () => {
    setAiSuggestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
        alert(t('transactions.form.fillAllFieldsError'));
        return;
    }
    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('transactions.form.description')}</label>
        <Input 
          id="description" 
          value={description} 
          onChange={(e) => {
            setDescription(e.target.value);
            setAiSuggestion(null); // Clear suggestion on edit
          }} 
          onBlur={handleDescriptionBlur} 
          required 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('transactions.form.amount')}</label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required step="0.01" />
        </div>
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('transactions.form.date')}</label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('transactions.form.type')}</label>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
                <option value="expense">{t('transactions.form.types.expense')}</option>
                <option value="income">{t('transactions.form.types.income')}</option>
            </Select>
        </div>
        <div>
            <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
              {t('transactions.form.category')}
              {isCategorizing && <SpinnerIcon className="h-4 w-4 text-primary" />}
            </label>
            <Select 
              id="category" 
              value={category} 
              onChange={(e) => {
                setCategory(e.target.value as Category);
                setAiSuggestion(null); // Clear suggestion on manual change
              }} 
              disabled={isCategorizing}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
        </div>
      </div>
      {aiSuggestion && (
        <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-md mt-2 text-sm text-text-secondary dark:text-dark-text-secondary border border-gray-200 dark:border-dark-border flex justify-between items-center animate-fade-in">
          <span>
            {t('transactions.form.aiSuggestion.text')} <strong className="text-text-primary dark:text-dark-text-primary">{aiSuggestion.category}</strong> ({(aiSuggestion.confidence * 100).toFixed(0)}% {t('transactions.form.aiSuggestion.confidence')})
          </span>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={handleAcceptSuggestion}>
              {t('transactions.form.aiSuggestion.accept')}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleDismissSuggestion}>
              {t('transactions.form.aiSuggestion.dismiss')}
            </Button>
          </div>
        </div>
      )}
       {error && (
        <div className="bg-danger/10 text-danger text-sm p-3 rounded-md text-center" role="alert">
            {error}
        </div>
      )}
      <Button type="submit" className="w-full">{initialData ? t('transactions.form.saveChangesButton') : t('transactions.form.addButton')}</Button>
    </form>
  );
};

export default TransactionForm;