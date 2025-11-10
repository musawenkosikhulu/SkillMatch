import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SkillMatch</h3>
            <p className="text-slate-400">Connecting talent with opportunity.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Candidates</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Find Jobs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Candidate Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Job Alerts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Employers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Post a Job</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Employer Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Subscribe for Job Alerts</h4>
            <p className="text-slate-400 mb-4">Get the latest job openings delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input type="email" placeholder="Your email" className="flex-grow px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"/>
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-700 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} SkillMatch Jobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
