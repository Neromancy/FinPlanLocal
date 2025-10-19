
import React, { useState } from 'react';
import { Budget, Transaction, Category } from '../../types.ts';
import Button from '../common/Button.tsx';
import Modal from '../common/Modal.tsx';
import BudgetList from './budgets/BudgetList.tsx';
import BudgetForm from './budgets/BudgetForm.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface BudgetsViewProps {
  budgets: Budget[];
  transactions: Transaction[];
  categories: string[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
}

const BudgetsView: React.FC<BudgetsViewProps> = ({ budgets, transactions, categories, addBudget, updateBudget, deleteBudget }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const handleOpenAddModal = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = (data: Omit<Budget, 'id' | 'category'> & { category: Category, limit: number }) => {
    if (editingBudget) {
      updateBudget({ ...editingBudget, limit: data.limit });
    } else {
      if (budgets.some(b => b.category === data.category)) {
        alert(t('budgets.form.categoryExistsError', { category: data.category }));
        return;
      }
      addBudget(data);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold mt-2">{t('budgets.title')}</h2>
        <Button onClick={handleOpenAddModal} variant="primary" className="w-full sm:w-auto">
          {t('budgets.addButton')}
        </Button>
      </div>
      <BudgetList
        budgets={budgets}
        transactions={transactions}
        onEdit={handleOpenEditModal}
        onDelete={deleteBudget}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? t('budgets.editModalTitle') : t('budgets.addModalTitle')}
      >
        <BudgetForm
          onSubmit={handleSubmit}
          categories={categories}
          existingBudgets={budgets}
          initialData={editingBudget}
        />
      </Modal>
    </div>
  );
};

export default BudgetsView;