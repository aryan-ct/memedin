'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CameraContextType {
  selectedEmployeeId: string | null;
  selectEmployee: (id: string | null) => void;
  savedImage: string | null;
  saveImage: (imageData: string) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: ReactNode }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);

  // Sync state with localStorage for cross-tab communication
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'selectedEmployeeId') {
        setSelectedEmployeeId(e.newValue);
      }
      if (e.key === 'savedImage') {
        setSavedImage(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);

    // Load initial state
    const storedEmployeeId = localStorage.getItem('selectedEmployeeId');
    if (storedEmployeeId) {
      setSelectedEmployeeId(storedEmployeeId);
    }

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const selectEmployee = (id: string | null) => {
    setSelectedEmployeeId(id);
    if (id) {
      localStorage.setItem('selectedEmployeeId', id);
    } else {
      localStorage.removeItem('selectedEmployeeId');
    }
  };

  const saveImage = (imageData: string) => {
    setSavedImage(imageData);
    localStorage.setItem('savedImage', imageData);
  };

  return (
    <CameraContext.Provider
      value={{
        selectedEmployeeId,
        selectEmployee,
        savedImage,
        saveImage,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
}

export function useCameraContext() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCameraContext must be used within a CameraProvider');
  }
  return context;
}
