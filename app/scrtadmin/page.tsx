'use client';
import { useState, useEffect } from 'react';

interface UserData {
  userId?: string;
  _id?: string;
  name: string;
  email: string;
  balance?: number;
  kycStatus?: string;
}

interface Transaction {
  trxId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const API_BASE_URL = 'https://backendmercury.vercel.app/api';

  const [customers, setCustomers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil Data Customer
      const resUsers = await fetch(`${API_BASE_URL}/admin/users`);
      if (resUsers.ok) {
        const usersData = await resUsers.json();
        setCustomers(usersData);
      }

      // Ambil Data Transaksi
      const resTrx = await fetch(`${API_BASE_URL}/admin/transactions`);
      if (resTrx.ok) {
        const trxData = await resTrx.json();
        setTransactions(trxData);
      }
    } catch (err) {
      console.error('Gagal memuat data admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTrxStatus = async (encodedTrxId: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/transactions/${encodedTrxId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchData();
        alert('Status transaksi berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui status transaksi.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const editUserBalance = async (encodedUserId: string) => {
    const val = prompt('Masukkan Saldo Baru (IDR):');
    if (val !== null && !isNaN(parseFloat(val))) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/users/${encodedUserId}/balance`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ balance: parseFloat(val) })
        });

        if (res.ok) {
          fetchData();
          alert('Saldo customer berhasil diperbarui!');
        } else {
          alert('Gagal memperbarui saldo.');
        }
      } catch (err) {
        alert('Terjadi kesalahan jaringan.');
      }
    }
  };

  // Fungsi Reset Kata Sandi Akun Nasabah
  const resetUserPassword = async (encodedUserId: string, userName: string) => {
    const newPassword = prompt(`Masukkan Kata Sandi Baru untuk nasabah (${userName}):`);
    if (newPassword !== null && newPassword.trim() !== '') {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/users/${encodedUserId}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: newPassword })
        });

        if (res.ok) {
          alert(`Kata sandi untuk ${userName} berhasil direset!`);
        } else {
          const data = await res.json();
          alert(data.message || 'Gagal mereset kata sandi.');
        }
      } catch (err) {
        alert('Terjadi kesalahan jaringan.');
      }
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">ADMIN PANEL MAHADANA</h1>
            <p className="text-xs text-slate-400">Pusat Kelola Transaksi, Saldo & Reset Kata Sandi Nasabah</p>
          </div>
          <button 
            onClick={fetchData} 
            className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-700 font-bold transition"
          >
            {loading ? 'Memuat...' : 'Refresh Data'}
          </button>
        </div>

        {/* TABEL TRANSAKSI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-white">Kelola Transaksi (Deposit / Withdraw)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="p-3">ID Trx</th>
                  <th className="p-3">Tipe</th>
                  <th className="p-3">Jumlah</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500">Tidak ada data transaksi.</td>
                  </tr>
                ) : (
                  transactions.map((trx) => {
                    const badge = trx.status === 'Berhasil' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : (trx.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30');
                    
                    return (
                      <tr key={trx.trxId} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono text-white">{trx.trxId}</td>
                        <td className={`p-3 font-bold ${trx.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>{trx.type}</td>
                        <td className="p-3 font-bold text-white">Rp {Number(trx.amount || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-slate-400 text-[10px]">{new Date(trx.createdAt).toLocaleString('id-ID')}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge}`}>{trx.status}</span></td>
                        <td className="p-3 text-center space-x-1">
                          <button onClick={() => updateTrxStatus(encodeURIComponent(trx.trxId), 'Berhasil')} className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold hover:bg-emerald-500/30 transition">Setujui</button>
                          <button onClick={() => updateTrxStatus(encodeURIComponent(trx.trxId), 'Ditolak')} className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded text-[10px] font-bold hover:bg-rose-500/30 transition">Tolak</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABEL PELANGGAN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-white">Daftar Customer / Nasabah</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="p-3">Nama / ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Saldo</th>
                  <th className="p-3">KYC</th>
                  <th className="p-3 text-center">Aksi / Pengaturan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">Tidak ada data customer.</td>
                  </tr>
                ) : (
                  customers.map((c) => {
                    const cid = c.userId || c._id || '';
                    return (
                      <tr key={cid} className="hover:bg-slate-900/50">
                        <td className="p-3">
                          <span className="font-bold text-white">{c.name}</span><br />
                          <span className="text-[10px] text-slate-500">{cid}</span>
                        </td>
                        <td className="p-3 text-slate-400">{c.email}</td>
                        <td className="p-3 font-bold text-emerald-400">Rp {(c.balance || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.kycStatus === 'Terverifikasi' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {c.kycStatus || 'Belum'}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-1">
                          <button onClick={() => editUserBalance(encodeURIComponent(cid))} className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-bold transition">
                            Edit Saldo
                          </button>
                          <button onClick={() => resetUserPassword(encodeURIComponent(cid), c.name)} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30 text-[10px] font-bold transition">
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}