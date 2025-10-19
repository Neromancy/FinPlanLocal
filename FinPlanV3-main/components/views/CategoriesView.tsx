
import React, { useState } from 'react';
import Button from '../common/Button.tsx';
import Modal from '../common/Modal.tsx';
import Input from '../common/Input.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface CategoriesViewProps {
  categories: string[];
  addCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  deleteCategory: (category: string) => void;
}

const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, addCategory, updateCategory, deleteCategory }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentCategory, setCurrentCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const openAddModal = () => {
    setModalMode('add');
    setCurrentCategory('');
    setNewCategoryName('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: string) => {
    setModalMode('edit');
    setCurrentCategory(category);
    setNewCategoryName(category);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;

    if (modalMode === 'add') {
      addCategory(newCategoryName.trim());
    } else {
      updateCategory(currentCategory, newCategoryName.trim());
    }
    setIsModalOpen(false);
  };
  
  const handleDelete = (category: string) => {
    if (category === 'Other') {
      alert(t('categories.deleteOtherError'));
      return;
    }
    if (window.confirm(t('categories.deleteConfirmation', { category }))) {
      deleteCategory(category);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold mt-2">{t('categories.title')}</h2>
        <Button onClick={openAddModal} variant="primary" className="w-full sm:w-auto">
          {t('categories.addButton')}
        </Button>
      </div>
      
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md">
        <ul className="divide-y divide-gray-200 dark:divide-dark-border">
          {categories.length > 0 ? categories.map(category => (
            <li key={category} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
              <span className="font-medium dark:text-dark-text-primary">{category}</span>
              <div className="flex gap-2">
                <Button onClick={() => openEditModal(category)} size="sm" variant="ghost">{t('categories.list.editButton')}</Button>
                <Button onClick={() => handleDelete(category)} size="sm" variant="danger" disabled={category === 'Other'}>{t('categories.list.deleteButton')}</Button>
              </div>
            </li>
          )) : (
            <li className="p-8 text-center text-text-secondary dark:text-dark-text-secondary">{t('categories.list.noCategories')}</li>
          )}
        </ul>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'add' ? t('categories.modal.addTitle') : t('categories.modal.editTitle')}
      >
        <form onSubmit={handleModalSubmit} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{t('categories.modal.label')}</label>
            <Input 
              id="category-name" 
              value={newCategoryName} 
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder={t('categories.modal.placeholder')}
              required 
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>{t('categories.modal.cancelButton')}</Button>
            <Button type="submit">{modalMode === 'add' ? t('categories.modal.addButton') : t('categories.modal.saveButton')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesView;