import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import lampImage from '../assets/images/white_desk_lamp_3d_1787417396475.jpg';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

        {/* Right Side: Register Card */}
        <div className="bg-[#242424] p-10 rounded-[32px] w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white text-center mb-10 tracking-wide">Register</h1>
          
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-6">{error}</div>}
          
          <form onSubmit={handleRegister} className="space-y-6">
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
              <label className="text-[13px] text-slate-400 font-bold mb-2 block">Password</label>
              <input 
                type="password" required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-[#181818] border border-transparent rounded-2xl text-white focus:outline-none focus:border-[#ebd08a]/50 transition-colors placeholder:text-slate-600 text-sm"
                placeholder="Enter Password (Min 6 chars)"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#ebd08a] hover:bg-[#d9bc74] disabled:opacity-50 text-black font-extrabold py-4 rounded-2xl transition-all mt-4 text-[15px]"
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8 font-medium">
            Already have an account? <Link to="/login" className="text-[#ebd08a] hover:text-[#d9bc74]">Sign In</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
