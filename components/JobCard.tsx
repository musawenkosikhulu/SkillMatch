import React, { useState } from 'react';
import type { Job } from '../types';
import { BriefcaseIcon, MapPinIcon, WalletIcon, ShareIcon, CheckIcon } from './icons';

interface JobCardProps {
  job: Job;
  onSelectJob: (job: Job) => void;
  isSelected: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelectJob }) => {
  const [isShared, setIsShared] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from firing onSelectJob
    
    // Construct a clean URL for sharing, assuming a hash-based routing for job details
    const jobUrl = `${window.location.href.split('#')[0]}#job/${job.id}`;
    const shareData = {
      title: job.title,
      text: `Check out this job opening: ${job.title} at ${job.company.name}`,
      url: jobUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User might have cancelled the share action, so we don't need to show an error.
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy to clipboard for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(jobUrl);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000); // Reset icon after 2 seconds
      } catch (err) {
        console.error('Failed to copy link to clipboard:', err);
        alert('Failed to copy link.');
      }
    }
  };

  return (
    <div 
      onClick={() => onSelectJob(job)}
      className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500"
    >
      <div className="flex items-start gap-4">
        <img src={job.company.logo} alt={`${job.company.name} logo`} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-grow flex justify-between items-start min-w-0">
            <div className="min-w-0 mr-2">
                <p className="text-slate-500 dark:text-slate-400 text-sm">{job.company.name}</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{job.title}</h3>
            </div>
            <button
                onClick={handleShare}
                className="p-2 -mr-2 -mt-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label={isShared ? 'Link copied!' : 'Share job'}
                title={isShared ? 'Link copied!' : 'Share job'}
            >
                {isShared ? <CheckIcon /> : <ShareIcon />}
            </button>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-slate-600 dark:text-slate-300 text-sm">
        <div className="flex items-center gap-2"><MapPinIcon /><span>{job.location}</span></div>
        <div className="flex items-center gap-2"><BriefcaseIcon /><span>{job.type}</span></div>
        <div className="flex items-center gap-2"><WalletIcon /><span>{job.salary}</span></div>
      </div>
      <div className="mt-4 border-t border-slate-200 dark:border-slate-600 pt-4">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map(skill => (
            <span key={skill} className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
          ))}
          {job.skills.length > 3 && (
            <span className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full">+{job.skills.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
};