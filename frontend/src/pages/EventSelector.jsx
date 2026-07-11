import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Settings } from 'lucide-react';

export default function EventSelector() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#030712] text-gray-100 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <h2 className="text-3xl font-bold tracking-widest text-white uppercase mb-2 z-10">Select Context</h2>
      <p className="text-gray-400 mb-10 z-10 font-mono text-sm">Active Event: Rajiv Gandhi Stadium - Live Concert</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 w-full max-w-4xl px-8">
        
        {/* Attendee Card */}
        <div 
          onClick={() => navigate('/dashboard/attendee')}
          className="bg-[#111827] border border-gray-800 hover:border-blue-500 rounded-xl p-8 cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] group"
        >
          <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users size={32} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Join as Attendee</h3>
          <p className="text-gray-400 text-sm">
            Access the simplified public dashboard to view safe evacuation routes, general capacity, and live map updates.
          </p>
        </div>

        {/* Organiser Card */}
        <div 
          onClick={() => navigate('/dashboard/organiser')}
          className="bg-[#111827] border border-gray-800 hover:border-neon-cyan rounded-xl p-8 cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] group"
        >
          <div className="bg-neon-cyan/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Settings size={32} className="text-neon-cyan" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Enter Command Center</h3>
          <p className="text-gray-400 text-sm">
            Access the full OptiFlow suite. View raw telemetry, agent processing pipelines, predictive models, and rule engines.
          </p>
        </div>

      </div>
    </div>
  );
}
