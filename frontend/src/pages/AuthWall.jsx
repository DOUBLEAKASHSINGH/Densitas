import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Activity, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AuthWall() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  
  // UI State
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem('optiflow_user_profile', JSON.stringify({ name, email }));
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        if (!localStorage.getItem('optiflow_user_profile')) {
           localStorage.setItem('optiflow_user_profile', JSON.stringify({ name: 'Admin User', email }));
        }
      }
      
      // On success, navigate to dashboard if returning, or onboarding if new
      if (localStorage.getItem('optiflow_active_venue')) {
        navigate('/dashboard');
      } else {
        navigate('/select-location');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setIsLoading(false);
    }
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
        
        <div className="flex space-x-2 mb-6 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isSignUp ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isSignUp ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 text-sm">
            <AlertCircle size={16} className="mr-2 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe" 
                required 
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@optiflow.io" 
              required 
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full mt-8 text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-colors shadow-sm ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isLoading ? (
               <span className="flex items-center">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Processing...
               </span>
            ) : (
               <>
                 {!isSignUp ? <LogIn size={18} className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
                 {!isSignUp ? 'Sign In to Workspace' : 'Create Account'}
               </>
            )}
          </button>
        </form>
        
      </div>
      
      <p className="mt-8 text-sm text-slate-500">
        By continuing, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
