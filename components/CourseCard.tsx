import React from 'react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <a href={course.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-100 dark:bg-slate-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
      <h4 className="font-semibold text-slate-800 dark:text-white">{course.title}</h4>
      <p className="text-sm text-blue-600 dark:text-blue-400">{course.provider}</p>
    </a>
  );
};
