
import React, { useState, useMemo } from 'react';
import { Transaction, User, Category } from '../../types.ts';
import Button from '../common/Button.tsx';
import Modal from '../common/Modal.tsx';
import TransactionForm from './transactions/TransactionForm.tsx';
import TransactionList from './transactions/TransactionList.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { useLoading } from '../../contexts/LoadingContext.tsx';

interface TransactionsViewProps {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => string | void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  categorizeTransaction: (description: string, categories: string[]) => Promise<{ category: Category; confidence: number }>;
  scanReceipt: (imageFile: File) => Promise<{ merchant: string; total: number; date: string }>;
  categories: string[];
}

const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  categorizeTransaction,
  scanReceipt,
  categories,
}) => {
  const { t } = useLanguage();
  const { setLoadingMessage } = useLoading();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
    setFormError(null);
  };

  const handleSubmit = (data: Omit<Transaction, 'id'>) => {
    setFormError(null);
    if (editingTransaction) {
      updateTransaction({ ...editingTransaction, ...data });
      closeModal();
    } else {
      const error = addTransaction(data);
      if (error) {
        setFormError(error);
      } else {
        closeModal();
      }
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }
      if (filterCategory !== 'all' && tx.category !== filterCategory) {
        return false;
      }
      if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (startDate && tx.date < startDate) {
        return false;
      }
      if (endDate && tx.date > endDate) {
        return false;
      }
      return true;
    });
  }, [transactions, filterType, filterCategory, searchQuery, startDate, endDate]);

  const sortedTransactions = useMemo(() => {
    let sortableItems = [...filteredTransactions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTransactions, sortConfig]);

  const requestSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const findMostFrequentCategoryForMerchant = (merchant: string): Category | undefined => {
      const merchantTransactions = transactions.filter(tx => tx.description.toLowerCase().includes(merchant.toLowerCase()));
      if (merchantTransactions.length === 0) return undefined;

      const categoryCounts = merchantTransactions.reduce((acc, tx) => {
          acc[tx.category] = (acc[tx.category] || 0) + 1;
          return acc;
      }, {} as Record<Category, number>);
      
      return Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a as Category] > categoryCounts[b as Category] ? a : b) as Category;
  }

  const handleScanReceipt = async (file: File) => {
    setLoadingMessage(t('loading.scanning'));
    try {
        const data = await scanReceipt(file);
        const suggestedCategory = findMostFrequentCategoryForMerchant(data.merchant) || 'Other';
        const newTransactionData = {
            description: data.merchant,
            amount: data.total,
            type: 'expense' as const,
            category: suggestedCategory,
            date: data.date
        };
        const error = addTransaction(newTransactionData);
        if (error) {
            // If scanning succeeds but adding fails (e.g., no funds), open the modal with pre-filled data and the error.
            setEditingTransaction({ ...newTransactionData, id: 'temp-receipt' }); // Use a temporary object
            setFormError(error);
            setModalOpen(true);
        }
    } catch (error) {
        alert((error as Error).message);
    } finally {
        setLoadingMessage('');
    }
  }

  const isMobile = useMemo(() => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold mt-2">{t('transactions.title')}</h2>
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <Button onClick={() => setModalOpen(true)} variant="primary" className="w-full">
            {t('transactions.addTransactionButton')}
          </Button>
          <Button as="label" variant="secondary" className="w-full flex cursor-pointer">
              {t('transactions.scanReceiptButton')}
              <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/gif"
                  {...(isMobile && { capture: 'environment' })}
                  className="hidden" 
                  onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                         await handleScanReceipt(e.target.files[0]);
                         e.target.value = ''; // Reset file input
                      }
                  }}
              />
          </Button>
        </div>
      </div>

      <TransactionList
        transactions={sortedTransactions}
        onEdit={handleEdit}
        onDelete={deleteTransaction}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortConfig={sortConfig}
        requestSort={requestSort}
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTransaction ? t('transactions.editModalTitle') : t('transactions.addModalTitle')}>
        <TransactionForm
          onSubmit={handleSubmit}
          initialData={editingTransaction?.id === 'temp-receipt' ? { ...editingTransaction, id: ''} : editingTransaction}
          categorizeTransaction={(description) => categorizeTransaction(description, categories)}
          categories={categories}
          error={formError}
        />
      </Modal>
    </div>
  );
};

export default TransactionsView;