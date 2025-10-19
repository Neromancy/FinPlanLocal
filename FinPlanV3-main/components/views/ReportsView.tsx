
import React, { useState, useMemo } from 'react';
import { Transaction } from '../../types.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from '../common/Select.tsx';
import Input from '../common/Input.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

// Helper functions for dates
const getISODate = (date: Date) => date.toISOString().split('T')[0];

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

const dateRanges = {
    currentMonth: {
        start: getISODate(new Date(currentYear, currentMonth, 1)),
        end: getISODate(new Date(currentYear, currentMonth + 1, 0)),
    },
    lastMonth: {
        start: getISODate(new Date(currentYear, currentMonth - 1, 1)),
        end: getISODate(new Date(currentYear, currentMonth, 0)),
    },
    last90Days: {
        start: getISODate(new Date(new Date().setDate(today.getDate() - 90))),
        end: getISODate(today),
    },
    thisYear: {
        start: getISODate(new Date(currentYear, 0, 1)),
        end: getISODate(new Date(currentYear, 11, 31)),
    },
    allTime: {
        start: '1970-01-01',
        end: getISODate(today),
    },
};

type DateRangePreset = keyof typeof dateRanges | 'custom';

// Custom label renderer for the pie chart to show percentages
const RADIAN = Math.PI / 180;
const renderPercentLabel = ({ cx, cy, midAngle, outerRadius, percent }: any) => {
  const radius = outerRadius * 0.65;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) {
    return null;
  }

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


// UI Components for this view
const StatCard: React.FC<{ title: string; value: string; color: string; }> = ({ title, value, color }) => (
    <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md">
        <h3 className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
);


const ReportsView: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const { theme } = useTheme();
    const { t, formatCurrency, formatDate } = useLanguage();
    const [preset, setPreset] = useState<DateRangePreset>('currentMonth');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    
    const { startDate, endDate } = useMemo(() => {
        if (preset === 'custom') {
            return { startDate: customStart, endDate: customEnd };
        }
        return { startDate: dateRanges[preset].start, endDate: dateRanges[preset].end };
    }, [preset, customStart, customEnd]);

    const filteredTransactions = useMemo(() => {
        if (!startDate || !endDate) return [];
        return transactions.filter(tx => tx.date >= startDate && tx.date <= endDate).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, startDate, endDate]);
    
    const { totalIncome, totalExpenses, netSavings } = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        return {
            totalIncome: income,
            totalExpenses: expenses,
            netSavings: income - expenses,
        };
    }, [filteredTransactions]);
    
    const expenseByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        filteredTransactions
            .filter(tx => tx.type === 'expense')
            .forEach(tx => {
                categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
            });
        
        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value);

    }, [filteredTransactions]);

    const trendData = useMemo(() => ([
        { name: t('reports.charts.incomeVsExpense'), income: totalIncome, expense: totalExpenses }
    ]), [totalIncome, totalExpenses, t]);
    
    const PIE_COLORS = ['#218C74', '#1ABC9C', '#B97A56', '#F39C12', '#c0392b', '#718096', '#2d3748'];
    const barColors = theme === 'light' ? { income: '#218C74', expense: '#c0392b' } : { income: '#1A6A58', expense: '#a52f22' };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mt-2">{t('reports.title')}</h2>
            
            {/* Controls */}
            <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md flex flex-wrap items-center gap-4">
                <div className="flex-grow sm:flex-grow-0">
                    <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary block mb-1">{t('reports.dateRangeLabel')}</label>
                    <Select value={preset} onChange={e => setPreset(e.target.value as DateRangePreset)} className="w-full sm:w-48">
                        <option value="currentMonth">{t('reports.ranges.currentMonth')}</option>
                        <option value="lastMonth">{t('reports.ranges.lastMonth')}</option>
                        <option value="last90Days">{t('reports.ranges.last90Days')}</option>
                        <option value="thisYear">{t('reports.ranges.thisYear')}</option>
                        <option value="allTime">{t('reports.ranges.allTime')}</option>
                        <option value="custom">{t('reports.ranges.custom')}</option>
                    </Select>
                </div>
                {preset === 'custom' && (
                    <>
                        <div className="flex-grow sm:flex-grow-0">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary block mb-1">{t('reports.startDateLabel')}</label>
                            <Input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                        </div>
                         <div className="flex-grow sm:flex-grow-0">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary block mb-1">{t('reports.endDateLabel')}</label>
                            <Input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                        </div>
                    </>
                )}
            </div>
            
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('reports.summary.totalIncome')} value={formatCurrency(totalIncome)} color="text-primary" />
                <StatCard title={t('reports.summary.totalExpenses')} value={formatCurrency(totalExpenses)} color="text-danger" />
                <StatCard title={t('reports.summary.netSavings')} value={formatCurrency(netSavings, { signDisplay: 'auto' })} color={netSavings >= 0 ? 'text-text-primary dark:text-dark-text-primary' : 'text-danger'} />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4 dark:text-dark-text-primary">{t('reports.charts.expenseBreakdown')}</h3>
                    {expenseByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie 
                                    data={expenseByCategory} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={90} 
                                    labelLine={false}
                                    label={renderPercentLabel}
                                    paddingAngle={2}
                                >
                                    {expenseByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : '#2d3748', borderColor: theme === 'light' ? '#ccc' : '#4a5568' }}/>
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-text-secondary dark:text-dark-text-secondary">{t('reports.charts.noExpenseData')}</div>
                    )}
                </div>
                <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4 dark:text-dark-text-primary">{t('reports.charts.incomeVsExpense')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={trendData} layout="vertical" barCategoryGap="25%">
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'light' ? '#e2e8f0' : '#4a5568'} />
                             <XAxis type="number" stroke={theme === 'light' ? '#4a5568' : '#a0aec0'} tickFormatter={(value) => formatCurrency(Number(value))} />
                             <YAxis type="category" dataKey="name" hide />
                             <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : '#2d3748', borderColor: theme === 'light' ? '#ccc' : '#4a5568' }} />
                             <Legend wrapperStyle={{ paddingTop: '20px' }} />
                             <Bar dataKey="income" fill={barColors.income} name={t('reports.charts.income')} radius={[0, 4, 4, 0]} barSize={35}/>
                             <Bar dataKey="expense" fill={barColors.expense} name={t('reports.charts.expense')} radius={[0, 4, 4, 0]} barSize={35}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden">
                <h3 className="text-xl font-bold p-4 dark:text-dark-text-primary">{t('reports.details.title')}</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/20 border-b border-t border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('reports.details.header.date')}</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('reports.details.header.description')}</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('reports.details.header.category')}</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider text-right">{t('reports.details.header.amount')}</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                                    <td className="p-4 whitespace-nowrap text-sm text-text-secondary dark:text-dark-text-secondary">{formatDate(tx.date)}</td>
                                    <td className="p-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-dark-text-primary">{tx.description}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-text-secondary dark:text-dark-text-secondary">{tx.category}</td>
                                    <td className={`p-4 whitespace-nowrap text-sm font-medium text-right ${tx.type === 'income' ? 'text-primary' : 'text-danger'}`}>
                                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, { signDisplay: 'never' })}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-text-secondary dark:text-dark-text-secondary">{t('reports.details.noTransactions')}</td>
                                </tr>
                            )}
                         </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default ReportsView;