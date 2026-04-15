import { createContext, useContext, useState, ReactNode } from 'react';
import { DrugData } from '../App';

interface DrugDataContextType {
  drugData: DrugData | null;
  setDrugData: (data: DrugData | null) => void;
}

const DrugDataContext = createContext<DrugDataContextType | undefined>(undefined);

export function DrugDataProvider({ children }: { children: ReactNode }) {
  const [drugData, setDrugData] = useState<DrugData | null>(null);

  return (
    <DrugDataContext.Provider value={{ drugData, setDrugData }}>
      {children}
    </DrugDataContext.Provider>
  );
}

export function useDrugData() {
  const context = useContext(DrugDataContext);
  if (!context) {
    throw new Error('useDrugData must be used within DrugDataProvider');
  }
  return context;
}
