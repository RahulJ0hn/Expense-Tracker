'use client';

import React, { useEffect, useState } from 'react';
import GenerateHealthAdvice from '@/app/actions/GenerateHealthAdvice';
import { useExpenseContext } from '@/app/contexts/ExpenseContext';

const HEALTH_RISK_CATEGORIES = ['Alcohol', 'Cigarettes'];
const HIGH_RISK_THRESHOLD = 1000; // INR per month
const MODERATE_RISK_THRESHOLD = 500;

const HealthRiskInsights = () => {
  const { records } = useExpenseContext();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAIAdvice] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!records) {
        setTotal(0);
        setLoading(false);
        return;
      }
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const filtered = records.filter(
        (r) =>
          HEALTH_RISK_CATEGORIES.includes(r.category) &&
          new Date(r.date).getMonth() === thisMonth &&
          new Date(r.date).getFullYear() === thisYear
      );
      const sum = filtered.reduce((acc, r) => acc + r.amount, 0);
      setTotal(sum);
      // AI advice
      let advicePrompt = '';
      if (sum > 0) {
        advicePrompt = `I have spent ₹${sum.toLocaleString('en-IN')} on alcohol and cigarettes this month. Suggest actionable, practical ways to reduce or quit these habits, and motivate me with a short, positive message.`;
      } else {
        advicePrompt = `I have not spent anything on alcohol or cigarettes this month. Congratulate me and suggest other healthy habits or betterments I can focus on as a bachelor in India.`;
      }
      try {
        const aiMsg = await GenerateHealthAdvice(advicePrompt);
        setAIAdvice(aiMsg);
      } catch {
        setAIAdvice('');
      }
      setLoading(false);
    };
    fetchData();
  }, [records]);

  let message = '';
  let icon = '';
  let color = '';
  if (total >= HIGH_RISK_THRESHOLD) {
    icon = '⚠️';
    color = 'bg-red-50/80 dark:bg-red-900/20 border-l-red-500 text-red-800 dark:text-red-200';
    message = `You have spent ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })} on Alcohol and Cigarettes this month. This is a high-risk expense for your health. Consider reducing your consumption for a healthier lifestyle and more savings.`;
  } else if (total >= MODERATE_RISK_THRESHOLD) {
    icon = 'ℹ️';
    color = 'bg-yellow-50/80 dark:bg-yellow-900/20 border-l-yellow-500 text-yellow-800 dark:text-yellow-200';
    message = `You have spent ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })} on Alcohol and Cigarettes this month. Try to keep this under ₹${HIGH_RISK_THRESHOLD.toLocaleString('en-IN')} for better health.`;
  } else {
    icon = '✅';
    color = 'bg-green-50/80 dark:bg-green-900/20 border-l-green-500 text-green-800 dark:text-green-200';
    message = `Great job! Your spending on Alcohol and Cigarettes is low this month. Keep it up for a healthier lifestyle.`;
  }

  return (
    <div className='bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-xl p-4 sm:p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl mt-4'>
      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center'>
          <span className='text-white text-xl'>{icon}</span>
        </div>
        <div className='flex-1'>
          <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
            Health Risk Insights
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Alcohol & Cigarettes spending analysis
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className='p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-200'
          title='Refresh insights'
        >
          <svg className='w-4 h-4 text-emerald-600 dark:text-emerald-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
        </button>
      </div>
      <div className={`relative overflow-hidden rounded-xl p-3 sm:p-4 border-l-4 ${color}`}>
        <p className='text-sm'>{loading ? 'Loading...' : message}</p>
        {aiAdvice && !loading && (
          <div className='mt-3 p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-200 text-sm'>
            <span className='font-semibold'>AI Suggestion:</span> {aiAdvice}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRiskInsights; 