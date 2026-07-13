import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function useLocationContext() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }) {
  const [eventData, setEventData] = useState(() => {
    try {
      const stored = localStorage.getItem('optiflow_active_venue');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (eventData) {
      localStorage.setItem('optiflow_active_venue', JSON.stringify(eventData));
    } else {
      localStorage.removeItem('optiflow_active_venue');
    }
  }, [eventData]);

  const clearEventData = () => setEventData(null);

  const value = {
    eventData,
    setEventData,
    clearEventData
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
