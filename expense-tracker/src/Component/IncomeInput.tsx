'use client';
import React, { useEffect, useState } from 'react';

const IncomeInput = () => {
  const [income, setIncome] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monthlyIncome');
      return stored ? parseFloat(stored) : 0;
    }
    return 0;
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    setInput(income ? income.toString() : '');
  }, [income]);

  const handleSave = () => {
    const value = parseFloat(input);
    if (!isNaN(value) && value >= 0) {
      setIncome(value);
      localStorage.setItem('monthlyIncome', value.toString());
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('incomeUpdated', { detail: value }));
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-xl p-4 sm:p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl mb-4 w-full'>
      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-sm sm:text-lg'>💸</span>
        </div>
        <div>
          <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
            Monthly Income
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Enter your monthly salary or income
          </p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <span className='text-lg font-bold'>₹</span>
        <input
          type='number'
          min='0'
          value={input}
          onChange={e => setInput(e.target.value)}
          className='w-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' // Hide spinners
          placeholder='Enter amount'
        />
        <button
          onClick={handleSave}
          className='px-4 py-2 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-200'
        >
          Save
        </button>
      </div>
      {income > 0 && (
        <div className='mt-3 text-sm text-gray-700 dark:text-gray-300'>
          Current monthly income: <span className='font-bold'>₹{income.toLocaleString('en-IN')}</span>
        </div>
      )}
    </div>
  );
};

export default IncomeInput; 