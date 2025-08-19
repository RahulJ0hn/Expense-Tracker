'use client';
import React, { useEffect, useState } from 'react';
import getRecords from '@/app/actions/GetRecords';

const BalanceCard = () => {
  const [income, setIncome] = useState(0);
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monthlyIncome');
      setIncome(stored ? parseFloat(stored) : 0);
    }
    const fetchSpent = async () => {
      setLoading(true);
      const { records } = await getRecords();
      if (!records) {
        setSpent(0);
        setLoading(false);
        return;
      }
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const filtered = records.filter(
        (r) =>
          new Date(r.date).getMonth() === thisMonth &&
          new Date(r.date).getFullYear() === thisYear
      );
      const sum = filtered.reduce((acc, r) => acc + r.amount, 0);
      setSpent(sum);
      setLoading(false);
    };
    fetchSpent();
  }, []);

  const remaining = income - spent;
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  const daysLeft = daysInMonth - today + 1;
  const dailyLimit = daysLeft > 0 ? remaining / daysLeft : 0;

  return (
    <div className='bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-xl p-4 sm:p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl mb-4'>
      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-sm sm:text-lg'>📅</span>
        </div>
        <div>
          <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
            Monthly Balance
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Track your income, spending, and daily limit
          </p>
        </div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
        <div className='text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Income</p>
          <div className='text-lg font-bold text-gray-900 dark:text-gray-100'>₹{income.toLocaleString('en-IN')}</div>
        </div>
        <div className='text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Spent</p>
          <div className='text-lg font-bold text-red-600 dark:text-red-300'>₹{spent.toLocaleString('en-IN')}</div>
        </div>
        <div className='text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Remaining</p>
          <div className={`text-lg font-bold ${remaining < 0 ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'}`}>₹{remaining.toLocaleString('en-IN')}</div>
        </div>
        <div className='text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Daily Limit</p>
          <div className='text-lg font-bold text-emerald-600 dark:text-emerald-300'>₹{dailyLimit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        </div>
      </div>
      {loading && <div className='mt-3 text-xs text-gray-500 dark:text-gray-400'>Loading...</div>}
    </div>
  );
};

export default BalanceCard; 