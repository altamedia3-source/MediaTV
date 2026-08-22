import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LampIllustration } from "../components/LampIllustration";
import { StudioBackground } from "../components/StudioBackground";

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLightOn, setIsLightOn] = useState(true);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah pernah terdaftar! Silakan langsung login di halaman Masuk.');
      } else if (err.code === 'auth/weak-password') {
        setError('Kata sandi terlalu lemah. Gunakan minimal 6 karakter.');
      } else {
        setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
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

        {/* Right Side: Register Card */}
        <div 
          className={`relative p-10 rounded-[32px] w-full max-w-md backdrop-blur-2xl backdrop-saturate-150 transition-all duration-1000 ease-in-out ${
            isLightOn 
            ? 'opacity-100 translate-y-0 bg-[#16161a]/60 border border-white/10 border-t-white/20 border-l-yellow-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.8),-20px_0_60px_rgba(253,230,138,0.08)]' 
            : 'opacity-0 translate-y-8 pointer-events-none blur-md bg-[#111111]/80 border border-white/5'
          }`}
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-700 text-center mb-10 tracking-wider drop-shadow-sm">Register</h1>
          
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-6">{error}</div>}
          
          <form onSubmit={handleRegister} className="space-y-6">
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
              <label className="text-[12px] text-gray-400 font-bold mb-2 block uppercase tracking-widest">Password</label>
              <input 
                type="password" required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-black/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-gray-600 text-sm shadow-inner"
                placeholder="Enter Password (Min 6 chars)"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 text-black font-extrabold py-4 rounded-2xl transition-all mt-8 text-[15px] shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-8 font-medium tracking-wide">
            Already have an account? <Link to="/login" className="text-yellow-500 hover:text-yellow-400 font-bold ml-1">Sign In</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
