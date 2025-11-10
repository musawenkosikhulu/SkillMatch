export interface Company {
  name: string;
  logo: string;
}

export type JobCategory = 'Intern' | 'Entry-level' | 'Junior' | 'Intermediate' | 'Senior';

export interface Job {
  id: number;
  title: string;
  company: Company;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  skills: string[];
  salary: string;
  category: JobCategory;
  description: string;
}

export interface Course {
  title: string;
  provider: string;
  url: string;
}