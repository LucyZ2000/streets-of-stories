// SessionStateContext.js
import React, { createContext, useContext, useState } from 'react';

const SessionStateContext = createContext();

export const useSessionState = () => {
  const context = useContext(SessionStateContext);
  if (!context) {
    throw new Error('useSessionState must be used within a SessionStateProvider');
  }
  return context;
};

export const SessionStateProvider = ({ children }) => {
  const [sessionState, setSessionState] = useState({
    // Info overlay state
    isInfoExpanded: true,
    
    // Music state
    isMusicEnabled: true,
    musicVolume: 0.3,
    isMusicPlaying: false,
    
    // You can add more persistent states here as needed
  });

  const updateSessionState = (updates) => {
    setSessionState(prev => ({ ...prev, ...updates }));
  };

  return (
    <SessionStateContext.Provider value={{ sessionState, updateSessionState }}>
      {children}
    </SessionStateContext.Provider>
  );
};