import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Monitor, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError('Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Silakan ketik email Anda terlebih dahulu di kolom email.');
      return;
    }
    setError('');
    setSuccess('');
    setResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(`Link reset kata sandi telah dikirim ke ${email}. Silakan periksa inbox / spam email Anda.`);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim email reset kata sandi.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
            <Monitor className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center">Masuk ke MediaTV</h1>
          <p className="text-slate-400 text-sm mt-2">Kelola layar TV Anda dari mana saja</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-6">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl text-sm mb-6">{success}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 font-semibold mb-1 block">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input 
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="nama@email.com"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-slate-300 font-semibold">Kata Sandi</label>
              <button 
                type="button" 
                onClick={handleResetPassword} 
                disabled={resetting}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {resetting ? 'Mengirim...' : 'Lupa Kata Sandi?'}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input 
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 mt-4"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Belum punya akun? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}
