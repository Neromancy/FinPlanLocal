
import React, { useState } from 'react';
import { RecurringTransaction } from '../../types.ts';
import Button from '../common/Button.tsx';
import Modal from '../common/Modal.tsx';
import RecurringTransactionForm from './recurring/RecurringTransactionForm.tsx';
import RecurringTransactionList from './recurring/RecurringTransactionList.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface RecurringTransactionsViewProps {
  recurringTransactions: RecurringTransaction[];
  addRecurringTransaction: (rtx: Omit<RecurringTransaction, 'id'>) => void;
  toggleRecurringTransaction: (id: string) => void;
  deleteRecurringTransaction: (id: string) => void;
  categories: string[];
}

const RecurringTransactionsView: React.FC<RecurringTransactionsViewProps> = ({
  recurringTransactions,
  addRecurringTransaction,
  toggleRecurringTransaction,
  deleteRecurringTransaction,
  categories,
}) => {
  const { t } = useLanguage();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mt-2">{t('recurring.title')}</h2>
        <Button onClick={() => setModalOpen(true)} variant="primary">
          {t('recurring.addButton')}
        </Button>
      </div>

      <RecurringTransactionList
        recurringTransactions={recurringTransactions}
        onToggle={toggleRecurringTransaction}
        onDelete={deleteRecurringTransaction}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={t('recurring.modalTitle')}>
        <RecurringTransactionForm
          onSubmit={(rtx) => {
            addRecurringTransaction(rtx);
            setModalOpen(false);
          }}
          categories={categories}
        />
      </Modal>
    </div>
  );
};

export default RecurringTransactionsView;