import React from 'react';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Display from './pages/Display';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LogOut, Monitor, Play, Settings } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Memuat...</p></div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function Landing() {
  const navigate = useNavigate();
  const [screenId, setScreenId] = useState('');
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <span className="text-slate-400 text-sm hidden sm:block">{user.email}</span>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl text-sm font-semibold transition-all">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-md space-y-6 shadow-2xl">
        <div className="flex flex-col items-center">
           <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
             <Monitor className="w-8 h-8 text-blue-400" />
           </div>
           <h1 className="text-2xl font-bold text-white text-center">Digital Signage Manager</h1>
           <p className="text-slate-400 text-sm mt-2">Pilih layar TV yang ingin dikelola</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 font-semibold mb-1 block">Masukkan Kode Layar TV (ID)</label>
            <input 
              type="text" 
              value={screenId}
              onChange={(e) => setScreenId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="contoh: lobi-utama"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button 
              onClick={() => screenId && navigate(`/dashboard/${screenId}`)}
              disabled={!screenId}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              <Settings className="w-4 h-4" /> Buka Dashboard Pengaturan
            </button>
            <button 
              onClick={() => screenId && navigate(`/display/${screenId}`)}
              disabled={!screenId}
              className="w-full bg-emerald-900/20 hover:bg-emerald-900/40 disabled:opacity-50 text-emerald-400 font-bold py-3.5 rounded-xl transition-all border border-emerald-900/50 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Buka Layar TV (Display)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard/:screenId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/display/:screenId" element={<Display />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
