
import React, { useMemo } from 'react';
import { Transaction, Goal, Budget } from '../../types.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  goals: Goal[];
  budgets: Budget[];
}

const IncomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-4 4m4-4l4 4" />
  </svg>
);
const ExpenseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-4-4m4 4l4-4" />
  </svg>
);
const BalanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{title}</h3>
            <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
        </div>
    </div>
);

const BAR_COLORS = ['#218C74', '#1ABC9C', '#B97A56', '#F39C12', '#c0392b', '#718096', '#2d3748'];

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals, budgets }) => {
    const { theme } = useTheme();
    const { t, formatCurrency } = useLanguage();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            const userTimezoneOffset = txDate.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(txDate.getTime() + userTimezoneOffset);
            return adjustedDate.getMonth() === currentMonth && adjustedDate.getFullYear() === currentYear;
        });
    }, [transactions, currentMonth, currentYear]);

    const { totalIncome, totalExpenses, currentBalance } = useMemo(() => {
        const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const balance = transactions.reduce((acc, tx) => acc + (tx.type === 'income' ? tx.amount : -tx.amount), 0);
        return { totalIncome: income, totalExpenses: expenses, currentBalance: balance };
    }, [monthlyTransactions, transactions]);
    
    const monthlySpendingData = useMemo(() => {
        return [
            { name: t('dashboard.budgetBreakdown.spent'), value: totalExpenses },
            { name: t('dashboard.budgetBreakdown.remaining'), value: Math.max(0, totalIncome - totalExpenses) }
        ];
    }, [totalIncome, totalExpenses, t]);
    const SPENDING_PIE_COLORS = ['#c0392b', '#218C74'];

    const expenseByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        monthlyTransactions
            .filter(tx => tx.type === 'expense')
            .forEach(tx => {
                categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
            });
        
        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value);
    }, [monthlyTransactions]);

    const budgetStatus = useMemo(() => {
        return budgets.map(budget => {
            const spent = monthlyTransactions
                .filter(tx => tx.type === 'expense' && tx.category === budget.category)
                .reduce((sum, tx) => sum + tx.amount, 0);
            return { ...budget, spent };
        }).sort((a, b) => {
            const progressA = a.limit > 0 ? (a.spent / a.limit) : 0;
            const progressB = b.limit > 0 ? (b.spent / b.limit) : 0;
            return progressB - progressA;
        });
    }, [budgets, monthlyTransactions]);

    const activeGoals = useMemo(() => goals.filter(g => !g.isCompleted), [goals]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title={t('dashboard.totalIncome')} value={formatCurrency(totalIncome)} icon={<IncomeIcon />} color="bg-primary/20 text-primary" />
                <StatCard title={t('dashboard.totalExpenses')} value={formatCurrency(totalExpenses)} icon={<ExpenseIcon />} color="bg-danger/20 text-danger" />
                <StatCard title={t('dashboard.currentBalance')} value={formatCurrency(currentBalance)} icon={<BalanceIcon />} color="bg-secondary/20 text-secondary" />
            </div>

            <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('dashboard.budgetBreakdown.title')}</h2>
                {totalIncome > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={monthlySpendingData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={70}
                                outerRadius={110} 
                                paddingAngle={5}
                            >
                                {monthlySpendingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={SPENDING_PIE_COLORS[index % SPENDING_PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : '#2d3748', borderColor: theme === 'light' ? '#ccc' : '#4a5568' }}/>
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-text-secondary dark:text-dark-text-secondary">
                        {t('dashboard.expensesByCategory.noData')}
                    </div>
                )}
            </div>

            <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('dashboard.goalsOverview.title')}</h2>
                {activeGoals.length > 0 ? (
                    <div className="space-y-4">
                       {activeGoals.slice(0, 3).map(goal => {
                           const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
                           return (
                               <div key={goal.id}>
                                   <div className="flex justify-between text-sm mb-1">
                                       <span className="font-medium">{goal.name}</span>
                                       <span className="text-text-secondary dark:text-dark-text-secondary">{formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}</span>
                                   </div>
                                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                       <div className="bg-secondary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                   </div>
                               </div>
                           );
                       })}
                    </div>
                ) : <p className="text-text-secondary dark:text-dark-text-secondary text-center py-4">{t('dashboard.goalsOverview.noActiveGoals')}</p>}
            </div>

            <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('dashboard.budgetSummary.title')}</h2>
                <div className="space-y-4">
                    {budgetStatus.length > 0 ? budgetStatus.slice(0, 3).map(budget => {
                        const progress = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
                        return (
                            <div key={budget.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{budget.category}</span>
                                    <span className="text-text-secondary dark:text-dark-text-secondary">{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${progress > 100 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${Math.min(100, progress)}%` }}></div>
                                </div>
                            </div>
                        );
                    }) : <p className="text-text-secondary dark:text-dark-text-secondary text-center py-4">{t('dashboard.budgetSummary.noBudgets')}</p>}
                </div>
            </div>

            <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('dashboard.expensesByCategory.title')}</h2>
                 {expenseByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={Math.max(150, expenseByCategory.length * 40)}>
                        <BarChart
                          layout="vertical"
                          data={expenseByCategory}
                          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'light' ? '#e2e8f0' : '#4a5568'}/>
                            <XAxis type="number" stroke={theme === 'light' ? '#4a5568' : '#a0aec0'} tickFormatter={(value) => formatCurrency(Number(value), {notation: 'compact'})} />
                            <YAxis 
                              type="category" 
                              dataKey="name" 
                              width={100} 
                              tickLine={false} 
                              axisLine={false}
                              stroke={theme === 'light' ? '#4a5568' : '#a0aec0'}
                              style={{ fontSize: '12px' }}
                            />
                            <Tooltip 
                              formatter={(value: number) => formatCurrency(value)} 
                              cursor={{fill: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}} 
                              contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : '#2d3748', borderColor: theme === 'light' ? '#ccc' : '#4a5568' }}
                            />
                            <Bar dataKey="value" name="Expenses" barSize={20}>
                                {expenseByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-text-secondary dark:text-dark-text-secondary">
                        {t('dashboard.expensesByCategory.noData')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;