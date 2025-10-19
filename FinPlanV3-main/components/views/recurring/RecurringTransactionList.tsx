
import React from 'react';
import { RecurringTransaction } from '../../../types.ts';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';

const RecurringTransactionList: React.FC<{
  recurringTransactions: RecurringTransaction[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ recurringTransactions, onToggle, onDelete }) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/20 border-b border-gray-200 dark:border-dark-border">
            <tr>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('recurring.list.header.status')}</th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('recurring.list.header.description')}</th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('recurring.list.header.amount')}</th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('recurring.list.header.frequency')}</th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('recurring.list.header.nextDate')}</th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('recurring.list.header.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
            {recurringTransactions.map(rtx => {
                const nextDate = new Date(rtx.startDate);
                const today = new Date();
                while(nextDate < today) {
                     switch (rtx.frequency) {
                        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
                        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
                        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
                        case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
                    }
                }
                const isEnded = rtx.endDate && nextDate > new Date(rtx.endDate);

                return(
                <tr key={rtx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                    <td className="p-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={rtx.isActive} onChange={() => onToggle(rtx.id)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary"></div>
                    </label>
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-dark-text-primary">{rtx.description}</td>
                    <td className={`p-4 whitespace-nowrap text-sm font-medium ${rtx.type === 'income' ? 'text-primary' : 'text-danger'}`}>
                    {rtx.type === 'income' ? '+' : '-'}{formatCurrency(rtx.amount, { signDisplay: 'never' })}
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-text-secondary dark:text-dark-text-secondary capitalize">{t(`recurring.form.frequencies.${rtx.frequency}`)}</td>
                    <td className="p-4 whitespace-nowrap text-sm text-text-secondary dark:text-dark-text-secondary">{isEnded ? t('recurring.list.ended') : formatDate(nextDate.toISOString().split('T')[0])}</td>
                    <td className="p-4 whitespace-nowrap text-sm">
                      <button onClick={() => onDelete(rtx.id)} className="font-medium text-danger hover:text-red-700">
                          {t('recurring.list.deleteButton')}
                      </button>
                    </td>
                </tr>
            )})}
             {recurringTransactions.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center p-8 text-text-secondary dark:text-dark-text-secondary">{t('recurring.list.noRecurring')}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringTransactionList;