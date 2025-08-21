'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import getRecords from '@/app/actions/GetRecords';
import { Record } from '@/types/Record';

interface ExpenseContextType {
  records: Record[];
  loading: boolean;
  refreshRecords: () => Promise<void>;
  addRecord: (record: Record) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { records: fetchedRecords } = await getRecords();
      setRecords(fetchedRecords || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecords = async () => {
    await fetchRecords();
  };

  const addRecord = (record: Record) => {
    setRecords(prev => [record, ...prev]);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <ExpenseContext.Provider value={{ records, loading, refreshRecords, addRecord }}>
      {children}
    </ExpenseContext.Provider>
  );
}; 