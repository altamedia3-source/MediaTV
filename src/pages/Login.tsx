import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LampIllustration } from "../components/LampIllustration";
import { StudioBackground } from "../components/StudioBackground";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [isLightOn, setIsLightOn] = useState(true);
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
    <div className="min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden relative bg-black">
      <StudioBackground isLightOn={isLightOn} />

      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 w-full max-w-5xl justify-center relative z-10">
        
        {/* Left Side: Lamp Image */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2">
          <LampIllustration isOn={isLightOn} onToggle={() => setIsLightOn(!isLightOn)} />
        </div>

        {/* Right Side: Login Card */}
        <div 
          className={`relative p-10 rounded-[32px] w-full max-w-md backdrop-blur-2xl backdrop-saturate-150 transition-all duration-1000 ease-in-out ${
            isLightOn 
            ? 'opacity-100 translate-y-0 bg-[#16161a]/60 border border-white/10 border-t-white/20 border-l-yellow-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.8),-20px_0_60px_rgba(253,230,138,0.08)]' 
            : 'opacity-0 translate-y-8 pointer-events-none blur-md bg-[#111111]/80 border border-white/5'
          }`}
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-700 text-center mb-10 tracking-wider drop-shadow-sm">Welcome</h1>
          
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-6">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl text-sm mb-6">{success}</div>}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[12px] text-gray-400 font-bold mb-2 block uppercase tracking-widest">Email</label>
              <input 
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-black/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-gray-600 text-sm shadow-inner"
                placeholder="Enter Email"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[12px] text-gray-400 font-bold block uppercase tracking-widest">Password</label>
                <button 
                   type="button" 
                   onClick={handleResetPassword} 
                   disabled={resetting}
                  className="text-xs text-yellow-600/80 hover:text-yellow-400 transition-colors font-semibold tracking-wide"
                >
                  {resetting ? 'Sending...' : 'Forgot?'}
                </button>
              </div>
              <input 
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-black/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-gray-600 text-sm shadow-inner"
                placeholder="Enter Password"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 text-black font-extrabold py-4 rounded-2xl transition-all mt-8 text-[15px] shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-8 font-medium tracking-wide">
            Don't have an account? <Link to="/register" className="text-yellow-500 hover:text-yellow-400 font-bold ml-1">Register</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
