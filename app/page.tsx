'use client';
import { useState, useEffect, FormEvent } from 'react';

interface UserData {
  userId?: string;
  _id?: string;
  name: string;
  email: string;
  balance?: number;
  kycStatus?: string;
  bankInfo?: {
    bankName: string;
    accNumber: string;
    holderName: string;
  };
}

interface Transaction {
  trxId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

const watchlistData = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '$68,400.00', change: '+3.12%', positive: true, cat: 'crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: '$3,520.50', change: '+1.85%', positive: true, cat: 'crypto' },
  { symbol: 'BBCA.JK', name: 'Bank Central Asia', price: 'Rp 10,150', change: '-0.49%', positive: false, cat: 'saham-id' },
  { symbol: 'TLKM.JK', name: 'Telkom Indonesia', price: 'Rp 3,120', change: '+0.97%', positive: true, cat: 'saham-id' },
  { symbol: 'NVDA', name: 'Nvidia Corporation', price: '$128.20', change: '+4.15%', positive: true, cat: 'saham-us' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: '1.0892', change: '-0.05%', positive: false, cat: 'forex' }
];

// Kamus Terjemahan Lengkap 100% (ID, EN, ZH)
const translations: Record<string, Record<string, string>> = {
  id: {
    portalAkun: 'Portal Akun',
    masuk: 'Masuk',
    keluar: 'Keluar',
    keluarInfo: 'Anda telah keluar.',
    keuntunganMaksimal: 'KEUNTUNGAN MAKSIMAL',
    banner1Title: 'Mencapai Kesuksesan Finansial Bersama Mahadana',
    banner1Btn: 'Sistem Eksekusi Cepat',
    pasarGlobal: 'PASAR GLOBAL',
    banner2Title: 'Investasi Cerdas dalam Saham',
    banner2Btn: 'Jelajahi Pasar',
    totalSaldo: 'Total Saldo',
    aktif: 'Aktif',
    belumMasuk: 'Belum Masuk',
    dapatDitarik: 'Dapat Ditarik',
    dalamTrading: 'Dalam Trading',
    keuntungan: 'Keuntungan',
    depositSaldo: 'Deposit Saldo',
    penarikanDana: 'Penarikan Dana',
    keunggulanPlatform: 'Keunggulan Platform',
    keamananTinggi: 'Keamanan Tinggi',
    keamananDesc: 'Enkripsi ketat & terjamin.',
    dataRealtime: 'Data Real-Time',
    dataRealtimeDesc: 'Pantau harga secara langsung.',
    marketWatch: 'Market Watch & Analytics',
    hargaTerkini: 'Harga Terkini',
    tertinggi: 'Tertinggi',
    terendah: 'Terendah',
    beliBuy: 'BELI / BUY',
    jualSell: 'JUAL / SELL',
    daftarPantauan: 'Daftar Pantauan',
    beritaPasar: 'Berita Pasar Terkini',
    pusatTransaksi: 'Pusat Transaksi Dana',
    deposit: 'Deposit',
    tarik: 'Tarik',
    status: 'Status',
    jumlahIdr: 'Jumlah (IDR)',
    contohDep: 'Contoh: 500000',
    kirimDep: 'Kirim Pengajuan Deposit',
    jumlahWd: 'Jumlah Penarikan (IDR)',
    contohWd: 'Contoh: 200000',
    rekInfo: 'Nomor Rekening Bank & Nama Pemilik',
    rekPlaceholder: 'BCA - 1234567890 (Nama Pemilik)',
    ajukanWd: 'Ajukan Penarikan',
    riwayatTrx: 'Riwayat & Status Transaksi',
    terkini: 'Terkini',
    tidakAdaTrx: 'Tidak ada riwayat transaksi.',
    silakanMasuk: 'Silakan Masuk',
    masukAkses: 'Masuk untuk akses akun',
    unverified: 'Unverified',
    rekeningBankSaya: 'Informasi Rekening Bank Saya',
    pilihBank: 'Pilih Bank',
    noRek: 'Nomor Rekening Bank',
    namaPemilik: 'Nama Pemilik Rekening',
    simpanBank: 'Simpan Rekening Bank',
    hubungiKami: 'Hubungi Kami',
    masukDaftar: 'Masuk / Daftar',
    navBeranda: 'Beranda',
    navPasar: 'Pasar',
    navBerita: 'Berita',
    navTransaksi: 'Transaksi',
    navProfil: 'Profil',
    daftarAkunTab: 'Daftar Akun',
    emailId: 'Email / ID Pengguna',
    kataSandi: 'Kata Sandi',
    namaLengkap: 'Nama Lengkap',
    email: 'Email',
    daftarSekarang: 'Daftar Sekarang',
    statusDepTitle: 'Status Pengajuan Deposit',
    statusDepDesc: 'Pengajuan deposit telah dibuat, silakan hubungi layanan pelanggan.',
    jumlahDepositLabel: 'Jumlah Deposit',
    hubungiCs: 'Hubungi Layanan Pelanggan',
    tutup: 'Tutup',
    berhasil: 'Berhasil',
    kesalahan: 'Kesalahan',
    informasi: 'Informasi',
    ok: 'OK'
  },
  en: {
    portalAkun: 'Account Portal',
    masuk: 'Login',
    keluar: 'Logout',
    keluarInfo: 'You have logged out.',
    keuntunganMaksimal: 'MAXIMUM PROFIT',
    banner1Title: 'Achieving Financial Success Together with Mahadana',
    banner1Btn: 'Fast Execution System',
    pasarGlobal: 'GLOBAL MARKET',
    banner2Title: 'Smart Investment in Stocks',
    banner2Btn: 'Explore Market',
    totalSaldo: 'Total Balance',
    aktif: 'Active',
    belumMasuk: 'Not Logged In',
    dapatDitarik: 'Withdrawable',
    dalamTrading: 'In Trading',
    keuntungan: 'Profit',
    depositSaldo: 'Deposit Balance',
    penarikanDana: 'Withdraw Funds',
    keunggulanPlatform: 'Platform Advantages',
    keamananTinggi: 'High Security',
    keamananDesc: 'Strict & guaranteed encryption.',
    dataRealtime: 'Real-Time Data',
    dataRealtimeDesc: 'Monitor prices live.',
    marketWatch: 'Market Watch & Analytics',
    hargaTerkini: 'Current Price',
    tertinggi: 'Highest',
    terendah: 'Lowest',
    beliBuy: 'BUY / LONG',
    jualSell: 'SELL / SHORT',
    daftarPantauan: 'Watchlist',
    beritaPasar: 'Latest Market News',
    pusatTransaksi: 'Fund Transaction Center',
    deposit: 'Deposit',
    tarik: 'Withdraw',
    status: 'Status',
    jumlahIdr: 'Amount (IDR)',
    contohDep: 'Example: 500000',
    kirimDep: 'Submit Deposit Request',
    jumlahWd: 'Withdrawal Amount (IDR)',
    contohWd: 'Example: 200000',
    rekInfo: 'Bank Account Number & Holder Name',
    rekPlaceholder: 'BCA - 1234567890 (Holder Name)',
    ajukanWd: 'Request Withdrawal',
    riwayatTrx: 'Transaction History & Status',
    terkini: 'Latest',
    tidakAdaTrx: 'No transaction history.',
    silakanMasuk: 'Please Login',
    masukAkses: 'Login to access account',
    unverified: 'Unverified',
    rekeningBankSaya: 'My Bank Account Information',
    pilihBank: 'Select Bank',
    noRek: 'Bank Account Number',
    namaPemilik: 'Account Holder Name',
    simpanBank: 'Save Bank Account',
    hubungiKami: 'Contact Us',
    masukDaftar: 'Login / Register',
    navBeranda: 'Home',
    navPasar: 'Market',
    navBerita: 'News',
    navTransaksi: 'Transaction',
    navProfil: 'Profile',
    daftarAkunTab: 'Register Account',
    emailId: 'Email / User ID',
    kataSandi: 'Password',
    namaLengkap: 'Full Name',
    email: 'Email',
    daftarSekarang: 'Register Now',
    statusDepTitle: 'Deposit Request Status',
    statusDepDesc: 'Deposit request has been created, please contact customer service.',
    jumlahDepositLabel: 'Deposit Amount',
    hubungiCs: 'Contact Customer Service',
    tutup: 'Close',
    berhasil: 'Success',
    kesalahan: 'Error',
    informasi: 'Information',
    ok: 'OK'
  },
  zh: {
    portalAkun: '账户门户',
    masuk: '登录',
    keluar: '登出',
    keluarInfo: '您已登出。',
    keuntunganMaksimal: '最高收益',
    banner1Title: '与Mahadana共同实现财务成功',
    banner1Btn: '快速执行系统',
    pasarGlobal: '全球市场',
    banner2Title: '股票智能投资',
    banner2Btn: '探索市场',
    totalSaldo: '总余额',
    aktif: '活跃',
    belumMasuk: '未登录',
    dapatDitarik: '可提现',
    dalamTrading: '交易中',
    keuntungan: '利润',
    depositSaldo: '充值余额',
    penarikanDana: '提取资金',
    keunggulanPlatform: '平台优势',
    keamananTinggi: '高度安全',
    keamananDesc: '严格且有保障的加密。',
    dataRealtime: '实时数据',
    dataRealtimeDesc: '实时监控价格。',
    marketWatch: '市场观察与分析',
    hargaTerkini: '当前价格',
    tertinggi: '最高',
    terendah: '最低',
    beliBuy: '买入 / BUY',
    jualSell: '卖出 / SELL',
    daftarPantauan: '自选列表',
    beritaPasar: '最新市场新闻',
    pusatTransaksi: '资金交易中心',
    deposit: '充值',
    tarik: '提现',
    status: '状态',
    jumlahIdr: '金额 (IDR)',
    contohDep: '例如: 500000',
    kirimDep: '提交充值申请',
    jumlahWd: '提现金额 (IDR)',
    contohWd: '例如: 200000',
    rekInfo: '银行账号与持有人姓名',
    rekPlaceholder: 'BCA - 1234567890 (持有人姓名)',
    ajukanWd: '申请提现',
    riwayatTrx: '交易历史与状态',
    terkini: '最新',
    tidakAdaTrx: '无交易记录。',
    silakanMasuk: '请登录',
    masukAkses: '登录以访问账户',
    unverified: '未验证',
    rekeningBankSaya: '我的银行账户信息',
    pilihBank: '选择银行',
    noRek: '银行账号',
    namaPemilik: '户名',
    simpanBank: '保存银行账户',
    hubungiKami: '联系我们',
    masukDaftar: '登录 / 注册',
    navBeranda: '首页',
    navPasar: '市场',
    navBerita: '新闻',
    navTransaksi: '交易',
    navProfil: '个人资料',
    daftarAkunTab: '注册账户',
    emailId: '邮箱 / 用户ID',
    kataSandi: '密码',
    namaLengkap: '全名',
    email: '邮箱',
    daftarSekarang: '立即注册',
    statusDepTitle: '充值申请状态',
    statusDepDesc: '充值申请已创建，请联系客服。',
    jumlahDepositLabel: '充值金额',
    hubungiCs: '联系客服',
    tutup: '关闭',
    berhasil: '成功',
    kesalahan: '错误',
    informasi: '信息',
    ok: '确定'
  }
};

export default function Home() {
  const API_BASE_URL = "https://backendmercury.vercel.app";

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'chart' | 'news' | 'order' | 'profile'>('home');
  const [subTab, setSubTab] = useState<'deposit' | 'withdraw' | 'status'>('deposit');
  
  // State Bahasa (Default: 'id')
  const [currentLang, setCurrentLang] = useState<'id' | 'en' | 'zh'>('id');
  const t = (key: string) => translations[currentLang][key] || key;

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmountPop, setDepositAmountPop] = useState(0);
  const [alertModal, setAlertModal] = useState<{ open: boolean; title: string; message: string }>({ open: false, title: '', message: '' });

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFullname, setRegFullname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [depAmountInput, setDepAmountInput] = useState('');
  const [wdAmountInput, setWdAmountInput] = useState('');
  const [bankInfoInput, setBankInfoInput] = useState('');

  // Profile Bank Form
  const [userBankName, setUserBankName] = useState('BCA');
  const [userAccInput, setUserAccInput] = useState('');
  const [userHolderInput, setUserHolderInput] = useState('');

  // Transactions list
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Watchlist filter, Chart, & Timeframe states
  const [watchlistCategory, setWatchlistCategory] = useState('all');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');
  const [chartTimeframe, setChartTimeframe] = useState<'1H' | '1D' | '1W' | '1M'>('1D');

  // Load User & Scripts on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tradex_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        refreshUserData(parsed.userId || parsed._id);
      } catch (e) {
        localStorage.removeItem('tradex_user');
      }
    }

    const sliderInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4000);

    loadExternalScripts();

    return () => clearInterval(sliderInterval);
  }, []);

  // Re-trigger feather icons and chart initialization whenever activeTab, symbol, or timeframe changes
  useEffect(() => {
    setTimeout(() => {
      // @ts-expect-error window.feather declaration
      if (window.feather) window.feather.replace();
      if (activeTab === 'chart') {
        initChart(chartTimeframe, selectedSymbol);
      }
    }, 100);
  }, [activeTab, selectedSymbol, chartTimeframe]);

  const loadExternalScripts = () => {
    if (!document.getElementById('chartjs-script')) {
      const script = document.createElement('script');
      script.id = 'chartjs-script';
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      script.onload = () => initChart(chartTimeframe, selectedSymbol);
      document.body.appendChild(script);
    } else {
      setTimeout(() => initChart(chartTimeframe, selectedSymbol), 500);
    }

    if (!document.getElementById('feather-script')) {
      const fScript = document.createElement('script');
      fScript.id = 'feather-script';
      fScript.src = 'https://unpkg.com/feather-icons';
      fScript.async = true;
      fScript.onload = () => {
        // @ts-expect-error window.feather declaration
        if (window.feather) window.feather.replace();
      };
      document.body.appendChild(fScript);
    } else {
      // @ts-expect-error window.feather declaration
      if (window.feather) window.feather.replace();
    }
  };

  const initChart = (timeframe: '1H' | '1D' | '1W' | '1M', symbol: string) => {
    // @ts-expect-error Chart declaration from CDN
    const Chart = window.Chart;
    const ctx = document.getElementById('tradingChart') as HTMLCanvasElement;
    if (!ctx || !Chart) return;

    // @ts-expect-error stored instance
    if (window.myChartInstance) {
      // @ts-expect-error stored instance
      window.myChartInstance.destroy();
    }

    let labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    let baseValues = [66200, 66800, 67400, 67100, 68000, 67900, 68400];

    if (timeframe === '1H') {
      labels = ['10m', '20m', '30m', '40m', '50m', '60m'];
      baseValues = [68200, 68250, 68180, 68300, 68350, 68400];
    } else if (timeframe === '1W') {
      labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      baseValues = [65000, 66200, 65800, 67100, 67900, 68100, 68400];
    } else if (timeframe === '1M') {
      labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
      baseValues = [62000, 64500, 66000, 68400];
    }

    let dataPoints = [...baseValues];
    let borderColor = '#2563eb';
    let backgroundColor = 'rgba(37, 99, 235, 0.1)';

    if (symbol === 'ETH/USD') {
      dataPoints = baseValues.map(v => Number((v * 0.051).toFixed(2)));
      borderColor = '#8b5cf6';
      backgroundColor = 'rgba(139, 92, 246, 0.1)';
    } else if (symbol.includes('.JK')) {
      dataPoints = baseValues.map(v => Number((v * 0.15 + (symbol.includes('BBCA') ? 9500 : 3000)).toFixed(0)));
      borderColor = '#10b981';
      backgroundColor = 'rgba(16, 185, 129, 0.1)';
    } else if (symbol === 'NVDA' || symbol === 'AAPL') {
      dataPoints = baseValues.map(v => Number((v * 0.0019).toFixed(2)));
      borderColor = '#f59e0b';
      backgroundColor = 'rgba(245, 158, 11, 0.1)';
    } else if (symbol === 'EUR/USD') {
      dataPoints = baseValues.map(v => Number((1.07 + (v % 200) * 0.0001).toFixed(4)));
      borderColor = '#ec4899';
      backgroundColor = 'rgba(236, 72, 153, 0.1)';
    }

    // @ts-expect-error stored instance
    window.myChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: symbol,
          data: dataPoints,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 9 } } },
          y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748b', font: { size: 9 } } }
        }
      }
    });
  };

  const refreshUserData = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser((prev) => {
          const updated = { ...prev, ...data };
          localStorage.setItem('tradex_user', JSON.stringify(updated));
          return updated;
        });
        if (data.bankInfo) {
          setUserBankName(data.bankInfo.bankName || 'BCA');
          setUserAccInput(data.bankInfo.accNumber || '');
          setUserHolderInput(data.bankInfo.holderName || '');
          if (data.bankInfo.accNumber) {
            setBankInfoInput(`${data.bankInfo.bankName} - ${data.bankInfo.accNumber} (${data.bankInfo.holderName})`);
          }
        }
      } else if (res.status === 404) {
        localStorage.removeItem('tradex_user');
        setCurrentUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('tradex_user', JSON.stringify(data.user));
        setAuthModalOpen(false);
        showAlert(t('berhasil'), currentLang === 'en' ? 'Login successful!' : currentLang === 'zh' ? '登录成功！' : 'Masuk berhasil!');
      } else {
        showAlert(t('kesalahan'), data.message || (currentLang === 'en' ? 'Login failed' : currentLang === 'zh' ? '登录失败' : 'Masuk gagal'));
      }
    } catch (err) {
      showAlert(t('kesalahan'), currentLang === 'en' ? 'Failed to connect to server' : currentLang === 'zh' ? '连接服务器失败' : 'Gagal terhubung dengan server');
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regFullname, email: regEmail, password: regPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('tradex_user', JSON.stringify(data.user));
        setAuthModalOpen(false);
        showAlert(t('berhasil'), currentLang === 'en' ? 'Registration successful!' : currentLang === 'zh' ? '注册成功！' : 'Pendaftaran berhasil!');
      } else {
        showAlert(t('kesalahan'), data.message || (currentLang === 'en' ? 'Registration failed' : currentLang === 'zh' ? '注册失败' : 'Pendaftaran gagal'));
      }
    } catch (err) {
      showAlert(t('kesalahan'), currentLang === 'en' ? 'Failed to connect to server' : currentLang === 'zh' ? '连接服务器失败' : 'Gagal terhubung dengan server');
    }
  };

  const handleDepositAction = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return setAuthModalOpen(true);

    const amount = parseFloat(depAmountInput);
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.userId || currentUser._id,
          userName: currentUser.name,
          type: 'Deposit',
          amount,
          bankDetails: 'Deposit via Gateway/Manual'
        })
      });

      if (res.ok) {
        setDepositAmountPop(amount);
        setDepositModalOpen(true);
        setDepAmountInput('');
      } else {
        const data = await res.json();
        showAlert(t('kesalahan'), data.message || 'Pengajuan deposit gagal');
      }
    } catch (err) {
      showAlert(t('kesalahan'), 'Gagal membuat transaksi');
    }
  };

  const handleWithdrawAction = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return setAuthModalOpen(true);

    const amount = parseFloat(wdAmountInput);
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.userId || currentUser._id,
          userName: currentUser.name,
          type: 'Withdraw',
          amount,
          bankDetails: bankInfoInput || 'BCA - 1234567890'
        })
      });

      if (res.ok) {
        showAlert(t('berhasil'), currentLang === 'en' ? 'Withdrawal request sent successfully' : currentLang === 'zh' ? '提现申请发送成功' : 'Permohonan penarikan berhasil dikirim');
        setWdAmountInput('');
        setSubTab('status');
        fetchTransactions();
      } else {
        const data = await res.json();
        showAlert(t('kesalahan'), data.message || 'Penarikan gagal');
      }
    } catch (err) {
      showAlert(t('kesalahan'), 'Gagal membuat transaksi penarikan');
    }
  };

  const fetchTransactions = async () => {
    if (!currentUser) return;
    try {
      const userId = currentUser.userId || currentUser._id;
      const res = await fetch(`${API_BASE_URL}/api/transactions/user/${encodeURIComponent(userId || '')}`);
      const data = await res.json();
      if (Array.isArray(data)) setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBankSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return setAuthModalOpen(true);

    const userId = currentUser.userId || currentUser._id;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(userId || '')}/bank`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName: userBankName, accNumber: userAccInput, holderName: userHolderInput })
      });

      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
        localStorage.setItem('tradex_user', JSON.stringify(updated));
        showAlert(t('berhasil'), currentLang === 'en' ? 'Bank account saved successfully!' : currentLang === 'zh' ? '银行账户保存成功！' : 'Akun bank berhasil disimpan!');
      } else {
        showAlert(t('kesalahan'), 'Gagal menyimpan informasi bank.');
      }
    } catch (err) {
      showAlert(t('kesalahan'), 'Gagal menyimpan informasi bank');
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertModal({ open: true, title, message });
  };

  const handleLogoutLoginBtn = () => {
    if (currentUser) {
      localStorage.removeItem('tradex_user');
      setCurrentUser(null);
      showAlert(t('informasi'), t('keluarInfo'));
    } else {
      setAuthMode('login');
      setAuthModalOpen(true);
    }
  };

  const updateChartSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
    initChart(chartTimeframe, symbol);
  };

  const formattedBalance = currentUser?.balance ? `Rp ${currentUser.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}` : 'Rp 0,00';

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen pb-24">
      
      {/* TOP HEADER */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-40 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="./myylogo.png" alt="Logo Mahadana" className="h-8 w-auto object-contain" />
          <div>
            <h1 className="font-bold text-sm tracking-wide text-blue-900 leading-none">MAHADANA</h1>
            <p className="text-[10px] text-slate-500">{t('portalAkun')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Dropdown Pemilihan Bahasa 100% Berfungsi */}
          <select 
            value={currentLang} 
            onChange={(e) => setCurrentLang(e.target.value as 'id' | 'en' | 'zh')} 
            className="bg-slate-100 border border-slate-300 text-xs text-slate-700 rounded-lg px-2 py-1 outline-none focus:border-blue-500 cursor-pointer font-medium"
          >
            <option value="id">🇮🇩 ID</option>
            <option value="en">🇬🇧 EN</option>
            <option value="zh">🇨🇳 ZH</option>
          </select>

          <button 
            onClick={() => currentUser ? setActiveTab('profile') : setAuthModalOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-md shadow-blue-600/20"
          >
            {currentUser ? (currentUser.name ? currentUser.name.split(' ')[0] : 'User') : t('masuk')}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-md mx-auto p-4 space-y-5">

        {/* TAB 1: BERANDA / HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            
            {/* HERO BANNER SLIDER */}
            <div className="relative overflow-hidden rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-md">
              <div className="flex transition-transform duration-500 ease-in-out w-[200%]" style={{ transform: `translateX(-${currentSlide * 50}%)` }}>
                <div className="w-1/2 p-5 bg-cover bg-center flex flex-col justify-between space-y-3 min-h-[160px]" style={{ backgroundImage: "url('./Mybanner1.jpeg')" }}>
                  <span className="text-[10px] font-bold text-blue-700 tracking-wider bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full w-max border border-blue-200 shadow-sm">
                    {t('keuntunganMaksimal')}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight bg-white/60 p-1.5 rounded-lg backdrop-blur-[2px]">
                    {t('banner1Title')}
                  </h2>
                  <button onClick={() => setActiveTab('chart')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl w-max transition shadow-sm">
                    {t('banner1Btn')} &rarr;
                  </button>
                </div>

                <div className="w-1/2 p-5 bg-cover bg-center flex flex-col justify-between space-y-3 min-h-[160px]" style={{ backgroundImage: "url('./Mybanner2.jpeg')" }}>
                  <span className="text-[10px] font-bold text-blue-700 tracking-wider bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full w-max border border-blue-200 shadow-sm">
                    {t('pasarGlobal')}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight bg-white/60 p-1.5 rounded-lg backdrop-blur-[2px]">
                    {t('banner2Title')}
                  </h2>
                  <button onClick={() => setActiveTab('chart')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl w-max transition shadow-sm">
                    {t('banner2Btn')} &rarr;
                  </button>
                </div>
              </div>

              <div className="absolute bottom-2 right-4 flex space-x-1.5">
                <div className={`w-2 h-2 rounded-full ${currentSlide === 0 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                <div className={`w-2 h-2 rounded-full ${currentSlide === 1 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
              </div>
            </div>

            {/* RINGKASAN SALDO REAL */}
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">{t('totalSaldo')}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${currentUser ? 'text-blue-700 bg-blue-500/10 border-blue-500/20' : 'text-amber-700 bg-amber-500/10 border-amber-500/20'}`}>
                  {currentUser ? t('aktif') : t('belumMasuk')}
                </span>
              </div>
              <p className="text-2xl font-black text-blue-950">{formattedBalance}</p>
              
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div>
                  <p className="text-[10px] text-slate-500">{t('dapatDitarik')}</p>
                  <p className="text-xs font-bold text-slate-800">{formattedBalance}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">{t('dalamTrading')}</p>
                  <p className="text-xs font-bold text-slate-800">Rp 0,00</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">{t('keuntungan')}</p>
                  <p className="text-xs font-bold text-blue-600">Rp 0,00</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={() => { setActiveTab('order'); setSubTab('deposit'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center transition shadow-md shadow-blue-600/20">
                  {t('depositSaldo')}
                </button>
                <button onClick={() => { setActiveTab('order'); setSubTab('withdraw'); }} className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center transition shadow-md shadow-rose-500/20">
                  {t('penarikanDana')}
                </button>
              </div>
            </div>

            {/* KEUNGGULAN PLATFORM */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-blue-900 tracking-wider uppercase">{t('keunggulanPlatform')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <p className="font-bold text-xs text-slate-900">{t('keamananTinggi')}</p>
                  <p className="text-[10px] text-slate-500">{t('keamananDesc')}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <p className="font-bold text-xs text-slate-900">{t('dataRealtime')}</p>
                  <p className="text-[10px] text-slate-500">{t('dataRealtimeDesc')}</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PASAR / CHART */}
        {activeTab === 'chart' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedSymbol}</h2>
                    <span className="text-xs font-bold text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">+3.12%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{t('marketWatch')}</p>
                </div>
                
                <select onChange={(e) => updateChartSymbol(e.target.value)} className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500" value={selectedSymbol}>
                  <option value="BTC/USD">Bitcoin (BTC/USD)</option>
                  <option value="ETH/USD">Ethereum (ETH/USD)</option>
                  <option value="BBCA.JK">Bank BCA (IDX)</option>
                  <option value="TLKM.JK">Telkom Indonesia (IDX)</option>
                  <option value="AAPL">Apple Inc. (AAPL)</option>
                  <option value="NVDA">Nvidia Corp (NVDA)</option>
                  <option value="EUR/USD">EUR / USD (Forex)</option>
                </select>
              </div>

              {/* TIMEFRAME SELECTOR BUTTONS */}
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px]">
                {(['1H', '1D', '1W', '1M'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setChartTimeframe(tf)}
                    className={`flex-1 py-1 rounded-lg font-bold transition ${chartTimeframe === tf ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                <div>
                  <p className="text-[9px] text-slate-500">{t('hargaTerkini')}</p>
                  <p className="text-xs font-bold text-slate-900">
                    {watchlistData.find(w => w.symbol === selectedSymbol)?.price || '$68,400.00'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500">{t('tertinggi')} ({chartTimeframe})</p>
                  <p className="text-xs font-bold text-blue-600">
                    {selectedSymbol === 'BTC/USD' ? '$69,150.00' : selectedSymbol === 'ETH/USD' ? '$3,620.00' : 'Normal'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500">{t('terendah')} ({chartTimeframe})</p>
                  <p className="text-xs font-bold text-rose-600">
                    {selectedSymbol === 'BTC/USD' ? '$66,200.00' : selectedSymbol === 'ETH/USD' ? '$3,410.00' : 'Normal'}
                  </p>
                </div>
              </div>

              <div className="h-48 w-full pt-2">
                <canvas id="tradingChart"></canvas>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => { setActiveTab('order'); setSubTab('deposit'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center transition shadow-md shadow-blue-600/20">
                  {t('beliBuy')}
                </button>
                <button onClick={() => { setActiveTab('order'); setSubTab('withdraw'); }} className="bg-rose-500 hover:bg-rose-600 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center transition shadow-md shadow-rose-500/20">
                  {t('jualSell')}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-blue-900 tracking-wider uppercase">{t('daftarPantauan')}</h3>
                <div className="flex space-x-1 text-[10px] overflow-x-auto pb-1">
                  {['all', 'saham-id', 'saham-us', 'crypto', 'forex'].map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => setWatchlistCategory(cat)} 
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition ${watchlistCategory === cat ? 'bg-blue-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700'}`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {watchlistData
                  .filter((item) => watchlistCategory === 'all' || item.cat === watchlistCategory)
                  .map((item) => (
                    <div key={item.symbol} onClick={() => updateChartSymbol(item.symbol)} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-md cursor-pointer transition">
                      <div>
                        <p className="font-bold text-xs text-slate-900">{item.symbol}</p>
                        <p className="text-[10px] text-slate-500">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xs text-slate-900">{item.price}</p>
                        <p className={`text-[10px] font-bold ${item.positive ? 'text-blue-600' : 'text-rose-600'}`}>{item.change}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BERITA / NEWS */}
        {activeTab === 'news' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-blue-900 tracking-wider uppercase">{t('beritaPasar')}</h3>
            <div className="space-y-2.5">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Forex</span>
                  <span className="text-slate-400">10 menit yang lalu</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">Dolar AS Menguat Menjelang Keputusan Suku Bunga Fed</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">Pasar mata uang global menyaksikan pergerakan pesat menyusul spekulasi pengumuman kebijakan keuangan terbaru dari Federal Reserve.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Kripto</span>
                  <span className="text-slate-400">45 menit yang lalu</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">Bitcoin Menembus $68,000 Menyusul Akumulasi ETF</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">Arus masuk dana institusi ke dalam ETF Bitcoin spot terus mendorong kenaikan harga ke level tertinggi baru tahun ini.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRANSAKSI / ORDER */}
        {activeTab === 'order' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-4">
            <h2 className="text-base font-bold text-slate-900 text-center">{t('pusatTransaksi')}</h2>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button onClick={() => setSubTab('deposit')} className={`w-1/3 py-2 rounded-lg font-bold transition ${subTab === 'deposit' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>{t('deposit')}</button>
              <button onClick={() => setSubTab('withdraw')} className={`w-1/3 py-2 rounded-lg font-bold transition ${subTab === 'withdraw' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>{t('tarik')}</button>
              <button onClick={() => { setSubTab('status'); fetchTransactions(); }} className={`w-1/3 py-2 rounded-lg font-bold transition ${subTab === 'status' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>{t('status')}</button>
            </div>

            {subTab === 'deposit' && (
              <form onSubmit={handleDepositAction} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('jumlahIdr')}</label>
                  <input type="number" value={depAmountInput} onChange={(e) => setDepAmountInput(e.target.value)} required placeholder={t('contohDep')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20">
                  {t('kirimDep')}
                </button>
              </form>
            )}

            {subTab === 'withdraw' && (
              <form onSubmit={handleWithdrawAction} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('jumlahWd')}</label>
                  <input type="number" value={wdAmountInput} onChange={(e) => setWdAmountInput(e.target.value)} required placeholder={t('contohWd')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('rekInfo')}</label>
                  <input type="text" value={bankInfoInput} onChange={(e) => setBankInfoInput(e.target.value)} required placeholder={t('rekPlaceholder')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500" />
                </div>
                <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-rose-500/20">
                  {t('ajukanWd')}
                </button>
              </form>
            )}

            {subTab === 'status' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-700">{t('riwayatTrx')}</h4>
                  <span className="text-[10px] text-slate-400">{t('terkini')}</span>
                </div>
                <div className="space-y-2">
                  {transactions.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">{t('tidakAdaTrx')}</p>
                  ) : (
                    transactions.map((trx) => (
                      <div key={trx.trxId} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className={`font-bold ${trx.type === 'Deposit' ? 'text-blue-600' : 'text-rose-600'}`}>{trx.type}</span>
                            <span className="text-[10px] text-slate-400">{trx.trxId}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{new Date(trx.createdAt).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">Rp {trx.amount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${trx.status === 'Berhasil' ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' : trx.status === 'Ditolak' ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20' : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'}`}>
                            {trx.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFIL / PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-base">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-900">{currentUser?.name || t('silakanMasuk')}</h3>
                  <p className="text-[11px] text-slate-500">{currentUser?.email || t('masukAkses')}</p>
                  <span className="inline-block mt-1 text-[9px] bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                    {currentUser?.kycStatus || t('unverified')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => { setActiveTab('order'); setSubTab('deposit'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition">
                  {t('deposit')}
                </button>
                <button onClick={() => { setActiveTab('order'); setSubTab('withdraw'); }} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs border border-slate-200 transition">
                  {t('tarik')}
                </button>
              </div>
            </div>

            <form onSubmit={handleBankSave} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-3">
              <h4 className="font-bold text-xs text-slate-900 flex items-center">
                {t('rekeningBankSaya')}
              </h4>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">{t('pilihBank')}</label>
                <select value={userBankName} onChange={(e) => setUserBankName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500">
                  <option value="BCA">BCA (Bank Central Asia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                  <option value="BNI">BNI (Bank Negara Indonesia)</option>
                  <option value="CIMB Niaga">CIMB Niaga</option>
                  <option value="Permata Bank">Permata Bank</option>
                  <option value="Bank Danamon">Bank Danamon</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">{t('noRek')}</label>
                <input type="text" value={userAccInput} onChange={(e) => setUserAccInput(e.target.value)} required placeholder="1234567890" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">{t('namaPemilik')}</label>
                <input type="text" value={userHolderInput} onChange={(e) => setUserHolderInput(e.target.value)} required placeholder="Nama Anda" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold py-2 rounded-xl text-xs transition">
                {t('simpanBank')}
              </button>
            </form>

            <div className="space-y-2">
              <a href="https://wa.me/00000" target="_blank" className="w-full bg-white border border-slate-200 text-slate-700 p-3 rounded-xl flex items-center justify-between transition shadow-sm hover:border-blue-300">
                <span className="text-xs font-bold">{t('hubungiKami')}</span>
              </a>
              <button onClick={handleLogoutLoginBtn} className="w-full bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 p-3 rounded-xl font-bold text-xs transition">
                {currentUser ? t('keluar') : t('masukDaftar')}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION BAR WITH FEATHER ICONS */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2.5 z-40 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around items-center text-[10px]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="home" className="w-5 h-5"></i>
            <span>{t('navBeranda')}</span>
          </button>
          <button onClick={() => setActiveTab('chart')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'chart' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="bar-chart-2" className="w-5 h-5"></i>
            <span>{t('navPasar')}</span>
          </button>
          <button onClick={() => setActiveTab('news')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'news' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="globe" className="w-5 h-5"></i>
            <span>{t('navBerita')}</span>
          </button>
          <button onClick={() => setActiveTab('order')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'order' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="credit-card" className="w-5 h-5"></i>
            <span>{t('navTransaksi')}</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="user" className="w-5 h-5"></i>
            <span>{t('navProfil')}</span>
          </button>
        </div>
      </nav>

      {/* AUTHENTICATION MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-5 space-y-4 relative shadow-2xl">
            <button onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              ✕
            </button>

            <div className="flex border-b border-slate-200 pb-2">
              <button onClick={() => setAuthMode('login')} className={`w-1/2 text-center pb-1 text-xs font-bold ${authMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>
                {t('masuk')}
              </button>
              <button onClick={() => setAuthMode('register')} className={`w-1/2 text-center pb-1 text-xs font-bold ${authMode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>
                {t('daftarAkunTab')}
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('emailId')}</label>
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('kataSandi')}</label>
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20">
                  {t('masuk')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('namaLengkap')}</label>
                  <input type="text" value={regFullname} onChange={(e) => setRegFullname(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('email')}</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('kataSandi')}</label>
                  <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20">
                  {t('daftarSekarang')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DEPOSIT POPUP MODAL */}
      {depositModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xs rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <div>
              <h3 className="font-bold text-sm text-slate-900">{t('statusDepTitle')}</h3>
              <p className="text-xs text-slate-500 mt-1">{t('statusDepDesc')}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] text-slate-400">{t('jumlahDepositLabel')}</p>
              <p className="text-base font-extrabold text-blue-600">Rp {depositAmountPop.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="space-y-2">
              <button onClick={() => window.open('https://wa.me/00000', '_blank')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition">
                {t('hubungiCs')}
              </button>
              <button onClick={() => setDepositModalOpen(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition">
                {t('tutup')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ALERT MODAL */}
      {alertModal.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xs rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <div>
              <h3 className="font-bold text-sm text-slate-900">{alertModal.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{alertModal.message}</p>
            </div>
            <button onClick={() => setAlertModal({ open: false, title: '', message: '' })} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition">
              {t('ok')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
