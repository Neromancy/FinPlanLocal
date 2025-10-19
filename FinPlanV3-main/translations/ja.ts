export const ja = {
  login: {
    welcome: 'おかえりなさい！',
    emailPlaceholder: 'メールアドレス',
    passwordPlaceholder: 'パスワード',
    loginButton: 'ログイン',
    noAccount: 'アカウントをお持ちではありませんか？',
    registerLink: 'こちらで登録',
    error: 'メールアドレスまたはパスワードが無効です。もう一度お試しください。',
    quickLogin: 'クイックログイン',
    clickToLogin: 'クリックしてログイン',
    clickToLoginAs: 'としてログイン',
    or: 'または',
    addAccount: 'アカウントを追加',
  },
  register: {
    title: 'アカウントを作成',
    namePlaceholder: '氏名',
    emailPlaceholder: 'メールアドレス',
    passwordPlaceholder: 'パスワード',
    registerButton: 'アカウント作成',
    hasAccount: 'すでにアカウントをお持ちですか？',
    loginLink: 'こちらでログイン',
    success: '登録が成功しました！ログインしてください。',
    error: 'このメールアドレスのアカウントは既に存在します。',
  },
  language: {
    title: '言語を選択してください',
    subtitle: 'Choose Your Language',
    englishButton: 'English',
    indonesianButton: 'Bahasa Indonesia',
    japaneseButton: '日本語',
  },
  sidebar: {
    dashboard: 'ダッシュボード',
    transactions: '取引',
    goals: '目標',
    budgets: '予算',
    recurring: '繰り返し',
    categories: 'カテゴリ',
    reports: 'レポート',
    profile: 'プロフィール',
    viewProfile: 'プロフィールを見る',
    points: 'ポイント',
    upgradeButton: 'プレミアムにアップグレード',
    premiumMember: 'プレミアム会員',
    logout: 'ログアウト',
  },
  profile: {
    title: 'マイプロフィール',
    accountSettings: 'アカウント設定',
    changePicture: '写真を変更',
    nameLabel: '名前',
    emailLabel: 'メール',
    passwordLabel: 'パスワード',
    edit: '編集',
    save: '保存',
    cancel: 'キャンセル',
    currentPassword: '現在のパスワード',
    newPassword: '新しいパスワード',
    confirmPassword: '新しいパスワードの確認',
    errors: {
      currentPassword: '現在のパスワードが一致しません。',
      passwordLength: '新しいパスワードは6文字以上である必要があります。',
      passwordMismatch: '新しいパスワードが一致しません。',
    },
  },
  premiumModal: {
    title: 'FinPlanプレミアムをアンロック',
    description: '最も強力な機能であなたの財政を管理しましょう。',
    feature1: {
      title: 'AIによる洞察',
      description: '賢い目標提案と自動レシートスキャンをご利用いただけます。',
    },
    feature2: {
      title: '高度な予算管理',
      description: '詳細な予算を作成し、パーソナライズされた貯蓄計画を得られます。',
    },
    feature3: {
      title: '無制限のレポート',
      description: 'いつでも包括的な財務レポートを生成できます。',
    },
    upgradeButton: '今すぐアップグレード',
  },
  dashboard: {
    title: 'ダッシュボード',
    totalIncome: '総収入',
    totalExpenses: '総支出',
    currentBalance: '現在の残高',
    budgetBreakdown: {
      title: '今月の支出',
      spent: '支出済み',
      remaining: '残り',
    },
    budgetSummary: {
      title: '予算概要',
      noBudgets: '今月の予算は設定されていません。'
    },
    goalsOverview: {
      title: '目標概要',
      overallProgress: '全体の進捗',
      activeGoals: '進行中の目標',
      noActiveGoals: '進行中の目標はありません。目標を設定しましょう！',
    },
    expensesByCategory: {
      title: 'カテゴリ別月間支出',
      noData: '今月の支出データはありません。',
    }
  },
  transactions: {
    title: '取引',
    addTransactionButton: '取引を追加',
    scanReceiptButton: 'レシートをスキャン',
    editModalTitle: '取引を編集',
    addModalTitle: '新しい取引を追加',
    form: {
        description: '説明',
        amount: '金額',
        date: '日付',
        type: '種類',
        types: {
            expense: '支出',
            income: '収入'
        },
        category: 'カテゴリ',
        aiSuggestion: {
            text: 'AIの提案:',
            confidence: '信頼度',
            accept: '承認',
            dismiss: '拒否',
        },
        fillAllFieldsError: 'すべてのフィールドを入力してください。',
        saveChangesButton: '変更を保存',
        addButton: '取引を追加'
    },
    list: {
        searchLabel: '説明で検索',
        searchPlaceholder: '例：コーヒーショップ',
        typeLabel: '種類',
        allTypes: 'すべての種類',
        income: '収入',
        expense: '支出',
        categoryLabel: 'カテゴリ',
        allCategories: 'すべてのカテゴリ',
        startDateLabel: '開始日',
        endDateLabel: '終了日',
        header: {
            description: '説明',
            amount: '金額',
            category: 'カテゴリ',
            date: '日付',
            actions: 'アクション',
        },
        editButton: '編集',
        deleteButton: '削除',
        noTransactions: 'フィルターに一致する取引はありません。'
    }
  },
  goals: {
    title: '貯蓄目標',
    filters: {
        active: '進行中',
        completed: '完了',
        all: 'すべて'
    },
    addGoalButton: '目標を追加',
    aiSuggestButton: '目標を提案 (AI)',
    aiLoadingButton: '考え中...',
    aiError: 'AIの提案を取得できませんでした。もう一度お試しください。',
    modalTitle: '新しい目標を追加',
    form: {
        nameLabel: '目標名',
        namePlaceholder: '例：バリ島への旅行',
        targetAmountLabel: '目標金額',
        targetAmountPlaceholder: '例：200000',
        addButton: '目標を追加',
        fillAllFieldsError: '名前と目標金額を入力してください。'
    },
    list: {
        addFunds: '資金を追加',
        cancel: 'キャンセル',
        generatePlan: 'AI予算計画を作成',
        refreshPlan: '計画を更新',
        generating: '生成中...',
        planError: '予算計画の作成に失敗しました。',
        completedOn: '完了日',
        durationText: '達成まで {{duration}} かかりました',
        duration: {
            day: '約1日',
            days: '{{count}}日間',
            month: '約1ヶ月',
            months: '約{{count}}ヶ月',
        },
        aiPlanTitle: 'AI予算計画',
        noGoals: '現在のフィルターに一致する目標はありません。',
        addFundsSave: '保存',
        addFundsPlaceholder: '金額',
        remaining: '目標達成まで残り{{amount}}'
    }
  },
  budgets: {
    title: '月次予算',
    addButton: '予算を追加',
    editModalTitle: '予算を編集',
    addModalTitle: '新しい予算を追加',
    card: {
        spent: '支出',
        limit: '上限',
        remaining: '残り',
        overBudget: '予算超過',
        editButton: '編集',
        deleteButton: '削除'
    },
    list: {
        noBudgets: "まだ予算が設定されていません。「予算を追加」をクリックして最初の予算を作成してください。"
    },
    form: {
        categoryLabel: 'カテゴリ',
        limitLabel: '月間上限',
        limitPlaceholder: '例:50000',
        error: 'カテゴリを選択し、0より大きい有効な上限を入力してください。',
        saveButton: '変更を保存',
        createButton: '予算を作成',
        categoryExistsError: '"{{category}}" の予算は既に存在します。',
        noCategories: '利用可能なカテゴリがありません',
        categoryUnchangeable: '予算が作成されるとカテゴリは変更できません。'
    }
  },
  recurring: {
    title: '定期的な取引',
    addButton: '定期取引を追加',
    modalTitle: '新しい定期取引',
    list: {
        header: {
            status: 'ステータス',
            description: '説明',
            amount: '金額',
            frequency: '頻度',
            nextDate: '次回日付',
            actions: 'アクション'
        },
        deleteButton: '削除',
        ended: '終了',
        noRecurring: 'スケジュールされた定期取引はありません。'
    },
    form: {
        descriptionLabel: '説明',
        amountLabel: '金額',
        typeLabel: '種類',
        types: {
            expense: '支出',
            income: '収入'
        },
        categoryLabel: 'カテゴリ',
        frequencyLabel: '頻度',
        frequencies: {
            daily: '毎日',
            weekly: '毎週',
            monthly: '毎月',
            yearly: '毎年'
        },
        startDateLabel: '開始日',
        endDateLabel: '終了日（任意）',
        addButton: 'スケジュールを追加',
        fillFieldsError: 'すべての必須フィールドを入力してください。'
    }
  },
  categories: {
    title: 'カテゴリ管理',
    addButton: '新しいカテゴリを追加',
    list: {
        editButton: '編集',
        deleteButton: '削除',
        noCategories: 'カスタムカテゴリはまだありません。'
    },
    deleteConfirmation: 'カテゴリ「{{category}}」を削除してもよろしいですか？関連するすべての取引は「その他」に移動されます。',
    deleteOtherError: "「その他」カテゴリは削除できません。",
    modal: {
        addTitle: '新しいカテゴリを追加',
        editTitle: 'カテゴリを編集',
        label: 'カテゴリ名',
        placeholder: '例：サブスクリプション',
        cancelButton: 'キャンセル',
        addButton: 'カテゴリを追加',
        saveButton: '変更を保存'
    }
  },
  reports: {
    title: '財務レポート',
    dateRangeLabel: '期間',
    ranges: {
        currentMonth: '今月',
        lastMonth: '先月',
        last90Days: '過去90日間',
        thisYear: '今年',
        allTime: '全期間',
        custom: 'カスタム範囲'
    },
    startDateLabel: '開始日',
    endDateLabel: '終了日',
    summary: {
        totalIncome: '総収入',
        totalExpenses: '総支出',
        netSavings: '純貯蓄額'
    },
    charts: {
        expenseBreakdown: '支出内訳',
        incomeVsExpense: '収入 vs. 支出',
        income: '収入',
        expense: '支出',
        noExpenseData: 'この期間の支出データはありません。'
    },
    details: {
        title: '取引詳細',
        header: {
            date: '日付',
            description: '説明',
            category: 'カテゴリ',
            amount: '金額'
        },
        noTransactions: 'この期間に取引はありません。'
    }
  },
  errors: {
    noIncomeRecorded: "現在の残高はまだ利用できません。まず収入取引を追加してください。",
    insufficientBalance: "この取引には現在の残高が不足しています。"
  },
  loading: {
    processing: '処理中...',
    scanning: 'レシートをスキャン中...',
    suggestingGoals: '目標を提案中...',
    generatingPlan: 'AIプランを生成中...',
    uploading: '写真をアップロード中...',
  },
  premiumFeatureLock: {
    tooltip: 'この機能を使用するにはプレミアムにアップグレードしてください！',
  }
};