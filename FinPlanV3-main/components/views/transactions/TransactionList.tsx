
import React from 'react';
import { Transaction, Category, TransactionType } from '../../../types.ts';
import Select from '../../common/Select.tsx';
import Input from '../../common/Input.tsx';
import { useLanguage } from '../../../contexts/LanguageContext.tsx';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  filterType: 'all' | TransactionType;
  setFilterType: (type: 'all' | TransactionType) => void;
  filterCategory: 'all' | Category;
  setFilterCategory: (category: 'all' | Category) => void;
  sortConfig: { key: keyof Transaction; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof Transaction) => void;
  categories: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
    // If a direction is set, the icon is always visible.
    if (direction === 'asc') {
        return <span className="text-text-primary dark:text-dark-text-primary">↑</span>;
    }
    if (direction === 'desc') {
        return <span className="text-text-primary dark:text-dark-text-primary">↓</span>;
    }
    // For non-active columns, show an icon that's invisible by default but appears on hover.
    return <span className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>;
};

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const getCategoryColor = (category: string) => {
  const colors = [
    'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
    'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300',
    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
  ];

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const TransactionList: React.FC<TransactionListProps> = ({ 
    transactions, onEdit, onDelete, filterType, setFilterType, filterCategory, setFilterCategory, sortConfig, requestSort, categories, searchQuery, setSearchQuery, startDate, setStartDate, endDate, setEndDate
}) => {
    const { t, formatCurrency, formatDate } = useLanguage();
    const getSortDirection = (key: keyof Transaction) => {
        if (!sortConfig || sortConfig.key !== key) return undefined;
        return sortConfig.direction;
    }
  
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row flex-wrap items-end gap-4">
        <div className="w-full sm:flex-1">
            <label htmlFor="search-description" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                {t('transactions.list.searchLabel')}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                    id="search-description"
                    type="text"
                    placeholder={t('transactions.list.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>
        </div>
        
        <div className="w-full sm:w-auto">
            <label htmlFor="filter-type" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                {t('transactions.list.typeLabel')}
            </label>
            <Select id="filter-type" value={filterType} onChange={e => setFilterType(e.target.value as any)} className="w-full sm:w-40">
              <option value="all">{t('transactions.list.allTypes')}</option>
              <option value="income">{t('transactions.list.income')}</option>
              <option value="expense">{t('transactions.list.expense')}</option>
            </Select>
        </div>

        <div className="w-full sm:w-auto">
            <label htmlFor="filter-category" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                {t('transactions.list.categoryLabel')}
            </label>
            <Select id="filter-category" value={filterCategory} onChange={e => setFilterCategory(e.target.value as any)} className="w-full sm:w-48">
              <option value="all">{t('transactions.list.allCategories')}</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
        </div>

        <div className="w-full sm:w-auto">
            <label htmlFor="start-date" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                {t('transactions.list.startDateLabel')}
            </label>
            <Input 
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-44"
              aria-label="Start date"
            />
        </div>

        <div className="w-full sm:w-auto">
            <label htmlFor="end-date" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                {t('transactions.list.endDateLabel')}
            </label>
            <Input 
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-44"
              aria-label="End date"
            />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/20 border-b border-gray-200 dark:border-dark-border">
            <tr>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors" onClick={() => requestSort('description')}>
                <div className="flex items-center gap-1">
                  <span>{t('transactions.list.header.description')}</span>
                  <SortIcon direction={getSortDirection('description')} />
                </div>
              </th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors" onClick={() => requestSort('amount')}>
                <div className="flex items-center gap-1">
                  <span>{t('transactions.list.header.amount')}</span>
                  <SortIcon direction={getSortDirection('amount')} />
                </div>
              </th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                {t('transactions.list.header.category')}
              </th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors" onClick={() => requestSort('date')}>
                <div className="flex items-center gap-1">
                  <span>{t('transactions.list.header.date')}</span>
                  <SortIcon direction={getSortDirection('date')} />
                </div>
              </th>
              <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                {t('transactions.list.header.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                <td className="p-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-dark-text-primary">{tx.description}</td>
                <td className={`p-4 whitespace-nowrap text-sm font-medium ${tx.type === 'income' ? 'text-primary' : 'text-danger'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, { signDisplay: 'never' })}
                </td>
                <td className="p-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(tx.category)}`}>{tx.category}</span>
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-text-secondary dark:text-dark-text-secondary">{formatDate(tx.date)}</td>
                <td className="p-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-4">
                    <button onClick={() => onEdit(tx)} className="font-medium text-secondary hover:text-amber-700 dark:hover:text-amber-500">
                      {t('transactions.list.editButton')}
                    </button>
                    <button onClick={() => onDelete(tx.id)} className="font-medium text-danger hover:text-red-700">
                      {t('transactions.list.deleteButton')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center p-8 text-text-secondary dark:text-dark-text-secondary">{t('transactions.list.noTransactions')}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;