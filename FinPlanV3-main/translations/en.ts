export const en = {
  login: {
    welcome: 'Welcome back!',
    emailPlaceholder: 'Email Address',
    passwordPlaceholder: 'Password',
    loginButton: 'Login',
    noAccount: "Don't have an account?",
    registerLink: 'Register here',
    error: 'Invalid email or password. Please try again.',
    quickLogin: 'Quick Login',
    clickToLogin: 'Click to log in',
    clickToLoginAs: 'Log in as',
    or: 'Or',
    addAccount: 'Add Account',
  },
  register: {
    title: 'Create your account',
    namePlaceholder: 'Full Name',
    emailPlaceholder: 'Email Address',
    passwordPlaceholder: 'Password',
    registerButton: 'Create Account',
    hasAccount: 'Already have an account?',
    loginLink: 'Login here',
    success: 'Registration successful! Please log in.',
    error: 'An account with this email already exists.',
  },
  language: {
    title: 'Choose Your Language',
    subtitle: 'Pilih Bahasa Anda',
    englishButton: 'English',
    indonesianButton: 'Bahasa Indonesia',
    japaneseButton: 'Japanese',
  },
  sidebar: {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    goals: 'Goals',
    budgets: 'Budgets',
    recurring: 'Recurring',
    categories: 'Categories',
    reports: 'Reports',
    profile: 'Profile',
    viewProfile: 'View Profile',
    points: 'Points',
    upgradeButton: 'Upgrade to Premium',
    premiumMember: 'Premium Member',
    logout: 'Logout',
  },
  profile: {
    title: 'My Profile',
    accountSettings: 'Account Settings',
    changePicture: 'Change Picture',
    nameLabel: 'Name',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    errors: {
      currentPassword: 'Current password does not match.',
      passwordLength: 'New password must be at least 6 characters.',
      passwordMismatch: 'New passwords do not match.',
    },
  },
  premiumModal: {
    title: 'Unlock FinPlan Premium',
    description: 'Take control of your finances with our most powerful features.',
    feature1: {
      title: 'AI-Powered Insights',
      description: 'Get smart goal suggestions and automatic receipt scanning.',
    },
    feature2: {
      title: 'Advanced Budgeting',
      description: 'Create detailed budgets and get personalized savings plans.',
    },
    feature3: {
      title: 'Unlimited Reports',
      description: 'Generate comprehensive financial reports anytime.',
    },
    upgradeButton: 'Upgrade Now',
  },
  dashboard: {
    title: 'Dashboard',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    currentBalance: 'Current Balance',
    budgetBreakdown: {
      title: "This Month's Spending",
      spent: 'Spent',
      remaining: 'Remaining',
    },
    budgetSummary: {
      title: 'Budget Summary',
      noBudgets: 'No budgets set for this month.'
    },
    goalsOverview: {
      title: 'Goals Overview',
      overallProgress: 'Overall Progress',
      activeGoals: 'Active Goals',
      noActiveGoals: 'No active goals. Time to set one!',
    },
    expensesByCategory: {
      title: 'Monthly Expenses by Category',
      noData: 'No expense data for this month.',
    }
  },
  transactions: {
    title: 'Transactions',
    addTransactionButton: 'Add Transaction',
    scanReceiptButton: 'Scan Receipt',
    editModalTitle: 'Edit Transaction',
    addModalTitle: 'Add New Transaction',
    form: {
        description: 'Description',
        amount: 'Amount',
        date: 'Date',
        type: 'Type',
        types: {
            expense: 'Expense',
            income: 'Income'
        },
        category: 'Category',
        aiSuggestion: {
            text: 'AI Suggestion:',
            confidence: 'confidence',
            accept: 'Accept',
            dismiss: 'Dismiss',
        },
        fillAllFieldsError: 'Please fill all fields.',
        saveChangesButton: 'Save Changes',
        addButton: 'Add Transaction'
    },
    list: {
        searchLabel: 'Search description',
        searchPlaceholder: 'e.g., Coffee shop',
        typeLabel: 'Type',
        allTypes: 'All Types',
        income: 'Income',
        expense: 'Expense',
        categoryLabel: 'Category',
        allCategories: 'All Categories',
        startDateLabel: 'Start Date',
        endDateLabel: 'End Date',
        header: {
            description: 'Description',
            amount: 'Amount',
            category: 'Category',
            date: 'Date',
            actions: 'Actions',
        },
        editButton: 'Edit',
        deleteButton: 'Delete',
        noTransactions: 'No transactions match your filters.'
    }
  },
  goals: {
    title: 'Savings Goals',
    filters: {
        active: 'Active',
        completed: 'Completed',
        all: 'All'
    },
    addGoalButton: 'Add Goal',
    aiSuggestButton: 'Suggest Goals (AI)',
    aiLoadingButton: 'Thinking...',
    aiError: 'Failed to get AI suggestions. Please try again.',
    modalTitle: 'Add New Goal',
    form: {
        nameLabel: 'Goal Name',
        namePlaceholder: 'e.g., Vacation to Bali',
        targetAmountLabel: 'Target Amount',
        targetAmountPlaceholder: 'e.g., 2000',
        addButton: 'Add Goal',
        fillAllFieldsError: 'Please enter a name and target amount.'
    },
    list: {
        addFunds: 'Add Funds',
        cancel: 'Cancel',
        generatePlan: 'Generate AI Budget Plan',
        refreshPlan: 'Refresh Plan',
        generating: 'Generating...',
        planError: 'Failed to generate budget plan.',
        completedOn: 'Completed on',
        durationText: 'Took {{duration}} to achieve',
        duration: {
            day: 'about a day',
            days: '{{count}} days',
            month: 'about a month',
            months: 'about {{count}} months',
        },
        aiPlanTitle: 'AI Budget Plan',
        noGoals: 'No goals match the current filter.',
        addFundsSave: 'Save',
        addFundsPlaceholder: 'Amount',
        remaining: '{{amount}} left to reach goal'
    }
  },
  budgets: {
    title: 'Monthly Budgets',
    addButton: 'Add Budget',
    editModalTitle: 'Edit Budget',
    addModalTitle: 'Add New Budget',
    card: {
        spent: 'Spent',
        limit: 'Limit',
        remaining: 'remaining',
        overBudget: 'over budget',
        editButton: 'Edit',
        deleteButton: 'Delete'
    },
    list: {
        noBudgets: "No budgets set yet. Click 'Add Budget' to create your first one."
    },
    form: {
        categoryLabel: 'Category',
        limitLabel: 'Monthly Limit',
        limitPlaceholder: 'e.g., 500',
        error: 'Please select a category and enter a valid limit greater than 0.',
        saveButton: 'Save Changes',
        createButton: 'Create Budget',
        categoryExistsError: 'A budget for "{{category}}" already exists.',
        noCategories: 'No available categories',
        categoryUnchangeable: 'Category cannot be changed once a budget is created.'
    }
  },
  recurring: {
    title: 'Recurring Transactions',
    addButton: 'Add Recurring',
    modalTitle: 'New Recurring Transaction',
    list: {
        header: {
            status: 'Status',
            description: 'Description',
            amount: 'Amount',
            frequency: 'Frequency',
            nextDate: 'Next Date',
            actions: 'Actions'
        },
        deleteButton: 'Delete',
        ended: 'Ended',
        noRecurring: 'No recurring transactions scheduled.'
    },
    form: {
        descriptionLabel: 'Description',
        amountLabel: 'Amount',
        typeLabel: 'Type',
        types: {
            expense: 'Expense',
            income: 'Income'
        },
        categoryLabel: 'Category',
        frequencyLabel: 'Frequency',
        frequencies: {
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            yearly: 'Yearly'
        },
        startDateLabel: 'Start Date',
        endDateLabel: 'End Date (Optional)',
        addButton: 'Add Schedule',
        fillFieldsError: 'Please fill all required fields.'
    }
  },
  categories: {
    title: 'Manage Categories',
    addButton: 'Add New Category',
    list: {
        editButton: 'Edit',
        deleteButton: 'Delete',
        noCategories: 'No custom categories yet.'
    },
    deleteConfirmation: 'Are you sure you want to delete the category "{{category}}"? All associated transactions will be moved to "Other".',
    deleteOtherError: "The 'Other' category cannot be deleted.",
    modal: {
        addTitle: 'Add New Category',
        editTitle: 'Edit Category',
        label: 'Category Name',
        placeholder: 'e.g., Subscriptions',
        cancelButton: 'Cancel',
        addButton: 'Add Category',
        saveButton: 'Save Changes'
    }
  },
  reports: {
    title: 'Financial Reports',
    dateRangeLabel: 'Date Range',
    ranges: {
        currentMonth: 'Current Month',
        lastMonth: 'Last Month',
        last90Days: 'Last 90 Days',
        thisYear: 'This Year',
        allTime: 'All Time',
        custom: 'Custom Range'
    },
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    summary: {
        totalIncome: 'Total Income',
        totalExpenses: 'Total Expenses',
        netSavings: 'Net Savings'
    },
    charts: {
        expenseBreakdown: 'Expense Breakdown',
        incomeVsExpense: 'Income vs. Expense',
        income: 'Income',
        expense: 'Expense',
        noExpenseData: 'No expense data for this period.'
    },
    details: {
        title: 'Transaction Details',
        header: {
            date: 'Date',
            description: 'Description',
            category: 'Category',
            amount: 'Amount'
        },
        noTransactions: 'No transactions in this period.'
    }
  },
  errors: {
    noIncomeRecorded: "Current Balance is not yet available. Please add an income transaction first.",
    insufficientBalance: "Your Current Balance is insufficient for this transaction."
  },
  loading: {
    processing: 'Processing...',
    scanning: 'Scanning Receipt...',
    suggestingGoals: 'Suggesting Goals...',
    generatingPlan: 'Generating AI Plan...',
    uploading: 'Uploading Picture...',
  },
  premiumFeatureLock: {
    tooltip: 'Upgrade to Premium to use this feature!',
  }
};