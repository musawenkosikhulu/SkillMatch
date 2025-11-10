import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <a href="#" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M18 8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h12Z"/></svg>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">SkillMatch</span>
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">Find Jobs</a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">Companies</a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">Upskill</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 transition-colors">Log In</button>
            <button className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
