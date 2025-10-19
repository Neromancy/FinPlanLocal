export const id = {
  login: {
    welcome: 'Selamat datang kembali!',
    emailPlaceholder: 'Alamat Email',
    passwordPlaceholder: 'Kata Sandi',
    loginButton: 'Masuk',
    noAccount: 'Belum punya akun?',
    registerLink: 'Daftar di sini',
    error: 'Email atau kata sandi salah. Silakan coba lagi.',
    quickLogin: 'Login Cepat',
    clickToLogin: 'Klik untuk masuk',
    clickToLoginAs: 'Masuk sebagai',
    or: 'Atau',
    addAccount: 'Tambahkan Akun',
  },
  register: {
    title: 'Buat akun Anda',
    namePlaceholder: 'Nama Lengkap',
    emailPlaceholder: 'Alamat Email',
    passwordPlaceholder: 'Kata Sandi',
    registerButton: 'Buat Akun',
    hasAccount: 'Sudah punya akun?',
    loginLink: 'Masuk di sini',
    success: 'Pendaftaran berhasil! Silakan masuk.',
    error: 'Akun dengan email ini sudah ada.',
  },
  language: {
    title: 'Pilih Bahasa Anda',
    subtitle: 'Choose Your Language',
    englishButton: 'English',
    indonesianButton: 'Bahasa Indonesia',
    japaneseButton: 'Bahasa Jepang',
  },
  sidebar: {
    dashboard: 'Dasbor',
    transactions: 'Transaksi',
    goals: 'Tujuan',
    budgets: 'Anggaran',
    recurring: 'Berulang',
    categories: 'Kategori',
    reports: 'Laporan',
    profile: 'Profil',
    viewProfile: 'Lihat Profil',
    points: 'Poin',
    upgradeButton: 'Tingkatkan ke Premium',
    premiumMember: 'Anggota Premium',
    logout: 'Keluar',
  },
  profile: {
    title: 'Profil Saya',
    accountSettings: 'Pengaturan Akun',
    changePicture: 'Ganti Foto',
    nameLabel: 'Nama',
    emailLabel: 'Email',
    passwordLabel: 'Kata Sandi',
    edit: 'Ubah',
    save: 'Simpan',
    cancel: 'Batal',
    currentPassword: 'Kata Sandi Saat Ini',
    newPassword: 'Kata Sandi Baru',
    confirmPassword: 'Konfirmasi Kata Sandi Baru',
    errors: {
      currentPassword: 'Kata sandi saat ini tidak cocok.',
      passwordLength: 'Kata sandi baru harus minimal 6 karakter.',
      passwordMismatch: 'Kata sandi baru tidak cocok.',
    },
  },
  premiumModal: {
    title: 'Buka FinPlan Premium',
    description: 'Kendalikan keuangan Anda dengan fitur terkuat kami.',
    feature1: {
      title: 'Wawasan Berbasis AI',
      description: 'Dapatkan saran tujuan cerdas dan pemindaian struk otomatis.',
    },
    feature2: {
      title: 'Penganggaran Lanjutan',
      description: 'Buat anggaran terperinci dan dapatkan rencana tabungan pribadi.',
    },
    feature3: {
      title: 'Laporan Tanpa Batas',
      description: 'Hasilkan laporan keuangan komprehensif kapan saja.',
    },
    upgradeButton: 'Tingkatkan Sekarang',
  },
  dashboard: {
    title: 'Dasbor',
    totalIncome: 'Total Pemasukan',
    totalExpenses: 'Total Pengeluaran',
    currentBalance: 'Saldo Saat Ini',
    budgetBreakdown: {
      title: 'Pengeluaran Bulan Ini',
      spent: 'Dibelanjakan',
      remaining: 'Tersisa',
    },
    budgetSummary: {
        title: 'Ringkasan Anggaran',
        noBudgets: 'Tidak ada anggaran yang ditetapkan untuk bulan ini.'
    },
    goalsOverview: {
      title: 'Gambaran Tujuan',
      overallProgress: 'Kemajuan Keseluruhan',
      activeGoals: 'Tujuan Aktif',
      noActiveGoals: 'Tidak ada tujuan aktif. Saatnya menetapkan satu!',
    },
    expensesByCategory: {
      title: 'Pengeluaran Bulanan per Kategori',
      noData: 'Tidak ada data pengeluaran untuk periode ini.',
    }
  },
  transactions: {
    title: 'Transaksi',
    addTransactionButton: 'Tambah Transaksi',
    scanReceiptButton: 'Pindai Struk',
    editModalTitle: 'Ubah Transaksi',
    addModalTitle: 'Tambah Transaksi Baru',
    form: {
        description: 'Deskripsi',
        amount: 'Jumlah',
        date: 'Tanggal',
        type: 'Jenis',
        types: {
            expense: 'Pengeluaran',
            income: 'Pemasukan'
        },
        category: 'Kategori',
        aiSuggestion: {
            text: 'Saran AI:',
            confidence: 'keyakinan',
            accept: 'Terima',
            dismiss: 'Tolak',
        },
        fillAllFieldsError: 'Harap isi semua kolom.',
        saveChangesButton: 'Simpan Perubahan',
        addButton: 'Tambah Transaksi'
    },
    list: {
        searchLabel: 'Cari deskripsi',
        searchPlaceholder: 'cth., Kedai kopi',
        typeLabel: 'Jenis',
        allTypes: 'Semua Jenis',
        income: 'Pemasukan',
        expense: 'Pengeluaran',
        categoryLabel: 'Kategori',
        allCategories: 'Semua Kategori',
        startDateLabel: 'Tanggal Mulai',
        endDateLabel: 'Tanggal Selesai',
        header: {
            description: 'Deskripsi',
            amount: 'Jumlah',
            category: 'Kategori',
            date: 'Tanggal',
            actions: 'Aksi',
        },
        editButton: 'Ubah',
        deleteButton: 'Hapus',
        noTransactions: 'Tidak ada transaksi yang cocok dengan filter Anda.'
    }
  },
  goals: {
    title: 'Tujuan Tabungan',
    filters: {
        active: 'Aktif',
        completed: 'Selesai',
        all: 'Semua'
    },
    addGoalButton: 'Tambah Tujuan',
    aiSuggestButton: 'Sarankan Tujuan (AI)',
    aiLoadingButton: 'Memproses...',
    aiError: 'Gagal mendapatkan saran AI. Silakan coba lagi.',
    modalTitle: 'Tambah Tujuan Baru',
    form: {
        nameLabel: 'Nama Tujuan',
        namePlaceholder: 'cth., Liburan ke Bali',
        targetAmountLabel: 'Jumlah Target',
        targetAmountPlaceholder: 'cth., 30000000',
        addButton: 'Tambah Tujuan',
        fillAllFieldsError: 'Harap masukkan nama dan jumlah target.'
    },
    list: {
        addFunds: 'Tambah Dana',
        cancel: 'Batal',
        generatePlan: 'Buat Rencana Anggaran AI',
        refreshPlan: 'Perbarui Rencana',
        generating: 'Membuat...',
        planError: 'Gagal membuat rencana anggaran.',
        completedOn: 'Selesai pada',
        durationText: 'Butuh {{duration}} untuk tercapai',
        duration: {
            day: 'sekitar sehari',
            days: '{{count}} hari',
            month: 'sekitar sebulan',
            months: 'sekitar {{count}} bulan',
        },
        aiPlanTitle: 'Rencana Anggaran AI',
        noGoals: 'Tidak ada tujuan yang cocok dengan filter saat ini.',
        addFundsSave: 'Simpan',
        addFundsPlaceholder: 'Jumlah',
        remaining: 'Tinggal {{amount}} untuk mencapai tujuan'
    }
  },
  budgets: {
    title: 'Anggaran Bulanan',
    addButton: 'Tambah Anggaran',
    editModalTitle: 'Ubah Anggaran',
    addModalTitle: 'Tambah Anggaran Baru',
    card: {
        spent: 'Terpakai',
        limit: 'Batas',
        remaining: 'tersisa',
        overBudget: 'melebihi anggaran',
        editButton: 'Ubah',
        deleteButton: 'Hapus'
    },
    list: {
        noBudgets: "Belum ada anggaran yang ditetapkan. Klik 'Tambah Anggaran' untuk membuat yang pertama."
    },
    form: {
        categoryLabel: 'Kategori',
        limitLabel: 'Batas Bulanan',
        limitPlaceholder: 'cth., 5000000',
        error: 'Harap pilih kategori dan masukkan batas yang valid lebih besar dari 0.',
        saveButton: 'Simpan Perubahan',
        createButton: 'Buat Anggaran',
        categoryExistsError: 'Anggaran untuk "{{category}}" sudah ada.',
        noCategories: 'Tidak ada kategori yang tersedia',
        categoryUnchangeable: 'Kategori tidak dapat diubah setelah anggaran dibuat.'
    }
  },
  recurring: {
    title: 'Transaksi Berulang',
    addButton: 'Tambah Berulang',
    modalTitle: 'Transaksi Berulang Baru',
    list: {
        header: {
            status: 'Status',
            description: 'Deskripsi',
            amount: 'Jumlah',
            frequency: 'Frekuensi',
            nextDate: 'Tanggal Berikutnya',
            actions: 'Aksi'
        },
        deleteButton: 'Hapus',
        ended: 'Berakhir',
        noRecurring: 'Tidak ada transaksi berulang yang dijadwalkan.'
    },
    form: {
        descriptionLabel: 'Deskripsi',
        amountLabel: 'Jumlah',
        typeLabel: 'Jenis',
        types: {
            expense: 'Pengeluaran',
            income: 'Pemasukan'
        },
        categoryLabel: 'Kategori',
        frequencyLabel: 'Frekuensi',
        frequencies: {
            daily: 'Harian',
            weekly: 'Mingguan',
            monthly: 'Bulanan',
            yearly: 'Tahunan'
        },
        startDateLabel: 'Tanggal Mulai',
        endDateLabel: 'Tanggal Selesai (Opsional)',
        addButton: 'Tambah Jadwal',
        fillFieldsError: 'Harap isi semua kolom yang wajib diisi.'
    }
  },
  categories: {
    title: 'Kelola Kategori',
    addButton: 'Tambah Kategori Baru',
    list: {
        editButton: 'Ubah',
        deleteButton: 'Hapus',
        noCategories: 'Belum ada kategori kustom.'
    },
    deleteConfirmation: 'Apakah Anda yakin ingin menghapus kategori "{{category}}"? Semua transaksi terkait akan dipindahkan ke "Lainnya".',
    deleteOtherError: "Kategori 'Lainnya' tidak dapat dihapus.",
    modal: {
        addTitle: 'Tambah Kategori Baru',
        editTitle: 'Ubah Kategori',
        label: 'Nama Kategori',
        placeholder: 'cth., Langganan',
        cancelButton: 'Batal',
        addButton: 'Tambah Kategori',
        saveButton: 'Simpan Perubahan'
    }
  },
  reports: {
    title: 'Laporan Keuangan',
    dateRangeLabel: 'Rentang Tanggal',
    ranges: {
        currentMonth: 'Bulan Ini',
        lastMonth: 'Bulan Lalu',
        last90Days: '90 Hari Terakhir',
        thisYear: 'Tahun Ini',
        allTime: 'Semua Waktu',
        custom: 'Rentang Kustom'
    },
    startDateLabel: 'Tanggal Mulai',
    endDateLabel: 'Tanggal Selesai',
    summary: {
        totalIncome: 'Total Pemasukan',
        totalExpenses: 'Total Pengeluaran',
        netSavings: 'Tabungan Bersih'
    },
    charts: {
        expenseBreakdown: 'Rincian Pengeluaran',
        incomeVsExpense: 'Pemasukan vs. Pengeluaran',
        income: 'Pemasukan',
        expense: 'Pengeluaran',
        noExpenseData: 'Tidak ada data pengeluaran untuk periode ini.'
    },
    details: {
        title: 'Detail Transaksi',
        header: {
            date: 'Tanggal',
            description: 'Deskripsi',
            category: 'Kategori',
            amount: 'Jumlah'
        },
        noTransactions: 'Tidak ada transaksi pada periode ini.'
    }
  },
  errors: {
    noIncomeRecorded: "Saldo Saat Ini belum tersedia, mohon untuk tambah pemasukan di transaksi.",
    insufficientBalance: "Saldo Saat Ini anda tidak mencukupi, harap masukan pemasukan terlebih dahulu di transaksi."
  },
  loading: {
    processing: 'Memproses...',
    scanning: 'Memindai Struk...',
    suggestingGoals: 'Menyarankan Tujuan...',
    generatingPlan: 'Membuat Rencana AI...',
    uploading: 'Mengunggah Foto...',
  },
  premiumFeatureLock: {
    tooltip: 'Tingkatkan ke Premium untuk menggunakan fitur ini!',
  }
};