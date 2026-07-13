import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, AlertTriangle, Building, Globe, TestTube2, RefreshCw, Loader2 } from 'lucide-react';
import { useLocationContext } from '../contexts/LocationContext';
import { VENUE_CONFIG } from '../config/venues';

const INDIA_LOCATION_MATRIX = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
  "Arunachal Pradesh": ["Itanagar", "Tawang"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri"],
  // Union Territories
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry"]
};

export default function SelectLocation() {
  const navigate = useNavigate();
  
  const [country, setCountry] = useState('');
  const [stateName, setStateName] = useState('');
  const [city, setCity] = useState('');
  
  const [liveEventsData, setLiveEventsData] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  
  const { setEventData } = useLocationContext();

  // Dropdowns based on local state
  const countries = ["India"];
  const states = country === "India" ? Object.keys(INDIA_LOCATION_MATRIX) : [];
  const cities = stateName ? (INDIA_LOCATION_MATRIX[stateName] || []) : [];

  // Cascading resets
  useEffect(() => { setStateName(''); setCity(''); }, [country]);
  useEffect(() => { setCity(''); }, [stateName]);

  // Fetch live events when city changes
  useEffect(() => {
    const fetchLiveEvents = async () => {
      if (!city) {
        setLiveEventsData([]);
        setSelectedEventId('');
        return;
      }
      
      setIsLoadingEvents(true);
      setIsError(false);
      setLiveEventsData([]);
      setSelectedEventId('');
      
      try {
        const response = await fetch(`https://optiflow-backend-v0x3.onrender.com/api/events/${city}`);
        if (!response.ok) throw new Error('Failed to fetch from backend');
        const data = await response.json();
        
        // Transform incoming BookMyShow payload into Dashboard format
        const fetchedEvents = (data.events || []).map(evt => {
          // Normalize venue name for matching (e.g. "HITEX Exhibition Centre" -> "hitex-exhibition-centre")
          const normalizedVenueName = evt.venue.toLowerCase().replace(/\s+/g, '-');
          const exactConfig = VENUE_CONFIG[normalizedVenueName];

          return {
            id: evt.name.replace(/\s+/g, '-').toLowerCase(),
            name: `${evt.name} - ${evt.venue}`,
            venue: evt.venue,
            date: "Live Deployment",
            
            // Prefer exact GPS coordinates if available, fallback to backend payload
            centerLat: exactConfig ? exactConfig.centerLat : evt.latitude,
            centerLng: exactConfig ? exactConfig.centerLng : evt.longitude,
            zoom: exactConfig ? exactConfig.defaultZoom : 17,
            
            // If exact configuration is mapped, inject gates, zones, and exits
            gates: exactConfig ? exactConfig.gates : evt.gates.map((g, i) => ({
              id: g,
              type: i === 0 ? "primary" : "secondary"
            })),
            zones: exactConfig ? exactConfig.zones : null,
            exits: exactConfig ? exactConfig.exits : null,
            assemblyPoints: exactConfig ? exactConfig.assemblyPoints : null,
            medicalStations: exactConfig ? exactConfig.medicalStations : null,
            securityRooms: exactConfig ? exactConfig.securityRooms : null,
            emergencyExits: exactConfig ? exactConfig.emergencyExits : null,
            routes: exactConfig ? exactConfig.routes : null,
            polygon: exactConfig ? exactConfig.polygon : null,
            reroutes: exactConfig ? exactConfig.reroutes : null
          };
        });
        
        setLiveEventsData(fetchedEvents);
        if (fetchedEvents.length > 0) {
          setSelectedEventId(fetchedEvents[0].id);
        }
      } catch (error) {
        console.error("Live fetch error:", error);
        setIsError(true);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchLiveEvents();
  }, [city]);

  const handleEnterEvent = async () => {
    const activeEvent = liveEventsData.find(e => e.id === selectedEventId);
    if (activeEvent) {
      try {
        await fetch('https://optiflow-backend-v0x3.onrender.com/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ venue: activeEvent.venue, location_name: activeEvent.name })
        });
      } catch (e) {
        console.error("Failed to update backend session", e);
      }
      setEventData(activeEvent);
      navigate('/dashboard');
    }
  };

  const handleSandboxMode = () => {
    const sandboxEvent = {
      id: 'sandbox-sim',
      name: `Simulated Venue - ${city || 'Unknown'}`,
      venue: "Sandbox Simulation",
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
    try {
      fetch('https://optiflow-backend-v0x3.onrender.com/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue: sandboxEvent.venue, location_name: sandboxEvent.name })
      });
    } catch (e) {
      console.error("Failed to update backend session", e);
    }
    setEventData(sandboxEvent);
    navigate('/dashboard');
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
        {isLoadingEvents ? (
          <div className="mb-8 p-5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center space-x-3 text-indigo-700">
            <Loader2 className="animate-spin" size={24} />
            <h4 className="text-sm font-bold animate-pulse">Retrieving verified event spaces from database stream...</h4>
          </div>
        ) : city && (liveEventsData.length === 0 || isError) ? (
          <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start mb-4">
              <AlertTriangle className="text-amber-600 mr-3 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-bold text-amber-900">No active massive-scale events found in this region. Select another city.</h4>
                <p className="text-xs text-amber-700 mt-1">BookMyShow returned 0 active deployments in {city}. Click 'Load Sandbox Mode' to run a simulated venue instead.</p>
              </div>
            </div>
            <button 
              onClick={handleSandboxMode}
              className="w-full py-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm border border-amber-300 flex justify-center items-center transition-colors"
            >
              <TestTube2 size={16} className="mr-2" /> Load Sandbox Mode
            </button>
          </div>
        ) : city ? (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-2 text-indigo-500" /> Venue / Event
            </label>
            <select 
              value={selectedEventId} 
              onChange={(e) => setSelectedEventId(e.target.value)}
              disabled={liveEventsData.length === 0}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:bg-slate-100 disabled:text-slate-400"
            >
              {liveEventsData.map((evt) => (
                <option key={evt.id} value={evt.id}>{evt.name} ({evt.date})</option>
              ))}
            </select>
          </div>
        ) : null}

        {liveEventsData.length > 0 && (
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
