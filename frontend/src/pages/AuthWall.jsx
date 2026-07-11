import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, LogIn, Activity } from 'lucide-react';

export default function AuthWall() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    // Mock authentication success
    navigate('/select');
  };

  return (
    <div className="h-screen bg-[#030712] text-gray-100 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan to-blue-500"></div>

        <div className="flex items-center justify-center mb-8 mt-2">
          <Activity className="text-neon-cyan mr-2" size={32} />
          <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 uppercase">
            OptiFlow
          </h2>
        </div>

        <div className="flex space-x-4 mb-6 border-b border-gray-800 pb-2">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 text-sm font-bold tracking-wider uppercase transition-colors ${!isSignUp ? 'text-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 text-sm font-bold tracking-wider uppercase transition-colors ${isSignUp ? 'text-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">FULL NAME</label>
              <input type="text" placeholder="John Doe" required className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-neon-cyan transition-colors" />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">ENTERPRISE EMAIL</label>
            <input type="email" placeholder="admin@optiflow.io" required className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-neon-cyan transition-colors" />
          </div>
          
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">PASSWORD</label>
            <input type="password" placeholder="••••••••" required className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-neon-cyan transition-colors" />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">COMPANY / VENUE NAME</label>
              <input type="text" placeholder="Rajiv Gandhi Stadium" required className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:border-neon-cyan transition-colors" />
            </div>
          )}

          <button type="submit" className="w-full mt-6 bg-neon-cyan hover:bg-neon-cyan/80 text-[#030712] font-bold py-2.5 rounded-md flex justify-center items-center transition-colors shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            {!isSignUp ? <LogIn size={18} className="mr-2" /> : <User size={18} className="mr-2" />}
            {!isSignUp ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
}
