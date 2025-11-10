import React, { useState, useEffect, useCallback } from 'react';
import type { Job, Course, JobCategory } from './types';
import { getCourseRecommendations } from './services/geminiService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { JobCard } from './components/JobCard';
import { CourseCard } from './components/CourseCard';
import { BriefcaseIcon, MapPinIcon, UploadCloudIcon, WalletIcon, ChevronLeftIcon, LoaderIcon, FileTextIcon, VideoIcon } from './components/icons';

// Mock Data
const initialMockJobs: Job[] = [
  { id: 1, title: 'Senior Frontend Engineer', company: { name: 'Innovate Inc.', logo: 'https://picsum.photos/seed/company1/100' }, location: 'Remote', type: 'Full-time', skills: ['React', 'TypeScript', 'Next.js'], salary: '$120,000 - $150,000', category: 'Senior', description: 'Innovate Inc. is seeking a Senior Frontend Engineer to build and scale our cutting-edge web applications. You will work with a modern stack including React, TypeScript, and Next.js to deliver high-quality user experiences.' },
  { id: 2, title: 'Backend Developer (Python)', company: { name: 'DataCore', logo: 'https://picsum.photos/seed/company2/100' }, location: 'New York, NY', type: 'Full-time', skills: ['Python', 'FastAPI', 'PostgreSQL'], salary: '$110,000 - $140,000', category: 'Intermediate', description: 'DataCore is looking for a skilled Backend Developer proficient in Python and FastAPI to design and maintain our data processing pipelines. Experience with PostgreSQL and cloud services is a plus.' },
  { id: 3, title: 'Junior UI/UX Designer', company: { name: 'Creative Solutions', logo: 'https://picsum.photos/seed/company3/100' }, location: 'San Francisco, CA', type: 'Internship', skills: ['Figma', 'Adobe XD', 'User Research'], salary: '$60,000 - $75,000', category: 'Junior', description: 'Join our team as a Junior UI/UX Designer and help shape the user experience of our products. This is a great opportunity for a recent graduate to grow their skills in a collaborative environment.' },
  { id: 8, title: 'Mid-Level UX Researcher', company: { name: 'UserFirst Co.', logo: 'https://picsum.photos/seed/company9/100' }, location: 'Remote', type: 'Full-time', skills: ['User Testing', 'Data Analysis', 'Figma'], salary: '$90,000 - $115,000', category: 'Intermediate', description: 'UserFirst Co. is seeking a UX Researcher to conduct user studies and provide actionable insights to our product teams. You should have 3+ years of experience in the field.' },
  { id: 10, title: 'IT Support Specialist', company: { name: 'SupportSphere', logo: 'https://picsum.photos/seed/company11/100' }, location: 'Remote', type: 'Full-time', skills: ['Troubleshooting', 'Active Directory', 'Customer Service'], salary: '$55,000 - $70,000', category: 'Entry-level', description: 'SupportSphere is hiring an Entry-Level IT Support Specialist to assist our employees with technical issues. This role is perfect for someone starting their career in IT.' },
  { id: 4, title: 'Full-Stack Developer', company: { name: 'TechGiant', logo: 'https://picsum.photos/seed/company4/100' }, location: 'Austin, TX', type: 'Full-time', skills: ['Node.js', 'React', 'AWS'], salary: '$100,000 - $130,000', category: 'Intermediate', description: 'TechGiant is hiring a Full-Stack Developer to work on both our client-facing and internal tools. You will be responsible for the entire development lifecycle, from concept to deployment.'},
  { id: 5, title: 'DevOps Engineer', company: { name: 'CloudNet', logo: 'https://picsum.photos/seed/company5/100' }, location: 'Remote', type: 'Contract', skills: ['Docker', 'Kubernetes', 'CI/CD'], salary: '$130,000 - $160,000', category: 'Senior', description: 'CloudNet needs an experienced DevOps Engineer to manage our cloud infrastructure. Your role will involve automating our build and deployment processes and ensuring system reliability and scalability.' },
];

const newJobsToAdd: Job[] = [
    { id: 6, title: 'Data Scientist', company: { name: 'QuantumLeap', logo: 'https://picsum.photos/seed/company7/100' }, location: 'Boston, MA', type: 'Full-time', skills: ['Python', 'TensorFlow', 'Scikit-learn'], salary: '$140,000 - $170,000', category: 'Senior', description: 'QuantumLeap is looking for a Data Scientist to join our research team. You will be working on complex machine learning models to drive business insights.' },
    { id: 7, title: 'Product Manager', company: { name: 'AgileFlow', logo: 'https://picsum.photos/seed/company8/100' }, location: 'Remote', type: 'Full-time', skills: ['Agile', 'JIRA', 'Roadmapping'], salary: '$130,000 - $160,000', category: 'Senior', description: 'AgileFlow is seeking a Product Manager to lead our product development efforts. You will be responsible for the product lifecycle from conception to launch.' },
    { id: 9, title: 'Cloud Solutions Architect', company: { name: 'InfraScale', logo: 'https://picsum.photos/seed/company10/100' }, location: 'New York, NY', type: 'Full-time', skills: ['AWS', 'Azure', 'Terraform'], salary: '$150,000 - $180,000', category: 'Senior', description: 'InfraScale is looking for a certified Cloud Solutions Architect to design and implement robust cloud strategies for our enterprise clients.' },
    { id: 11, title: 'Design Intern', company: { name: 'Creative Solutions', logo: 'https://picsum.photos/seed/company3/100' }, location: 'San Francisco, CA', type: 'Internship', skills: ['Figma', 'Illustrator'], salary: '$25/hr', category: 'Intern', description: 'Assist our design team with creating marketing materials and UI components. A great learning opportunity for a design student.' },
];

const mockCompanies = [
    { name: 'Innovate Inc.', logo: 'https://picsum.photos/seed/company1/200' },
    { name: 'DataCore', logo: 'https://picsum.photos/seed/company2/200' },
    { name: 'Creative Solutions', logo: 'https://picsum.photos/seed/company3/200' },
    { name: 'TechGiant', logo: 'https://picsum.photos/seed/company4/200' },
    { name: 'CloudNet', logo: 'https://picsum.photos/seed/company5/200' },
    { name: 'WebWeavers', logo: 'https://picsum.photos/seed/company6/200' },
];

const JobDetailsView: React.FC<{ job: Job; onBack: () => void, allJobs: Job[] }> = ({ job, onBack, allJobs }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!job.description) return;
    setIsLoading(true);
    setError(null);
    try {
      const recommendedCourses = await getCourseRecommendations(job.description);
      setCourses(recommendedCourses);
    } catch (e) {
      setError('Failed to fetch course recommendations. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [job.description]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleApply = () => {
    alert(`Application for ${job.title} submitted successfully${cvFile ? ` with resume: ${cvFile.name}` : ''}!`);
  };

  const handleBookInterview = () => {
    const meetLink = `https://meet.google.com/lookup/${Math.random().toString(36).substring(2, 15)}`;
    const emailBody = `
Subject: Invitation to Interview for ${job.title} at ${job.company.name}

Hello,

Thank you for your interest in the ${job.title} position. We would like to invite you for an introductory interview to discuss your qualifications and the role in more detail.

Date: TBD (A calendar invitation will follow)
Time: TBD
Location: Google Meet (${meetLink})

To prepare for the interview, please be ready to:
1. Briefly introduce yourself and your background.
2. Discuss your relevant experience and how it aligns with the job description.
3. Share a project or accomplishment you are proud of.

We look forward to speaking with you.

Best regards,
The ${job.company.name} Hiring Team
    `;
    alert(`Interview invitation email simulated!\n\nAn email has been sent to the candidate with the following details:\n${emailBody}`);
  };

  const similarJobs = allJobs.filter(j => j.id !== job.id && (j.skills.some(skill => job.skills.includes(skill)) || j.type === job.type)).slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
        <ChevronLeftIcon />
        Back to Listings
      </button>
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <img src={job.company.logo} alt={`${job.company.name} logo`} className="w-16 h-16 rounded-full object-cover"/>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{job.title}</h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">{job.company.name}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 dark:text-slate-400 mb-6">
              <span className="flex items-center gap-2"><MapPinIcon /> {job.location}</span>
              <span className="flex items-center gap-2"><BriefcaseIcon /> {job.type}</span>
              <span className="flex items-center gap-2"><WalletIcon /> {job.salary}</span>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Job Description</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>{job.description}</p>
            </div>
          </div>
        </div>
        <div className="space-y-8 mt-8 lg:mt-0">
          <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
             <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Candidate Actions</h3>
             <div className="space-y-4">
                 <label htmlFor="cv-upload" className="relative cursor-pointer w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                     <div className="text-blue-500"><UploadCloudIcon /></div>
                     <span className="font-semibold text-slate-600 dark:text-slate-300">Upload CV</span>
                     <span className="text-xs text-slate-500 dark:text-slate-400">PDF, DOC, DOCX (Max 5MB)</span>
                     <input id="cv-upload" type="file" className="sr-only" onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)} accept=".pdf,.doc,.docx" />
                 </label>
                 {cvFile && (
                     <div className="flex items-center justify-between text-sm bg-blue-50 dark:bg-slate-600 p-2 rounded-md">
                         <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 truncate">
                            <FileTextIcon />
                            <span className="truncate">{cvFile.name}</span>
                         </div>
                         <button onClick={() => setCvFile(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">&times;</button>
                     </div>
                 )}
                <div className="mt-4">
                    <label htmlFor="github-link" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Project (Optional)</label>
                    <input type="text" id="github-link" placeholder="https://github.com/..." className="w-full px-3 py-2 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-slate-50 dark:bg-slate-600 dark:text-white"/>
                </div>
                 <button onClick={handleApply} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                    Apply Now
                </button>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Recruiter Tools</h3>
            <button onClick={handleBookInterview} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                <VideoIcon />
                Book Introduction Interview
            </button>
          </div>
          <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">AI-Suggested Courses</h3>
            {isLoading && <div className="flex justify-center items-center h-32"><LoaderIcon /></div>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && (
              <div className="space-y-4">
                {courses.length > 0 ? courses.map((course, index) => <CourseCard key={index} course={course} />) : <p className="text-slate-500 dark:text-slate-400">No courses to recommend for this role.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
       <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Similar Jobs You May Like</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {similarJobs.map(job => <JobCard key={job.id} job={job} onSelectJob={() => {}} isSelected={false}/>)}
            </div>
        </div>
    </div>
  );
};


const MainContent: React.FC<{
    jobs: Job[];
    onSelectJob: (job: Job) => void;
    onLoadNew: () => void;
    isLoadingNewJobs: boolean;
    allJobsLoaded: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    categoryFilter: JobCategory | null;
    onSelectCategory: (category: JobCategory | null) => void;
}> = ({ jobs, onSelectJob, onLoadNew, isLoadingNewJobs, allJobsLoaded, searchTerm, onSearchChange, categoryFilter, onSelectCategory }) => {

  const categories: JobCategory[] = ['Intern', 'Entry-level', 'Junior', 'Intermediate', 'Senior'];

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-800 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-slate-800 to-slate-800 opacity-60"></div>
          <div className="relative container mx-auto px-4 text-center">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">Find Your Next Big Opportunity</h1>
              <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                  SkillMatch connects you with top tech jobs. Showcase your skills, link your GitHub, and get AI-powered learning recommendations to boost your career.
              </p>
              <div className="mt-8 max-w-xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                      <input
                          type="text"
                          placeholder="Search for job roles, companies..."
                          value={searchTerm}
                          onChange={(e) => onSearchChange(e.target.value)}
                          className="flex-grow px-5 py-3 rounded-lg border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-blue-500/50 bg-slate-700 text-white"
                      />
                      <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                          Search Jobs
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white dark:bg-slate-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {['All', ...categories].map(category => {
                  const isActive = (category === 'All' && !categoryFilter) || categoryFilter === category;
                  return (
                      <div 
                        key={category} 
                        onClick={() => onSelectCategory(category === 'All' ? null : category as JobCategory)}
                        className={`p-6 rounded-xl text-center transition-all cursor-pointer transform hover:-translate-y-1 ${
                            isActive 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'bg-slate-100 dark:bg-slate-600 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                        }`}
                      >
                          <h3 className={`text-xl font-semibold ${isActive ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{category}</h3>
                      </div>
                  )
              })}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Job Openings</h2>
            <button
                onClick={onLoadNew}
                disabled={isLoadingNewJobs || allJobsLoaded}
                className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {isLoadingNewJobs ? (
                    <>
                        <LoaderIcon className="w-5 h-5" />
                        Loading...
                    </>
                ) : allJobsLoaded ? (
                    'All jobs loaded'
                ) : (
                    'Load New Jobs'
                )}
            </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onSelectJob={onSelectJob} isSelected={false}/>
          ))}
        </div>
      </div>

      {/* Featured Companies */}
       <div className="bg-white dark:bg-slate-700 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white">Featured Companies</h2>
           <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
                {[...mockCompanies, ...mockCompanies].map((company, index) => (
                    <div key={index} className="flex-shrink-0 w-48 h-24 mx-4 flex items-center justify-center">
                        <img src={company.logo} alt={company.name} className="max-h-16 max-w-full grayscale hover:grayscale-0 transition-all duration-300" />
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
       <style>{`
          @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}</style>
    </>
  );
};


export default function App() {
  const [jobs, setJobs] = useState<Job[]>(initialMockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoadingNewJobs, setIsLoadingNewJobs] = useState(false);
  const [allJobsLoaded, setAllJobsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<JobCategory | null>(null);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      document.documentElement.style.setProperty('--x', `${clientX}px`);
      document.documentElement.style.setProperty('--y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedJob(null);
  };

  const handleLoadNewJobs = () => {
    setIsLoadingNewJobs(true);

    // Simulate network delay
    setTimeout(() => {
        const currentJobIds = new Set(jobs.map(j => j.id));
        const availableNewJobs = newJobsToAdd.filter(nj => !currentJobIds.has(nj.id));
        
        if (availableNewJobs.length > 0) {
            setJobs(prevJobs => [...prevJobs, ...availableNewJobs]);
            setAllJobsLoaded(true); 
        } else {
            setAllJobsLoaded(true); 
        }
        
        setIsLoadingNewJobs(false);
    }, 1000);
  };

  const displayedJobs = jobs.filter(job => {
    const matchesCategory = categoryFilter ? job.category === categoryFilter : true;
    const matchesSearch = searchTerm
      ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-100 dark:bg-slate-800 min-h-screen text-slate-800 dark:text-slate-200 relative isolate">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_400px_at_var(--x,_50%)_var(--y,_50%),_rgba(45,150,255,0.15),_transparent)]"></div>
      <Header />
      <main className="pt-20">
        {selectedJob ? (
          <JobDetailsView job={selectedJob} onBack={handleBack} allJobs={jobs}/>
        ) : (
          <MainContent
             jobs={displayedJobs}
             onSelectJob={handleSelectJob}
             onLoadNew={handleLoadNewJobs}
             isLoadingNewJobs={isLoadingNewJobs}
             allJobsLoaded={allJobsLoaded}
             searchTerm={searchTerm}
             onSearchChange={setSearchTerm}
             categoryFilter={categoryFilter}
             onSelectCategory={setCategoryFilter}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}