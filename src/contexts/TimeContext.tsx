
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TimeContextType {
  convertedTime: string;
  convertedDate: string;
  convertedTimezone: string;
  setConvertedTime: (time: string) => void;
  setConvertedDate: (date: string) => void;
  setConvertedTimezone: (timezone: string) => void;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const useTimeContext = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTimeContext must be used within a TimeProvider');
  }
  return context;
};

export const TimeProvider = ({ children }: { children: ReactNode }) => {
  const [convertedTime, setConvertedTime] = useState("");
  const [convertedDate, setConvertedDate] = useState("");
  const [convertedTimezone, setConvertedTimezone] = useState("");

  return (
    <TimeContext.Provider
      value={{
        convertedTime,
        convertedDate,
        convertedTimezone,
        setConvertedTime,
        setConvertedDate,
        setConvertedTimezone,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};
