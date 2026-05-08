import { createContext, useContext, useState } from "react";

const StationContext = createContext();

export const StationProvider = ({ children }) => {
  const [lastStations, setLastStations] = useState([]);

  const value = {
    lastStations,
    setLastStations,
  };

  return (
    <StationContext.Provider value={value}>
      {children}
    </StationContext.Provider>
  );
};

export const useStations = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error("useStations must be used within a StationProvider");
  }
  return context;
};

export default StationContext;
