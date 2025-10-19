export enum View {
  Dashboard = 'Dashboard',
  Transactions = 'Transactions',
  Goals = 'Goals',
  Budgets = 'Budgets',
  Recurring = 'Recurring',
  Categories = 'Categories',
  Reports = 'Reports',
  Profile = 'Profile',
}

export type TransactionType = 'income' | 'expense';
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type Category = string;

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // YYYY-MM-DD
  recurringId?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  isCompleted: boolean;
  createdAt: string; // YYYY-MM-DD
  completedAt?: string; // YYYY-MM-DD
  aiPlan?: string;
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  frequency: Frequency;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  isActive: boolean;
}

export interface User {
  isPremium: boolean;
  points: number;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
}

export interface RegisteredUser {
    id: string;
    name: string;
    email: string;
    password: string;
    language?: 'en' | 'id' | 'ja';
    profilePictureUrl?: string;
}