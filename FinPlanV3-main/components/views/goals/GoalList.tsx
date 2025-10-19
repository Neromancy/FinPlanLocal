
import React, { useState } from 'react';
import { Goal, Transaction, User } from '../../../types.ts';
import Button from '../../common/Button.tsx';
import Input from '../../common/Input.tsx';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';
import { useLoading } from '../../../contexts/LoadingContext.tsx';

// A simple markdown parser for bold and lists
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const elements: React.ReactNode[] = [];
    let currentListItems: string[] = [];

    const flushList = () => {
        if (currentListItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1">
                    {currentListItems.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                </ul>
            );
            currentListItems = [];
        }
    };

    content.split('\n').forEach((line) => {
        // Process bold formatting first
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        const isListItem = formattedLine.trim().startsWith('* ') || formattedLine.trim().startsWith('- ');

        if (isListItem) {
            currentListItems.push(formattedLine.trim().substring(2));
        } else {
            flushList();
            if (formattedLine.trim()) {
                elements.push(<p key={`p-${elements.length}`} dangerouslySetInnerHTML={{ __html: formattedLine }} />);
            }
        }
    });

    flushList();

    return <div className="prose prose-sm max-w-none text-text-secondary dark:text-dark-text-secondary prose-strong:text-text-primary dark:prose-strong:text-dark-text-primary">{elements}</div>;
};

const AiIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 3zM3.055 5.284a.75.75 0 01.056 1.06l-1.006 1.006a.75.75 0 01-1.06-1.06l1.006-1.006a.75.75 0 011.004-.056zM16.945 5.284a.75.75 0 011.06.056l1.006 1.006a.75.75 0 01-1.06 1.06l-1.006-1.006a.75.75 0 01.004-1.116zM10 15.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM3.75 10a.75.75 0 00-1.5 0v.041c0 .414.336.75.75.75h.01a.75.75 0 00.74-.791V10zM16.25 10a.75.75 0 00-1.5 0v.041c0 .414.336.75.75.75h.01a.75.75 0 00.74-.791V10zM8.22 16.22a.75.75 0 011.06 0l1.006 1.006a.75.75 0 11-1.06 1.06l-1.006-1.006a.75.75 0 010-1.06zM15.53 15.53a.75.75 0 010 1.06l-1.006 1.006a.75.75 0 11-1.06-1.06l1.006-1.006a.75.75 0 011.06 0z" clipRule="evenodd" />
        <path d="M10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
    </svg>
);

const ChevronIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const GoalCard: React.FC<{
  goal: Goal;
  onDelete: (id: string) => void;
  onAddFunds: (id: string, amount: number) => string | void;
  onGeneratePlan: (goal: Goal, transactions: Transaction[], balance: number) => Promise<string>;
  updateGoalPlan: (goalId: string, plan: string) => void;
  transactions: Transaction[];
}> = ({ goal, onDelete, onAddFunds, onGeneratePlan, updateGoalPlan, transactions }) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { setLoadingMessage } = useLoading();
  const [fundAmount, setFundAmount] = useState('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);
  const [fundError, setFundError] = useState<string | null>(null);

  const progress = goal.isCompleted ? 100 : (goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0);
  const remainingAmount = Math.max(0, goal.targetAmount - goal.savedAmount);
  
  const handleGeneratePlan = async () => {
      setLoadingMessage(t('loading.generatingPlan'));
      try {
        const balance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
        const plan = await onGeneratePlan(goal, transactions, balance);
        updateGoalPlan(goal.id, plan);
        setIsPlanExpanded(true); // Automatically expand the new plan
      } catch (error) {
        console.error(error);
        alert(t('goals.list.planError'));
      } finally {
        setLoadingMessage('');
      }
  };

  const calculateDuration = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'N/A';
    
    const diffTime = Math.max(0, endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return t('goals.list.duration.day');
    if (diffDays < 60) return t('goals.list.duration.days', { count: diffDays });
    
    const diffMonths = Math.round(diffDays / 30.44);
    return t(diffMonths > 1 ? 'goals.list.duration.months' : 'goals.list.duration.month', { count: diffMonths });
  };
  
  const handleSaveFunds = () => {
    setFundError(null);
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) return;
    const error = onAddFunds(goal.id, amount);
    if (error) {
        setFundError(error);
    } else {
        setFundAmount('');
        setIsAddingFunds(false);
    }
  };

  return (
    <div className={`bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md flex flex-col ${goal.isCompleted ? 'border-2 border-primary' : 'border-2 border-transparent dark:border-transparent'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold dark:text-dark-text-primary">{goal.name} {goal.isCompleted && '✅'}</h3>
          <p className="text-text-secondary dark:text-dark-text-secondary">{formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}</p>
          {!goal.isCompleted && remainingAmount > 0 && (
            <p className="text-sm text-secondary dark:text-amber-400 mt-1">
              {t('goals.list.remaining', { amount: formatCurrency(remainingAmount) })}
            </p>
          )}
        </div>
        <button onClick={() => onDelete(goal.id)} className="text-gray-400 hover:text-text-primary dark:hover:text-dark-text-primary">
          &times;
        </button>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 my-4">
        <div className={`${goal.isCompleted ? 'bg-primary' : 'bg-secondary'} h-4 rounded-full`} style={{ width: `${Math.min(100, progress)}%` }}></div>
      </div>

      {goal.isCompleted && goal.completedAt && (
        <div className="mb-4 text-sm text-text-secondary dark:text-dark-text-secondary space-y-1">
            <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span>{t('goals.list.completedOn')} {formatDate(goal.completedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                <span>{t('goals.list.durationText', { duration: calculateDuration(goal.createdAt, goal.completedAt) })}</span>
            </div>
        </div>
      )}

      {!goal.isCompleted && (
        <div className="flex gap-2 mt-auto flex-wrap">
          <Button onClick={() => setIsAddingFunds(!isAddingFunds)} variant="ghost" size="sm">
            {isAddingFunds ? t('goals.list.cancel') : t('goals.list.addFunds')}
          </Button>
          <Button onClick={handleGeneratePlan} variant="secondary" size="sm">
              {goal.aiPlan ? t('goals.list.refreshPlan') : t('goals.list.generatePlan')}
          </Button>
        </div>
      )}
      {isAddingFunds && !goal.isCompleted && (
        <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Input type="number" value={fundAmount} onChange={(e) => { setFundAmount(e.target.value); setFundError(null); }} placeholder={t('goals.list.addFundsPlaceholder')} />
              <Button onClick={handleSaveFunds}>
                {t('goals.list.addFundsSave')}
              </Button>
            </div>
            {fundError && (
                <p className="text-sm text-danger text-center" role="alert">{fundError}</p>
            )}
        </div>
      )}
      {goal.aiPlan && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border/50">
          <button
            onClick={() => setIsPlanExpanded(!isPlanExpanded)}
            className="w-full flex justify-between items-center text-left"
            aria-expanded={isPlanExpanded}
            aria-controls={`plan-${goal.id}`}
          >
            <div className="flex items-center gap-2">
              <AiIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h4 className="font-bold text-lg text-teal-800 dark:text-teal-300">{t('goals.list.aiPlanTitle')}</h4>
            </div>
            <ChevronIcon className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isPlanExpanded ? 'transform rotate-180' : ''}`} />
          </button>
          <div
            id={`plan-${goal.id}`}
            className={`grid transition-all duration-500 ease-in-out ${isPlanExpanded ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden">
              <div className="p-4 bg-teal-50/50 dark:bg-teal-900/20 rounded-lg">
                <SimpleMarkdown content={goal.aiPlan} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GoalList: React.FC<Omit<React.ComponentProps<typeof GoalCard>, 'goal' | 'onAddFunds'> & { goals: Goal[], onAddFunds: (id: string, amount: number) => string | void }> = ({ goals, ...props }) => {
  const { t } = useLanguage();
  if (goals.length === 0) {
    return <div className="text-center py-10 bg-surface dark:bg-dark-surface rounded-lg"><p className="text-text-secondary dark:text-dark-text-secondary">{t('goals.list.noGoals')}</p></div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {goals.map(goal => <GoalCard key={goal.id} goal={goal} {...props} />)}
    </div>
  );
};

export default GoalList;