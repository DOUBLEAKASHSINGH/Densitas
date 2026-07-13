import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ArrowLeft, Camera, Shield, Mail, Calendar, Clock, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { auth } from '../config/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { clearEventData } = useLocationContext();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.name || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        photoURL: photoURL.trim()
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    clearEventData();
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Safe fallback getters for user metadata
  const userCreationTime = auth.currentUser?.metadata?.creationTime 
    ? new Date(auth.currentUser.metadata.creationTime).toLocaleString()
    : "Unknown";
    
  const userLastLoginTime = auth.currentUser?.metadata?.lastSignInTime 
    ? new Date(auth.currentUser.metadata.lastSignInTime).toLocaleString()
    : "Unknown";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-sky-500"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="relative">
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm bg-slate-100" />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-sm bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <User size={40} />
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 text-sm font-semibold rounded-lg transition-colors border border-slate-200 hover:border-red-200"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">{displayName || "Anonymous User"}</h2>
              <div className="flex items-center text-slate-500 mt-1">
                <Shield size={14} className="mr-1.5" />
                <span className="text-sm font-medium">Enterprise Administrator</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Form Section */}
              <div className="md:col-span-2 space-y-6">
                
                {message && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start text-green-700 text-sm">
                    <CheckCircle size={16} className="mr-2 shrink-0 mt-0.5" />
                    <span>{message}</span>
                  </div>
                )}
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 text-sm">
                    <AlertCircle size={16} className="mr-2 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Camera size={16} />
                      </div>
                      <input 
                        type="url" 
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">Paste a direct link to an image file (e.g. from LinkedIn or GitHub).</p>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className={`flex items-center px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                      {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Read Only Meta Data Section */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100 h-fit">
                <div>
                  <div className="flex items-center text-slate-400 text-xs font-bold tracking-wider mb-1 uppercase">
                    <Mail size={12} className="mr-1.5" />
                    Registered Email
                  </div>
                  <p className="text-sm font-medium text-slate-800 break-all">{auth.currentUser?.email || "N/A"}</p>
                </div>
                
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center text-slate-400 text-xs font-bold tracking-wider mb-1 uppercase">
                    <Calendar size={12} className="mr-1.5" />
                    Account Created
                  </div>
                  <p className="text-sm font-medium text-slate-800">{userCreationTime}</p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center text-slate-400 text-xs font-bold tracking-wider mb-1 uppercase">
                    <Clock size={12} className="mr-1.5" />
                    Last Login
                  </div>
                  <p className="text-sm font-medium text-slate-800">{userLastLoginTime}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
