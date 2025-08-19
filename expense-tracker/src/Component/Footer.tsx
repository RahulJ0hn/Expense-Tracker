import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      className='relative overflow-hidden border-t border-gray-100/50 dark:border-gray-700/50'
    >
      {/* Gradient accent line */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {/* Logo and Tagline */}
          <div>
            <div className='inline-flex items-center gap-2 mb-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
                <span className='text-white text-lg'>💰</span>
              </div>
              <h2 className='text-xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent'>
                ExpenseTracker AI
              </h2>
            </div>
            <p style={{ color: 'var(--foreground)' }} className='leading-relaxed max-w-sm text-sm'>
              Intelligent financial management powered by AI. Track your
              expenses, manage your budget, and gain insights into your spending
              patterns.
            </p>
          </div>
          {/* Features */}
          <div>
            <h3 style={{ color: 'var(--foreground)' }} className='text-lg font-semibold mb-2'>
              Features
            </h3>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm' style={{ color: 'var(--foreground)' }}>
                <div className='w-5 h-5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-md flex items-center justify-center shadow-sm'>
                  <span className='text-white text-xs'>🤖</span>
                </div>
                AI-Powered Insights
              </div>
              <div className='flex items-center gap-2 text-sm' style={{ color: 'var(--foreground)' }}>
                <div className='w-5 h-5 bg-gradient-to-br from-green-500 to-teal-500 rounded-md flex items-center justify-center shadow-sm'>
                  <span className='text-white text-xs'>✨</span>
                </div>
                Smart Categorization
              </div>
              <div className='flex items-center gap-2 text-sm' style={{ color: 'var(--foreground)' }}>
                <div className='w-5 h-5 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-md flex items-center justify-center shadow-sm'>
                  <span className='text-white text-xs'>📊</span>
                </div>
                Analytics Dashboard
              </div>
            </div>
          </div>
          {/* Author/Contact */}
          <div className='flex flex-col items-start justify-start md:items-end md:justify-end'>
            <p style={{ color: 'var(--foreground)' }} className='text-sm'>
              <span className='font-semibold'>Made by Rahul John J</span><br/>
              <span>Contact: <a href='tel:+919994551908' className='underline'>9994551908</a> | <a href='mailto:rahuljohn1211@gmail.com' className='underline'>rahuljohn1211@gmail.com</a></span>
            </p>
          </div>
        </div>
        <div className='w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-2'></div>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='text-center md:text-left mb-2 md:mb-0'>
            <p style={{ color: 'var(--foreground)' }} className='text-xs'>
              © {new Date().getFullYear()} ExpenseTracker AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;