import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, AlertTriangle, Building, Globe } from 'lucide-react';

const LOCAL_LOCATION_DATA = {
  "India": {
    "Telangana": {
      "Hyderabad": [
        {
          id: 'pharma-pro',
          name: "Pharma Pro & Pack Expo - HITEX Exhibition Centre",
          date: "Jul 9-11, 2026",
          centerLat: 17.4727,
          centerLng: 78.3725,
          gates: [
            { id: "Main Entry", type: "primary" },
            { id: "Hall 1 Gate", type: "secondary" },
            { id: "Hall 3 Gate", type: "secondary" },
            { id: "Cargo Gate", type: "freight" }
          ]
        },
        {
          id: 'harris-live',
          name: "Harris Jayaraj Live - Boulder Hills",
          date: "Sep 5, 2026",
          centerLat: 17.4255,
          centerLng: 78.3410,
          gates: [
            { id: "VVIP Gate", type: "primary" },
            { id: "General Pass Gate", type: "secondary" }
          ]
        }
      ],
      "Warangal": []
    },
    "Maharashtra": {
      "Mumbai": [],
      "Pune": []
    }
  },
  "United States": {
    "California": {
      "San Francisco": [],
      "Los Angeles": []
    }
  }
};

export default function SelectLocation() {
  const navigate = useNavigate();
  
  const [country, setCountry] = useState('');
  const [stateName, setStateName] = useState('');
  const [city, setCity] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  // Dropdown options based on current selections
  const countries = Object.keys(LOCAL_LOCATION_DATA);
  const states = country ? Object.keys(LOCAL_LOCATION_DATA[country] || {}) : [];
  const cities = stateName ? Object.keys(LOCAL_LOCATION_DATA[country][stateName] || {}) : [];
  const events = city ? (LOCAL_LOCATION_DATA[country][stateName][city] || []) : [];

  // Reset downstream selections when a parent changes
  useEffect(() => { setStateName(''); setCity(''); setSelectedEventId(''); }, [country]);
  useEffect(() => { setCity(''); setSelectedEventId(''); }, [stateName]);
  useEffect(() => { 
    if (events.length > 0) {
      setSelectedEventId(events[0].id);
    } else {
      setSelectedEventId('');
    }
  }, [city]);

  const handleEnterEvent = () => {
    const activeEvent = events.find(e => e.id === selectedEventId);
    if (activeEvent) {
      // Pass the fully structured event data via router state
      navigate('/dashboard', { state: { eventData: activeEvent } });
    }
  };

  return (
    <div className="h-full w-full bg-slate-50 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
      
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10 w-full max-w-3xl">
        
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Location Context</h2>
        <p className="text-slate-500 mb-8 text-sm md:text-base">Configure the command center viewport by selecting an active geographic region.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Globe size={16} className="mr-2 text-indigo-500" /> Country
            </label>
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="" disabled>Select Country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* State Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <MapPin size={16} className="mr-2 text-indigo-500" /> State / Region
            </label>
            <select 
              value={stateName} 
              onChange={(e) => setStateName(e.target.value)}
              disabled={!country}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="" disabled>Select State</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* City Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Building size={16} className="mr-2 text-indigo-500" /> City
            </label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              disabled={!stateName}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="" disabled>Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

        </div>

        {/* Dynamic Event Warning Banner */}
        {city && events.length === 0 && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
            <AlertTriangle className="text-amber-500 mr-3 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-amber-800">No Active Event Locations Found</h4>
              <p className="text-xs text-amber-700 mt-1">There are no major events currently broadcasting telemetry from this city. Please select a different region.</p>
            </div>
          </div>
        )}

        {/* Event Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
            <Calendar size={16} className="mr-2 text-indigo-500" /> Venue / Event
          </label>
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={events.length === 0}
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:bg-slate-100 disabled:text-slate-400"
          >
            {events.length > 0 ? (
              events.map((evt) => (
                <option key={evt.id} value={evt.id}>{evt.name} ({evt.date})</option>
              ))
            ) : (
              <option value="">Awaiting valid city selection...</option>
            )}
          </select>
        </div>

        <button 
          onClick={handleEnterEvent}
          disabled={!selectedEventId}
          className={`w-full py-4 rounded-xl flex justify-center items-center transition-all font-bold text-lg ${
            selectedEventId
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          Initialize Dashboard Workspace <ArrowRight size={20} className="ml-2" />
        </button>

      </div>
    </div>
  );
}
