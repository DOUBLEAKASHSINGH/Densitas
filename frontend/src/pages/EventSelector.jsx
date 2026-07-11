import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function EventSelector() {
  const navigate = useNavigate();
  const [city, setCity] = useState('Hyderabad');
  const [event, setEvent] = useState('IPL T20 Match - Rajiv Gandhi International Cricket Stadium, Uppal');

  const handleEnterEvent = () => {
    const role = localStorage.getItem('optiflow_role') || 'Attendee';
    if (role === 'Organiser') {
      navigate('/dashboard/organiser');
    } else {
      navigate('/dashboard/attendee');
    }
  };

  return (
    <div className="h-screen bg-[#030712] text-gray-100 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-10 shadow-2xl z-10 w-full max-w-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan to-blue-500 rounded-t-xl"></div>
        
        <h2 className="text-3xl font-bold tracking-widest text-white uppercase mb-2">Contextual Selection</h2>
        <p className="text-gray-400 mb-8 font-mono text-sm">Select the region and active event to configure your workspace.</p>

        <div className="space-y-6">
          
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 flex items-center"><MapPin size={14} className="mr-2 text-neon-cyan" /> SELECT CITY</label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-3 text-gray-100 focus:outline-none focus:border-neon-cyan transition-colors cursor-pointer appearance-none"
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 flex items-center"><Calendar size={14} className="mr-2 text-blue-500" /> ACTIVE EVENTS</label>
            <select 
              value={event} 
              onChange={(e) => setEvent(e.target.value)}
              className="w-full bg-[#030712] border border-gray-700 rounded-md px-4 py-3 text-gray-100 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
            >
              {city === 'Hyderabad' ? (
                <>
                  <option value="IPL T20 Match - Rajiv Gandhi International Cricket Stadium, Uppal">IPL T20 Match - Rajiv Gandhi International Cricket Stadium, Uppal</option>
                  <option value="Music Festival - Gachibowli Stadium">Music Festival - Gachibowli Stadium</option>
                </>
              ) : (
                <option value="No active events">No active events in this region</option>
              )}
            </select>
          </div>

          <button 
            onClick={handleEnterEvent}
            disabled={city !== 'Hyderabad'}
            className={`w-full mt-8 py-4 rounded-md flex justify-center items-center transition-all font-bold tracking-widest uppercase ${
              city === 'Hyderabad' 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Load Configuration & Enter Event <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
}
