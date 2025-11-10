import React from 'react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <a href={course.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-100 dark:bg-gray-800 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors">
      <h4 className="font-semibold text-gray-800 dark:text-white">{course.title}</h4>
      <p className="text-sm text-teal-600 dark:text-teal-400">{course.provider}</p>
    </a>
  );
};