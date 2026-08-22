import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import lampImage from '../assets/images/white_desk_lamp_3d_1787417396475.jpg';

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
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center p-4 font-sans">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 w-full max-w-5xl justify-center">
        
        {/* Left Side: Lamp Image */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2">
          <img 
            src={lampImage} 
            alt="Lamp" 
            className="w-full max-w-[400px] object-contain mix-blend-screen opacity-90 rounded-[40px]"
          />
        </div>

        {/* Right Side: Login Card */}
        <div className="bg-[#242424] p-10 rounded-[32px] w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white text-center mb-10 tracking-wide">Welcome</h1>
          
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-6">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl text-sm mb-6">{success}</div>}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[13px] text-slate-400 font-bold mb-2 block">Email</label>
              <input 
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-[#181818] border border-transparent rounded-2xl text-white focus:outline-none focus:border-[#ebd08a]/50 transition-colors placeholder:text-slate-600 text-sm"
                placeholder="Enter Email"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[13px] text-slate-400 font-bold block">Password</label>
                <button 
                   type="button" 
                   onClick={handleResetPassword} 
                   disabled={resetting}
                  className="text-xs text-slate-500 hover:text-[#ebd08a] transition-colors font-medium"
                >
                  {resetting ? 'Sending...' : 'Forgot?'}
                </button>
              </div>
              <input 
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-[#181818] border border-transparent rounded-2xl text-white focus:outline-none focus:border-[#ebd08a]/50 transition-colors placeholder:text-slate-600 text-sm"
                placeholder="Enter Password"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#ebd08a] hover:bg-[#d9bc74] disabled:opacity-50 text-black font-extrabold py-4 rounded-2xl transition-all mt-4 text-[15px]"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8 font-medium">
            Don't have an account? <Link to="/register" className="text-[#ebd08a] hover:text-[#d9bc74]">Register</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
