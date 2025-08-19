'use client';

import React, { useEffect, useState } from 'react';
import getUserRecord from '@/app/actions/GetUserRecord';
import getBestWorstExpense from '@/app/actions/GetBestWorstExpense';

const ExpenseStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch both average and range data
        const [userRecordResult, rangeResult] = await Promise.all([
          getUserRecord(),
          getBestWorstExpense(),
        ]);

        const { record, daysWithRecords } = userRecordResult;
        const { bestExpense, worstExpense } = rangeResult;
        
        setStats({ record, daysWithRecords, bestExpense, worstExpense });
      } catch (err) {
        setError('Failed to load expense statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className='bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-xl p-4 sm:p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 min-h-[320px]'>
        <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-sm sm:text-lg'>📊</span>
          </div>
          <div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
              Expense Statistics
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
              Loading your spending insights...
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-xl p-4 sm:p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 min-h-[320px]'>
        <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-sm sm:text-lg'>⚠️</span>
          </div>
          <div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
              Expense Statistics
            </h3>
            <p className='text-xs text-red-500 dark:text-red-400 mt-0.5'>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { record, daysWithRecords, bestExpense, worstExpense } = stats;

    // Calculate average expense
    const validRecord = record || 0;
    const validDays =
      daysWithRecords && daysWithRecords > 0 ? daysWithRecords : 1;
    const averageExpense = validRecord / validDays;

    return (
      <div className='bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-xl p-4 sm:p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl min-h-[320px]'>
        <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-sm sm:text-lg'>📊</span>
          </div>
          <div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
              Expense Statistics
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
              Your spending insights and ranges
            </p>
          </div>
        </div>

        <div className='space-y-3 sm:space-y-4'>
          {/* Average Daily Spending */}
          <div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-3 sm:p-4 border border-gray-200/50 dark:border-gray-600/50'>
            <div className='text-center'>
              <p className='text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 tracking-wide uppercase'>
                Average Daily Spending
              </p>
              <div className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                ₹{averageExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className='inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full text-xs font-medium'>
                <span className='w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full'></span>
                Based on {validDays} days with expenses
              </div>
            </div>
          </div>

          {/* Expense Range */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
            {/* Highest Expense */}
            <div className='bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl border-l-4 border-l-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'>
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 bg-red-100 dark:bg-red-800 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <span className='text-sm leading-none text-red-600 dark:text-red-300 font-bold'>
                    ↑
                  </span>
                </div>
                <div className='flex-1'>
                  <h4 className='font-bold text-gray-900 dark:text-gray-100 text-xs mb-0.5'>
                    Highest
                  </h4>
                  <p className='text-lg font-bold text-red-600 dark:text-red-300'>
                    {bestExpense !== undefined ? `₹${bestExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'No data'}
                  </p>
                </div>
              </div>
            </div>

            {/* Lowest Expense */}
            <div className='bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl border-l-4 border-l-green-500 hover:bg-green-50 dark:hover:bg-green-900/30'>
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 bg-green-100 dark:bg-green-800 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <span className='text-sm leading-none text-green-600 dark:text-green-300 font-bold'>
                    ↓
                  </span>
                </div>
                <div className='flex-1'>
                  <h4 className='font-bold text-gray-900 dark:text-gray-100 text-xs mb-0.5'>
                    Lowest
                  </h4>
                  <p className='text-lg font-bold text-green-600 dark:text-green-300'>
                    {worstExpense !== undefined
                      ? `₹${worstExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : 'No data'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ExpenseStats;