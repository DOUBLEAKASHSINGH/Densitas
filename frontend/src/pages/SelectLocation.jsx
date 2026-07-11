import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Search } from 'lucide-react';

export default function SelectLocation() {
  const navigate = useNavigate();
  const [city, setCity] = useState('Hyderabad');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  // Simulating dynamic fetch from Supabase
  useEffect(() => {
    // TODO: Replace this hardcoded array with a fetch() call to your Supabase PostgreSQL 'events' table
    // Example:
    // const { data, error } = await supabase.from('events').select('*').eq('city', city);
    // setEvents(data);
    
    if (city === 'Hyderabad') {
      const mockDbEvents = [
        "Pharma Pro & Pack Expo (Jul 9-11, 2026) - HITEX Exhibition Centre",
        "World Mithai Namkeen Convention (Jul 16-18, 2026) - HITEX Exhibition Centre",
        "Pro Wave Expo 2026 (Jul 23-25, 2026) - Classic Convention 3, Shamshabad",
        "Harris Jayaraj Live in Concert (Sep 5, 2026) - Boulder Hills"
      ];
      setEvents(mockDbEvents);
      setSelectedEvent(mockDbEvents[0]);
    } else {
      setEvents([]);
      setSelectedEvent('');
    }
  }, [city]);

  const handleEnterEvent = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-4">
      
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 w-full max-w-2xl">
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Context</h2>
        <p className="text-slate-500 mb-8 text-sm">Choose a region and active event to load the operational dashboard.</p>

        <div className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <MapPin size={16} className="mr-2 text-slate-400" /> City / Region
            </label>
            <div className="relative">
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-2 text-slate-400" /> Active Event
            </label>
            <select 
              value={selectedEvent} 
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
              disabled={events.length === 0}
            >
              {events.length > 0 ? (
                events.map((evt, idx) => (
                  <option key={idx} value={evt}>{evt}</option>
                ))
              ) : (
                <option value="">No active events found in this region</option>
              )}
            </select>
          </div>

          <button 
            onClick={handleEnterEvent}
            disabled={events.length === 0}
            className={`w-full mt-8 py-3.5 rounded-lg flex justify-center items-center transition-all font-semibold ${
              events.length > 0 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            Load Workspace <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
}
