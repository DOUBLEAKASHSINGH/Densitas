import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Activity } from 'lucide-react';

export default function AuthWall() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    // Route to location selection after successful auth
    navigate('/select-location');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center p-4">
      
      {/* Brand Header */}
      <div className="flex items-center justify-center mb-8">
        <Activity className="text-indigo-600 mr-2" size={36} />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          OptiFlow
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 w-full max-w-md">
        
        <div className="flex space-x-2 mb-8 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isSignUp ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isSignUp ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" placeholder="Jane Doe" required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
            <input type="email" placeholder="jane@optiflow.io" required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" placeholder="••••••••" required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
          </div>

          <button type="submit" className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-colors shadow-sm">
            {!isSignUp ? <LogIn size={18} className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
            {!isSignUp ? 'Sign In to Workspace' : 'Create Account'}
          </button>
        </form>
        
      </div>
      
      <p className="mt-8 text-sm text-slate-500">
        By continuing, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
