import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, AlertTriangle, Building, Globe, TestTube2, RefreshCw, Loader2 } from 'lucide-react';

export default function SelectLocation() {
  const navigate = useNavigate();
  
  const [venueData, setVenueData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [country, setCountry] = useState('');
  const [stateName, setStateName] = useState('');
  const [city, setCity] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  const fetchVenues = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await fetch('http://localhost:8000/api/venues');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setVenueData(data);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // Dropdowns based on fetched hierarchical data
  const countries = venueData ? Object.keys(venueData) : [];
  const states = (venueData && country) ? Object.keys(venueData[country] || {}) : [];
  const cities = (venueData && country && stateName) ? Object.keys(venueData[country][stateName] || {}) : [];
  
  // Transform API events into the format expected by Dashboard
  const rawEvents = (venueData && country && stateName && city) ? (venueData[country][stateName][city] || []) : [];
  const events = rawEvents.map(evt => ({
    id: evt.name.replace(/\s+/g, '-').toLowerCase(),
    name: evt.name,
    date: "Active Deployment",
    centerLat: evt.latitude,
    centerLng: evt.longitude,
    gates: [
      { id: "North Gate", type: "primary" },
      { id: "East Wing", type: "secondary" },
      { id: "South Gate", type: "primary" },
      { id: "West Freight", type: "freight" }
    ]
  }));

  // Cascading resets
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
      localStorage.setItem('optiflow_active_venue', JSON.stringify(activeEvent));
      navigate('/dashboard', { state: { eventData: activeEvent } });
    }
  };

  const handleSandboxMode = () => {
    const sandboxEvent = {
      id: 'sandbox-sim',
      name: `Simulated Venue - ${city}`,
      date: "Active Sandbox",
      centerLat: 20.5937, 
      centerLng: 78.9629,
      gates: [
        { id: "North Gate", type: "primary" },
        { id: "East Wing", type: "secondary" },
        { id: "South Gate", type: "primary" },
        { id: "West Freight", type: "freight" }
      ]
    };
    localStorage.setItem('optiflow_active_venue', JSON.stringify(sandboxEvent));
    navigate('/dashboard', { state: { eventData: sandboxEvent } });
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex items-center space-x-3 text-indigo-600 mb-4">
          <Loader2 className="animate-spin" size={32} />
          <h2 className="text-xl font-semibold animate-pulse">Establishing secure connection to venue database...</h2>
        </div>
        <p className="text-slate-500 text-sm">Synchronizing live geographic telemetry nodes.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Failed</h2>
          <p className="text-slate-500 mb-6 text-sm">Unable to reach the OptiFlow backend API. Ensure the server is running on port 8000.</p>
          <button 
            onClick={fetchVenues}
            className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm"
          >
            <RefreshCw size={18} className="mr-2" /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

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
              <option value="" disabled>Select State/UT</option>
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

        {/* Dynamic Event Selection or Warning Banner */}
        {city && events.length === 0 ? (
          <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start mb-4">
              <AlertTriangle className="text-amber-600 mr-3 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-bold text-amber-900">No active event deployments in this city.</h4>
                <p className="text-xs text-amber-700 mt-1">There are no major registered events currently broadcasting telemetry from {city}. Click 'Load Sandbox Mode' to run a simulated venue.</p>
              </div>
            </div>
            <button 
              onClick={handleSandboxMode}
              className="w-full py-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm border border-amber-300 flex justify-center items-center transition-colors"
            >
              <TestTube2 size={16} className="mr-2" /> Load Sandbox Mode
            </button>
          </div>
        ) : (
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
        )}

        {events.length > 0 && (
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
        )}

      </div>
    </div>
  );
}
