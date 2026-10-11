import { BrowserRouter, NavLink, Route, Routes, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileText,
  Heart,
  Home,
  LogIn,
  Menu,
  MessageSquare,
  Mic,
  MoonStar,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCircle2,
  Users,
  X,
  Briefcase,
  MapPin,
  CalendarRange,
  Clock3,
  BellRing,
  Shield,
  Check,
  LayoutDashboard,
  CreditCard,
  Wand2,
  Download,
  Copy,
  Send,
  CircleDashed,
  Save,
  ExternalLink,
  Filter,
  Bot,
  Target,
  Mail,
  Phone,
  Rocket,
  BookText,
  Landmark,
  Gauge,
  BriefcaseIcon
} from 'lucide-react';

// ---------- Types ----------

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  remote: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: 'Entry level' | 'Mid level' | 'Senior';
  salary?: string;
  category: string;
  posted: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  source: string;
  applicationUrl: string;
};

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  location: string;
  skillSummary: string;
  remotePreference: string;
  careerGoal: string;
  role: 'user' | 'admin';
  createdAt: string;
};

type AppRecord = {
  id: string;
  jobId: string;
  company: string;
  title: string;
  status: 'Interested' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  notes: string;
  date: string;
};

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

type ContactSubmission = {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  consent: boolean;
};

// ---------- Demo data ----------

const jobListings: Job[] = [
  {
    id: 'job-1',
    title: 'Junior Product Designer',
    company: 'BrightPath Labs',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    remote: 'Hybrid',
    employmentType: 'Full-time',
    experience: 'Entry level',
    salary: 'NGN 220,000 – 320,000',
    category: 'Design',
    posted: '2 days ago',
    description: 'Help design user-centred experiences for a fast-growing fintech product that supports young professionals planning their financial future.',
    responsibilities: ['Create clear user flows and polished interfaces', 'Collaborate with product and engineering teams', 'Run lightweight UX research and usability testing'],
    qualifications: ['A portfolio with 2+ projects', 'Figma proficiency', 'Clear communication and iteration'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/brightpath'
  },
  {
    id: 'job-2',
    title: 'Customer Support Specialist',
    company: 'MileOne',
    location: 'Remote',
    country: 'Nigeria',
    remote: 'Remote',
    employmentType: 'Full-time',
    experience: 'Entry level',
    salary: 'NGN 180,000 – 260,000',
    category: 'Customer Success',
    posted: '4 days ago',
    description: 'Support customers navigating services, resolving enquiries, and creating a reassuring experience for people using a digital platform.',
    responsibilities: ['Respond to customer ticket volume', 'Document common issues and solutions', 'Follow up on customer satisfaction and retention'],
    qualifications: ['Strong written communication', 'Comfortable using helpdesk tools', 'Friendly, calm problem-solving'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/mileone'
  },
  {
    id: 'job-3',
    title: 'Frontend Developer',
    company: 'Northstar Studio',
    location: 'Remote',
    country: 'Global',
    remote: 'Remote',
    employmentType: 'Full-time',
    experience: 'Mid level',
    salary: '$1,800 – $2,600 / month',
    category: 'Engineering',
    posted: '1 day ago',
    description: 'Build smooth, scalable user interfaces for global clients across SaaS, e-commerce, and consumer applications.',
    responsibilities: ['Write accessible, responsive front-end code', 'Work closely with design and product teams', 'Optimise performance and UX quality'],
    qualifications: ['React and TypeScript experience', 'Git workflow familiarity', 'Attention to performance and accessibility'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/northstar'
  },
  {
    id: 'job-4',
    title: 'Graduate Software Engineer',
    company: 'Aster Cloud',
    location: 'Abuja, Nigeria',
    country: 'Nigeria',
    remote: 'On-site',
    employmentType: 'Full-time',
    experience: 'Entry level',
    salary: 'NGN 240,000 – 360,000',
    category: 'Engineering',
    posted: '3 days ago',
    description: 'Join one of the fastest-growing engineering teams building internal tooling and customer-facing analytics dashboards.',
    responsibilities: ['Write and review production code', 'Debug issues with support from senior engineers', 'Participate in team planning and demos'],
    qualifications: ['Degree in CS or related field', 'Basic understanding of web technologies', 'Strong willingness to learn'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/astercloud'
  },
  {
    id: 'job-5',
    title: 'Digital Marketing Intern',
    company: 'Bloom & Co',
    location: 'Remote',
    country: 'Nigeria',
    remote: 'Remote',
    employmentType: 'Internship',
    experience: 'Entry level',
    salary: 'NGN 90,000 – 150,000',
    category: 'Marketing',
    posted: '5 days ago',
    description: 'Support brand campaigns, social content planning, and audience engagement while developing marketing skills in a friendly team environment.',
    responsibilities: ['Create social media content ideas', 'Support campaign tracking and reporting', 'Assist with community engagement'],
    qualifications: ['Creative and organised mindset', 'Comfort using spreadsheets and social tools', 'Strong writing skills'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/bloomco'
  },
  {
    id: 'job-6',
    title: 'Business Analyst',
    company: 'Harbor Advisory',
    location: 'Port Harcourt, Nigeria',
    country: 'Nigeria',
    remote: 'Hybrid',
    employmentType: 'Full-time',
    experience: 'Mid level',
    salary: 'NGN 300,000 – 450,000',
    category: 'Operations',
    posted: '6 days ago',
    description: 'Support business problem solving by translating organisational goals into clear opportunities and practical action plans.',
    responsibilities: ['Analyse existing workflows and recommend improvements', 'Prepare presentation-ready data summaries', 'Work with stakeholders across departments'],
    qualifications: ['Analytical thinking and Excel comfort', 'Business writing ability', 'Experience in process mapping is a plus'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/harboradvisory'
  },
  {
    id: 'job-7',
    title: 'Data Analyst',
    company: 'Crestline AI',
    location: 'Remote',
    country: 'Global',
    remote: 'Remote',
    employmentType: 'Contract',
    experience: 'Mid level',
    salary: '$2,000 – $3,200 / month',
    category: 'Data',
    posted: '2 weeks ago',
    description: 'Track user trends, create reports, and help teams make smarter decisions through better understanding of customer and product data.',
    responsibilities: ['Create dashboards and data summaries', 'Validate and clean data sets', 'Translate metrics into clear recommendations'],
    qualifications: ['SQL and Excel confidence', 'Dashboard tools such as Power BI or Tableau', 'Strong problem solving'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/crestline'
  },
  {
    id: 'job-8',
    title: 'Recruitment Assistant',
    company: 'GrowthBridge',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    remote: 'On-site',
    employmentType: 'Full-time',
    experience: 'Entry level',
    salary: 'NGN 170,000 – 230,000',
    category: 'HR',
    posted: '1 week ago',
    description: 'Support hiring operations, candidate communications, and onboarding coordination for a growing team.',
    responsibilities: ['Coordinate interview schedules', 'Review applications and shortlist candidates', 'Keep candidate communication clear and warm'],
    qualifications: ['Excellent organisational skills', 'Strong communication', 'Experience with HR tools is a plus'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/growthbridge'
  },
  {
    id: 'job-9',
    title: 'Content Writer',
    company: 'Storyline Media',
    location: 'Remote',
    country: 'Global',
    remote: 'Remote',
    employmentType: 'Part-time',
    experience: 'Entry level',
    salary: '$600 – $1,100 / month',
    category: 'Content',
    posted: '8 days ago',
    description: 'Create engaging articles, marketing copy, and communications that help brands connect with the right audiences.',
    responsibilities: ['Research and write clear long-form content', 'Edit drafts and revise for clarity', 'Work with content briefs and deadlines'],
    qualifications: ['Strong writing skills', 'Adaptability across tone and audience', 'Research confidence'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/storyline'
  },
  {
    id: 'job-10',
    title: 'Operations Coordinator',
    company: 'NovaWorks',
    location: 'Ibadan, Nigeria',
    country: 'Nigeria',
    remote: 'Hybrid',
    employmentType: 'Full-time',
    experience: 'Mid level',
    salary: 'NGN 250,000 – 350,000',
    category: 'Operations',
    posted: '3 days ago',
    description: 'Support daily operational workflows, schedule coordination, and team communication to keep work moving smoothly.',
    responsibilities: ['Maintain operational calendars and trackers', 'Manage group tasks and deadlines', 'Coordinate communications across teams'],
    qualifications: ['Strong organisation and follow-through', 'Comfort in admin and spreadsheet work', 'Team-first attitude'],
    source: 'Demo data – local prototype',
    applicationUrl: 'https://example.com/apply/novaworks'
  }
];

const careerPaths = [
  {
    title: 'Product Design',
    description: 'Blend user empathy, research, and interface design to help products feel intuitive and valuable.',
    skills: ['UI design', 'UX research', 'Figma', 'Design systems'],
    fit: 'Great for creative thinkers and problem solvers.'
  },
  {
    title: 'Frontend Engineering',
    description: 'Build the parts of the digital experience users see and interact with every day.',
    skills: ['HTML', 'CSS', 'React', 'Accessibility'],
    fit: 'Strong for detail-oriented builders.'
  },
  {
    title: 'Customer Success',
    description: 'Support users, deepen relationships, and solve real problems with empathy and clarity.',
    skills: ['Communication', 'CRM tools', 'Problem solving', 'Relationship building'],
    fit: 'Perfect for people who enjoy helping others.'
  },
  {
    title: 'Operations & Project Support',
    description: 'Keep people, tasks, and timelines aligned so work runs smoothly behind the scenes.',
    skills: ['Organisation', 'Planning', 'Communication', 'Reporting'],
    fit: 'Ideal for well-structured, calm multitaskers.'
  }
];

const interviewQuestions = [
  'Tell me about a time you solved a problem in a stressful situation.',
  'What motivates you to apply for this role?',
  'How do you handle feedback when it is critical?',
  'Describe a project or task where you had to stay organised and meet deadlines.'
];

const defaultPrompts = [
  'Help me find jobs that match my skills.',
  'Improve my CV.',
  'Explain this job description.',
  'Help me prepare for an interview.',
  'I have no work experience. Where should I start?',
  'Help me write a cover letter.'
];

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Find Jobs', path: '/jobs' },
  { label: 'Remote Jobs', path: '/remote-jobs' },
  { label: 'Internships', path: '/internships' },
  { label: 'Saved Jobs', path: '/saved-jobs' },
  { label: 'AI Career Assistant', path: '/ai-career-assistant' },
  { label: 'Resume Builder', path: '/resume-builder' },
  { label: 'My Applications', path: '/applications' },
  { label: 'Login', path: '/login' },
  { label: 'Sign Up', path: '/signup' }
];

const faqItems = [
  {
    q: 'How does Ivy6 help people without much work experience?',
    a: 'Ivy6 focuses on role-fit, transferable skills, and practical next steps. We help users discover opportunities that value potential, communication, attitude, and learning readiness alongside experience.'
  },
  {
    q: 'Can I save jobs and come back later?',
    a: 'Yes. Saved jobs are stored for your account and remain available when you sign back in. We also support local guest saving when no account is active.'
  },
  {
    q: 'Does Ivy6 guarantee a job?',
    a: 'No platform can guarantee employment. Ivy6 helps you search smarter, prepare better, and build confidence with tools that support your process.'
  },
  {
    q: 'How do the AI tools work?',
    a: 'The AI assistant provides guidance for CVs, cover letters, interviews, and career planning. It responds with practical suggestions and avoids making claims it cannot substantiate.'
  }
];

const friendlyCopy = {
  hero: 'Your next opportunity starts here.',
  subtext: 'Job hunting can feel overwhelming. Finding your next opportunity does not have to be. Discover work, get support, and take your next step with Ivy6.'
};

// ---------- Local storage helpers ----------

function readStorage<T>(key: string, fallback: T): T {
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

// ---------- App root ----------

function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => readStorage<UserProfile | null>('ivy-user', null));
  const [userList, setUserList] = useState<UserProfile[]>(() => readStorage<UserProfile[]>('ivy-users', []));
  const [savedJobs, setSavedJobs] = useState<string[]>(() => readStorage<string[]>('ivy-saved-jobs', []));
  const [applications, setApplications] = useState<AppRecord[]>(() => readStorage<AppRecord[]>('ivy-applications', []));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => readStorage<ChatMessage[]>('ivy-chat-messages', [
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hey, welcome to Ivy6. Looking for a job, working on your CV, or trying to figure out your next move? We can work through it together.'
    }
  ]));

  useEffect(() => {
    localStorage.setItem('ivy-user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ivy-users', JSON.stringify(userList));
  }, [userList]);

  useEffect(() => {
    localStorage.setItem('ivy-saved-jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem('ivy-applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ivy-chat-messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const toggleSavedJob = (jobId: string) => {
    setSavedJobs((prev) => prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]);
  };

  const addApplication = (job: Job, status: AppRecord['status'], notes: string = '') => {
    const record: AppRecord = {
      id: `${job.id}-${Date.now()}`,
      jobId: job.id,
      company: job.company,
      title: job.title,
      status,
      notes,
      date: formatDate(new Date())
    };
    setApplications((prev) => [record, ...prev]);
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === 'admin@ivy6.com';

  const aiReply = (prompt: string) => {
    const clean = prompt.toLowerCase();
    if (clean.includes('cv') || clean.includes('resume')) {
      return 'Here is a strong approach: lead with your strongest impact, keep formatting simple, highlight relevant skills, and quantify achievements where you can. If you have limited experience, emphasise transferable skills, projects, volunteering, and evidence of learning.';
    }
    if (clean.includes('interview')) {
      return 'Prepare with the STAR method: Situation, Task, Action, Result. Keep answers clear, concise, and relevant. Focus on what you did, why it mattered, and what you learned.';
    }
    if (clean.includes('cover letter')) {
      return 'A good cover letter is personal and specific. Mention why the role fits your strengths, explain your motivation clearly, and point to a few proof points that show you can add value.';
    }
    if (clean.includes('experience') || clean.includes('no work')) {
      return 'You do not need to have a perfect CV before you start. Lead with transferable skills, school projects, volunteer work, community impact, and the things you have learned on your own.';
    }
    if (clean.includes('remote') || clean.includes('job')) {
      return 'Start with the roles that match your current strengths and your preferred working style. Combine a strong profile, a few targeted applications, and a focused shortlist rather than mass-applying everywhere.';
    }
    return 'Let’s break it down step by step. Start by identifying the role you want, the best-fit skills you already have, and the small gaps you can close. Then build a focused plan around applications, CV updates, and interview prep.';
  };

  const addAiMessage = (text: string, role: 'assistant' | 'user' = 'user') => {
    setChatMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, role, text }]);
  };

  const submitAiPrompt = (prompt: string) => {
    if (!prompt.trim()) return;
    addAiMessage(prompt, 'user');
    setTimeout(() => {
      addAiMessage(aiReply(prompt), 'assistant');
    }, 400);
  };

  const seedAdminIfNeeded = () => {
    if (!userList.some((user) => user.email.toLowerCase() === 'admin@ivy6.com')) {
      const adminUser: UserProfile = {
        id: 'admin-1',
        fullName: 'Ivy6 Admin',
        email: 'admin@ivy6.com',
        password: 'Admin123!',
        location: 'Nigeria',
        skillSummary: 'Platform administration and triage',
        remotePreference: 'Remote',
        careerGoal: 'Support user growth and platform quality',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setUserList((prev) => [adminUser, ...prev]);
    }
  };

  useEffect(() => {
    seedAdminIfNeeded();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppLayout
          currentUser={currentUser}
          isAdmin={isAdmin}
          onLogout={() => setCurrentUser(null)}
          savedJobs={savedJobs}
        />
        <Routes>
          <Route path="/" element={<HomePage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} />} />
          <Route path="/jobs" element={<JobsPage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} addApplication={addApplication} />} />
          <Route path="/remote-jobs" element={<RemoteJobsPage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} />} />
          <Route path="/internships" element={<InternshipsPage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} />} />
          <Route path="/saved-jobs" element={<SavedJobsPage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} />} />
          <Route path="/applications" element={<ApplicationsPage applications={applications} />} />
          <Route path="/ai-career-assistant" element={<AICareerAssistantPage chatMessages={chatMessages} defaultPrompts={defaultPrompts} onSendPrompt={submitAiPrompt} />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/cv-analyzer" element={<CVAnalyzerPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/interview-prep" element={<InterviewPrepPage />} />
          <Route path="/career-paths" element={<CareerPathsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/login" element={<LoginPage currentUser={currentUser} setCurrentUser={setCurrentUser} userList={userList} />} />
          <Route path="/signup" element={<SignupPage userList={userList} onCreateUser={setUserList} setCurrentUser={setCurrentUser} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage userList={userList} />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/employers" element={<EmployersPage />} />
          <Route path="/admin" element={<AdminPage currentUser={currentUser} isAdmin={isAdmin} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function AppLayout({ currentUser, isAdmin, onLogout, savedJobs }: { currentUser: UserProfile | null; isAdmin: boolean; onLogout: () => void; savedJobs: string[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="container nav-shell">
        <Link to="/" className="brand" aria-label="Ivy6 home">
          <span className="brand-mark">I</span>
          <span>Ivy6</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => {
            if ((item.path === '/login' || item.path === '/signup') && currentUser) {
              return null;
            }
            if (item.path === '/admin' && !isAdmin) {
              return null;
            }
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            );
          })}

          {currentUser && (
            <>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setMenuOpen(false)}>
                Profile
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setMenuOpen(false)}>
                  Admin
                </NavLink>
              )}
              <button className="link-button" onClick={onLogout}>Sign Out</button>
            </>
          )}
        </nav>

        <div className="nav-actions">
          <Link to="/saved-jobs" className="mini-pill">
            <Heart size={16} /> {savedJobs.length}
          </Link>
          {!currentUser ? (
            <>
              <Link to="/login" className="button ghost-button">Login</Link>
              <Link to="/signup" className="button primary-button">Sign Up</Link>
            </>
          ) : (
            <Link to="/profile" className="button primary-button">My Account</Link>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark">I</span><span>Ivy6</span></div>
          <p className="muted">Stay here, we got you.</p>
        </div>

        <div>
          <h4>Explore</h4>
          <div className="footer-links">
            <Link to="/jobs">Find Jobs</Link>
            <Link to="/remote-jobs">Remote Jobs</Link>
            <Link to="/internships">Internships</Link>
            <Link to="/companies">Companies</Link>
          </div>
        </div>

        <div>
          <h4>Support</h4>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/employers">Employers</Link>
          </div>
        </div>

        <div>
          <h4>Legal</h4>
          <div className="footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ savedJobs, onSaveToggle }: { savedJobs: string[]; onSaveToggle: (jobId: string) => void }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const featuredJobs = jobListings.slice(0, 3);

  return (
    <main>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={16} /> Premium job discovery</div>
            <h1>{friendlyCopy.hero}</h1>
            <p>{friendlyCopy.subtext}</p>
            <div className="hero-actions">
              <button className="button primary-button" onClick={() => navigate('/jobs')}>Find My Next Job <ArrowRight size={18} /></button>
              <button className="button secondary-button" onClick={() => navigate('/ai-career-assistant')}>Meet Your AI Career Assistant</button>
            </div>

            <form className="search-panel" onSubmit={handleSubmit}>
              <div className="search-row">
                <label>
                  <span>What kind of job are you looking for?</span>
                  <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Product design, data analyst, customer support..." />
                </label>
                <label>
                  <span>Where would you like to work?</span>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lagos, Remote, Abuja..." />
                </label>
                <button className="button primary-button compact" type="submit">Search jobs</button>
              </div>
              <div className="quick-tags">
                {['Remote', 'Product Design', 'Frontend', 'Internships', 'Customer Support', 'Data Analyst'].map((tag) => (
                  <button key={tag} type="button" className="tag" onClick={() => navigate(`/jobs?q=${encodeURIComponent(tag)}`)}>{tag}</button>
                ))}
              </div>
            </form>
          </div>

          <div className="hero-visual">
            <div className="floating-card card-one">
              <div className="mini-badge success"><CheckCircle2 size={16} /> Personalized match</div>
              <h4>Frontend Developer</h4>
              <p>Remote • Global • Full-time</p>
            </div>
            <div className="floating-card card-two">
              <div className="mini-badge secondary"><Target size={16} /> Career insight</div>
              <h4>AI CV review</h4>
              <p>+3 skills to highlight</p>
            </div>
            <div className="hero-preview">
              <div className="preview-top">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
              <div className="preview-card">
                <div className="preview-header">
                  <span className="sidebar-dot"></span>
                  <span>Career dashboard</span>
                </div>
                <div className="preview-content">
                  <div className="stat-box">
                    <small>Potential matches</small>
                    <strong>12</strong>
                  </div>
                  <div className="mini-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="list-item"><span></span><small>CV improvement ready</small></div>
                  <div className="list-item"><span></span><small>Interview prep queued</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-strip container">
        {[
          { icon: <BriefcaseBusiness size={20} />, title: 'Job discovery', text: 'Discover roles that match your current strengths and next direction.' },
          { icon: <Wand2 size={20} />, title: 'AI support', text: 'Ask for help with CVs, interviews, and career planning.' },
          { icon: <ClipboardCheck size={20} />, title: 'Application tracking', text: 'Track your progress without losing important next steps.' }
        ].map((feature) => (
          <div className="feature-box" key={feature.title}>
            <div className="feature-icon">{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.text}</p>
          </div>
        ))}
      </section>

      <section className="container section-block">
        <div className="section-head">
          <div>
            <div className="eyebrow"><Star size={16} /> Recommended opportunities</div>
            <h2>Opportunities to explore</h2>
          </div>
          <Link to="/jobs" className="text-link">See all jobs <ChevronRight size={16} /></Link>
        </div>

        <div className="job-grid">
          {featuredJobs.map((job) => (
            <article key={job.id} className="job-card">
              <div className="card-top-row">
                <div>
                  <p className="job-company">{job.company}</p>
                  <h3>{job.title}</h3>
                </div>
                <button className={`save-button ${savedJobs.includes(job.id) ? 'active' : ''}`} onClick={() => onSaveToggle(job.id)} aria-label={`Save ${job.title}`}>
                  <Heart size={16} />
                </button>
              </div>
              <div className="meta-row">
                <span><MapPin size={14} /> {job.location}</span>
                <span><Briefcase size={14} /> {job.employmentType}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="pill-list">
                <span>{job.remote}</span>
                <span>{job.experience}</span>
              </div>
              <div className="card-bottom-row">
                <span>{job.posted}</span>
                <Link to={`/jobs/${job.id}`} className="text-link">View role</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-block split-section">
        <div className="split-copy">
          <div className="eyebrow"><Bot size={16} /> AI-powered career support</div>
          <h2>Ask Ivy6 what to do next.</h2>
          <p>Whether you are unsure where to begin or want help refining your applications, the assistant gives guidance that feels practical, honest, and encouraging.</p>
          <div className="bullet-list">
            <div><CheckCircle2 size={18} /> CV improvement suggestions</div>
            <div><CheckCircle2 size={18} /> Interview prep guidance</div>
            <div><CheckCircle2 size={18} /> Career path recommendations</div>
          </div>
          <Link to="/ai-career-assistant" className="button primary-button">Try the assistant</Link>
        </div>

        <div className="tool-panel">
          <div className="tool-header">
            <span className="tool-icon"><MessageSquare size={18} /></span>
            <strong>Career companion</strong>
          </div>
          <div className="chat-preview">
            <div className="bubble assistant">Help me prepare for my first interview.</div>
            <div className="bubble user">What should I focus on?</div>
            <div className="bubble assistant">Use the STAR method, keep examples brief, and show confidence without overdoing it.</div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head centered">
          <div>
            <div className="eyebrow"><Rocket size={16} /> Career tools</div>
            <h2>Everything you need to move forward</h2>
          </div>
        </div>
        <div className="tool-grid">
          {[
            { icon: <FileText size={20} />, title: 'Resume Builder', href: '/resume-builder' },
            { icon: <ClipboardCheck size={20} />, title: 'CV Analyzer', href: '/cv-analyzer' },
            { icon: <BookText size={20} />, title: 'Cover Letter', href: '/cover-letter' },
            { icon: <Mic size={20} />, title: 'Interview Prep', href: '/interview-prep' },
            { icon: <Users size={20} />, title: 'Career Paths', href: '/career-paths' },
            { icon: <Building2 size={20} />, title: 'Company Directory', href: '/companies' }
          ].map((tool) => (
            <Link to={tool.href} key={tool.title} className="tool-card">
              <span>{tool.icon}</span>
              <strong>{tool.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <div>
            <div className="eyebrow"><MoonStar size={16} /> How Ivy6 works</div>
            <h2>Simple, supportive, and practical</h2>
          </div>
        </div>
        <div className="steps-grid">
          {[
            ['1', 'Discover opportunities that match your stage and strengths.'],
            ['2', 'Prepare your CV, cover letter, and interview story with AI support.'],
            ['3', 'Track applications and make your next move with more confidence.']
          ].map(([number, text]) => (
            <div className="step-card" key={number}>
              <span className="step-number">{number}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function JobsPage({ savedJobs, onSaveToggle }: { savedJobs: string[]; onSaveToggle: (jobId: string) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const remoteFilter = searchParams.get('remote') || 'All';
  const typeFilter = searchParams.get('type') || 'All';
  const levelFilter = searchParams.get('level') || 'All';

  const filteredJobs = useMemo(() => {
    return jobListings.filter((job) => {
      const matchesKeyword = !keyword || `${job.title} ${job.company} ${job.category}`.toLowerCase().includes(keyword.toLowerCase());
      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase()) || job.country.toLowerCase().includes(location.toLowerCase());
      const matchesRemote = remoteFilter === 'All' || job.remote === remoteFilter;
      const matchesType = typeFilter === 'All' || job.employmentType === typeFilter;
      const matchesLevel = levelFilter === 'All' || job.experience === levelFilter;
      return matchesKeyword && matchesLocation && matchesRemote && matchesType && matchesLevel;
    });
  }, [keyword, location, remoteFilter, typeFilter, levelFilter]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'All' || !value) params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  const clearAll = () => {
    setSearchParams({});
  };

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Search size={16} /> Find Jobs</div>
          <h1>Explore opportunities</h1>
        </div>
        <div className="muted-badge">Demo job data for local prototype</div>
      </div>

      <div className="filter-panel">
        <div className="filter-row">
          <label>
            <span>Keyword</span>
            <input value={keyword} onChange={(e) => updateParam('q', e.target.value)} placeholder="Design, support, engineering..." />
          </label>
          <label>
            <span>Location</span>
            <input value={location} onChange={(e) => updateParam('location', e.target.value)} placeholder="Lagos, Remote..." />
          </label>
          <label>
            <span>Remote</span>
            <select value={remoteFilter} onChange={(e) => updateParam('remote', e.target.value)}>
              <option value="All">All</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </label>
          <label>
            <span>Type</span>
            <select value={typeFilter} onChange={(e) => updateParam('type', e.target.value)}>
              <option value="All">All</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </label>
          <label>
            <span>Level</span>
            <select value={levelFilter} onChange={(e) => updateParam('level', e.target.value)}>
              <option value="All">All</option>
              <option value="Entry level">Entry level</option>
              <option value="Mid level">Mid level</option>
              <option value="Senior">Senior</option>
            </select>
          </label>
        </div>

        <div className="chip-row">
          {[keyword, location, remoteFilter !== 'All' ? remoteFilter : '', typeFilter !== 'All' ? typeFilter : '', levelFilter !== 'All' ? levelFilter : '']
            .filter(Boolean)
            .map((chip) => <span key={chip} className="filter-chip">{chip}</span>)}
          <button className="text-link" onClick={clearAll}>Clear all filters</button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <Search size={30} />
          <h3>Nothing matching your search just yet.</h3>
          <p>Try broadening your keyword, location, or remote filters and we’ll help you find a better match.</p>
        </div>
      ) : (
        <div className="job-grid results-grid">
          {filteredJobs.map((job) => (
            <article key={job.id} className="job-card">
              <div className="card-top-row">
                <div>
                  <p className="job-company">{job.company}</p>
                  <h3>{job.title}</h3>
                </div>
                <button className={`save-button ${savedJobs.includes(job.id) ? 'active' : ''}`} onClick={() => onSaveToggle(job.id)} aria-label={`Save ${job.title}`}>
                  <Heart size={16} />
                </button>
              </div>
              <div className="meta-row">
                <span><MapPin size={14} /> {job.location}</span>
                <span><Briefcase size={14} /> {job.employmentType}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="pill-list">
                <span>{job.remote}</span>
                <span>{job.experience}</span>
                <span>{job.country}</span>
              </div>
              <div className="card-bottom-row">
                <span>{job.posted}</span>
                <div className="card-actions">
                  <Link to={`/jobs/${job.id}`} className="text-link">Open</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function JobDetailPage({ savedJobs, onSaveToggle, addApplication }: { savedJobs: string[]; onSaveToggle: (jobId: string) => void; addApplication: (job: Job, status: AppRecord['status'], notes?: string) => void }) {
  const { jobId } = useParams();
  const job = jobListings.find((entry) => entry.id === jobId);
  const navigate = useNavigate();

  if (!job) {
    return <main className="container content-page"><div className="empty-state"><h3>Job not found.</h3><Link to="/jobs" className="button primary-button">Back to jobs</Link></div></main>;
  }

  return (
    <main className="container content-page job-detail-wrap">
      <div className="job-detail-header">
        <div>
          <div className="eyebrow"><BriefcaseBusiness size={16} /> {job.company}</div>
          <h1>{job.title}</h1>
          <div className="meta-row detail-meta">
            <span><MapPin size={14} /> {job.location}</span>
            <span><Clock3 size={14} /> {job.posted}</span>
            <span><Building2 size={14} /> {job.remote}</span>
          </div>
        </div>
        <div className="job-detail-actions">
          <button className={`button ${savedJobs.includes(job.id) ? 'secondary-button' : 'primary-button'}`} onClick={() => onSaveToggle(job.id)}>
            {savedJobs.includes(job.id) ? 'Saved' : 'Save Job'}
          </button>
          <a href={job.applicationUrl} target="_blank" rel="noreferrer" className="button primary-button">Apply now</a>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-card">
            <h3>About the role</h3>
            <p>{job.description}</p>
          </div>

          <div className="detail-card">
            <h3>Responsibilities</h3>
            <ul className="check-list">
              {job.responsibilities.map((item) => <li key={item}><CheckCircle2 size={18} /> {item}</li>)}
            </ul>
          </div>

          <div className="detail-card">
            <h3>Qualifications</h3>
            <ul className="check-list">
              {job.qualifications.map((item) => <li key={item}><CheckCircle2 size={18} /> {item}</li>)}
            </ul>
          </div>
        </div>

        <aside className="detail-side">
          <div className="detail-card side-card">
            <h3>At a glance</h3>
            <div className="side-list">
              <div><strong>Employment:</strong> {job.employmentType}</div>
              <div><strong>Experience:</strong> {job.experience}</div>
              <div><strong>Location:</strong> {job.location}</div>
              <div><strong>Salary:</strong> {job.salary || 'Not stated'}</div>
              <div><strong>Country:</strong> {job.country}</div>
              <div><strong>Source:</strong> {job.source}</div>
            </div>
          </div>

          <div className="detail-card side-card">
            <h3>Advance your application</h3>
            <button className="button secondary-button" onClick={() => addApplication(job, 'Interested', 'Saved for later follow-up.')}>Track interest</button>
            <button className="button ghost-button" onClick={() => navigate('/resume-builder')}>Build my CV</button>
            <button className="button ghost-button" onClick={() => navigate('/cover-letter')}>Write cover letter</button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function RemoteJobsPage({ savedJobs, onSaveToggle }: { savedJobs: string[]; onSaveToggle: (jobId: string) => void }) {
  const remoteJobs = jobListings.filter((job) => job.remote === 'Remote');
  return <ListingsPage heading="Remote opportunities" jobs={remoteJobs} savedJobs={savedJobs} onSaveToggle={onSaveToggle} />;
}

function InternshipsPage({ savedJobs, onSaveToggle }: { savedJobs: string[]; onSaveToggle: (jobId: string) => void }) {
  const internshipJobs = jobListings.filter((job) => job.employmentType === 'Internship' || job.experience === 'Entry level');
  return <ListingsPage heading="Internships & entry-level roles" jobs={internshipJobs} savedJobs={savedJobs} onSaveToggle={onSaveToggle} />;
}

function ListingsPage({ heading, jobs, savedJobs, onSaveToggle }: { heading: string; jobs: Job[]; savedJobs: string[]; onSaveToggle: (jobId: string) => void }) {
  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><BriefcaseBusiness size={16} /> Ivy6 directory</div>
          <h1>{heading}</h1>
        </div>
      </div>

      <div className="job-grid results-grid">
        {jobs.map((job) => (
          <article key={job.id} className="job-card">
            <div className="card-top-row">
              <div>
                <p className="job-company">{job.company}</p>
                <h3>{job.title}</h3>
              </div>
              <button className={`save-button ${savedJobs.includes(job.id) ? 'active' : ''}`} onClick={() => onSaveToggle(job.id)}>
                <Heart size={16} />
              </button>
            </div>
            <div className="meta-row">
              <span><MapPin size={14} /> {job.location}</span>
              <span><Briefcase size={14} /> {job.employmentType}</span>
            </div>
            <p className="job-description">{job.description}</p>
            <div className="pill-list">
              <span>{job.remote}</span>
              <span>{job.experience}</span>
            </div>
            <div className="card-bottom-row">
              <span>{job.posted}</span>
              <Link to={`/jobs/${job.id}`} className="text-link">Open</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function SavedJobsPage({ savedJobs, onSaveToggle }: { savedJobs: string[]; onSaveToggle: (jobId: string) => void }) {
  const favouriteJobs = jobListings.filter((job) => savedJobs.includes(job.id));

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Heart size={16} /> Saved Jobs</div>
          <h1>Your shortlist</h1>
        </div>
      </div>

      {favouriteJobs.length === 0 ? (
        <div className="empty-state">
          <Heart size={34} />
          <h3>Your shortlist starts here.</h3>
          <p>Save opportunities you love and we’ll keep them organised for you.</p>
        </div>
      ) : (
        <div className="job-grid results-grid">
          {favouriteJobs.map((job) => (
            <article key={job.id} className="job-card">
              <div className="card-top-row">
                <div>
                  <p className="job-company">{job.company}</p>
                  <h3>{job.title}</h3>
                </div>
                <button className="save-button active" onClick={() => onSaveToggle(job.id)}>
                  <Heart size={16} />
                </button>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="card-bottom-row">
                <span>{job.posted}</span>
                <div className="card-actions">
                  <Link to={`/jobs/${job.id}`} className="text-link">Open</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function ApplicationsPage({ applications }: { applications: AppRecord[] }) {
  const statuses: AppRecord['status'][] = ['Interested', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><ClipboardCheck size={16} /> My Applications</div>
          <h1>Track every step</h1>
        </div>
      </div>

      <div className="application-board">
        {statuses.map((status) => {
          const list = applications.filter((app) => app.status === status);
          return (
            <div className="status-column" key={status}>
              <h4>{status}</h4>
              {list.length === 0 ? <div className="status-placeholder">No entries yet</div> : list.map((app) => (
                <div className="application-card" key={app.id}>
                  <strong>{app.title}</strong>
                  <span>{app.company}</span>
                  <small>{app.date}</small>
                  <p>{app.notes || 'No notes added yet.'}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function AICareerAssistantPage({ chatMessages, defaultPrompts, onSendPrompt }: { chatMessages: ChatMessage[]; defaultPrompts: string[]; onSendPrompt: (prompt: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <main className="container content-page assistant-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Bot size={16} /> AI Career Assistant</div>
          <h1>Let’s work through your next move.</h1>
        </div>
      </div>

      <div className="assistant-shell">
        <div className="assistant-prompts">
          {defaultPrompts.map((prompt) => (
            <button key={prompt} className="prompt-pill" onClick={() => onSendPrompt(prompt)}>{prompt}</button>
          ))}
        </div>

        <div className="chat-window">
          {chatMessages.map((message) => (
            <div key={message.id} className={`chat-message ${message.role}`}>
              {message.text}
            </div>
          ))}
        </div>

        <div className="assistant-input-row">
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ask Ivy6 about your CV, interview prep, or next career step..." />
          <button className="button primary-button" onClick={() => { onSendPrompt(value); setValue(''); }}>Send</button>
        </div>
      </div>
    </main>
  );
}

function ResumeBuilderPage() {
  const [form, setForm] = useState({
    fullName: 'Aisha Okafor',
    title: 'Product Designer',
    email: 'aisha@example.com',
    phone: '+234 801 234 5678',
    summary: 'Design-minded professional focused on human-centered digital experiences.',
    skills: 'Figma, UX research, Design systems, Wireframing, Research synthesis',
    experience: 'Product Designer • BrightPath Labs • Designed onboarding flows and simplified user journeys for a mobile banking product.'
  });

  const downloadResume = () => {
    const text = `Name: ${form.fullName}\nRole: ${form.title}\nEmail: ${form.email}\nPhone: ${form.phone}\nSummary: ${form.summary}\nSkills: ${form.skills}\nExperience: ${form.experience}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.txt`;
    link.click();
  };

  return (
    <main className="container content-page two-column-layout">
      <div className="page-header narrow">
        <div>
          <div className="eyebrow"><FileText size={16} /> Resume Builder</div>
          <h1>Build a CV you’re proud of.</h1>
        </div>
      </div>

      <div className="builder-layout">
        <div className="detail-card form-card">
          <label>Full name <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
          <label>Professional title <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Email <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Phone <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label>Professional summary <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></label>
          <label>Skills <textarea value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></label>
          <label>Experience <textarea value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></label>
          <button className="button primary-button" onClick={downloadResume}>Download CV text</button>
        </div>

        <div className="detail-card preview-card">
          <h3>Live CV preview</h3>
          <div className="resume-preview">
            <h4>{form.fullName}</h4>
            <p>{form.title}</p>
            <small>{form.email} • {form.phone}</small>
            <strong>Summary</strong>
            <p>{form.summary}</p>
            <strong>Skills</strong>
            <p>{form.skills}</p>
            <strong>Experience</strong>
            <p>{form.experience}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function CVAnalyzerPage() {
  const [cvText, setCvText] = useState('Product designer with 2 years of experience in UX research, wireframing, and design systems. Skilled in Figma, stakeholder communication, and creating intuitive product flows.');
  const [jobDescription, setJobDescription] = useState('We are hiring a product designer to create user flow wireframes, run research, and collaborate across teams. Experience with Figma, design systems, and product strategy highly valued.');

  const keywords = ['Figma', 'UX research', 'design systems', 'stakeholder communication'];
  const matched = keywords.filter((word) => cvText.toLowerCase().includes(word.toLowerCase()))
  const missing = keywords.filter((word) => !cvText.toLowerCase().includes(word.toLowerCase()));

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><ClipboardCheck size={16} /> CV Analyzer</div>
          <h1>Improve your CV before you apply.</h1>
        </div>
      </div>

      <div className="builder-layout">
        <div className="detail-card form-card">
          <label>Your CV text <textarea value={cvText} onChange={(e) => setCvText(e.target.value)} /></label>
          <label>Job description <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} /></label>
        </div>

        <div className="detail-card preview-card">
          <h3>Feedback summary</h3>
          <div className="score-list">
            <div className="score-box"><span>Keyword match</span><strong>{matched.length}/{keywords.length}</strong></div>
            <div className="score-box"><span>Clarity</span><strong>Strong</strong></div>
            <div className="score-box"><span>Formatting</span><strong>Good</strong></div>
          </div>
          <div className="analysis-points">
            <div><strong>Best matches:</strong> {matched.join(', ') || 'No strong keyword matches found.'}</div>
            <div><strong>Opportunities:</strong> {missing.length ? `Add ${missing.join(', ')} to strengthen alignment.` : 'No major gaps identified.'}</div>
            <div><strong>Improvement tip:</strong> Add measurable results and a short example of your impact to make the CV feel stronger.</div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CoverLetterPage() {
  const [form, setForm] = useState({
    fullName: 'Aisha Okafor',
    role: 'Product Designer',
    company: 'BrightPath Labs',
    story: 'I enjoy designing products that remove friction and help people feel more confident when they use digital tools.'
  });

  const letter = `Dear Hiring Manager,\n\nMy name is ${form.fullName}, and I am writing to express my interest in the ${form.role} position at ${form.company}. I am particularly excited by the opportunity to contribute to a team that values thoughtful product design and a user-first approach.\n\n${form.story}\n\nI would welcome the opportunity to discuss how my experience, adaptability, and curiosity could support your team. Thank you for considering my application.\n\nSincerely,\n${form.fullName}`;

  return (
    <main className="container content-page two-column-layout">
      <div className="page-header narrow">
        <div>
          <div className="eyebrow"><BookText size={16} /> Cover Letter Builder</div>
          <h1>Draft a tailored cover letter.</h1>
        </div>
      </div>

      <div className="builder-layout">
        <div className="detail-card form-card">
          <label>Full name <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
          <label>Role <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></label>
          <label>Company <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
          <label>Why this role? <textarea value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} /></label>
        </div>

        <div className="detail-card preview-card">
          <h3>Generated draft</h3>
          <textarea className="cover-letter-output" value={letter} readOnly />
          <button className="button primary-button" onClick={() => navigator.clipboard.writeText(letter)}>Copy to clipboard</button>
        </div>
      </div>
    </main>
  );
}

function InterviewPrepPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const currentQuestion = interviewQuestions[questionIndex];

  const handleNext = () => {
    if (!answer.trim()) {
      setFeedback('Try to answer the question with a real example and a clear structure.');
      return;
    }
    setFeedback('Strong answer structure: start with context, explain the task, describe your actions, and end by sharing the result. Keep it concise and specific.');
    setAnswer('');
    setQuestionIndex((prev) => (prev + 1) % interviewQuestions.length);
  };

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Mic size={16} /> Interview Practice</div>
          <h1>Prepare one question at a time.</h1>
        </div>
      </div>

      <div className="interview-panel">
        <div className="question-box">
          <span>Question {questionIndex + 1}</span>
          <h3>{currentQuestion}</h3>
        </div>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here..." />
        <div className="assistant-input-row">
          <button className="button primary-button" onClick={handleNext}>Next question</button>
        </div>
        {feedback && <div className="feedback-box">{feedback}</div>}
      </div>
    </main>
  );
}

function CareerPathsPage() {
  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Target size={16} /> Career Explorer</div>
          <h1>Explore the paths that may fit you best.</h1>
        </div>
      </div>

      <div className="tool-grid">
        {careerPaths.map((path) => (
          <div className="career-card" key={path.title}>
            <h3>{path.title}</h3>
            <p>{path.description}</p>
            <strong>Skills</strong>
            <div className="pill-list">
              {path.skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
            <small>{path.fit}</small>
          </div>
        ))}
      </div>
    </main>
  );
}

function CompaniesPage() {
  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Building2 size={16} /> Company Directory</div>
          <h1>Discover employers and teams.</h1>
        </div>
      </div>

      <div className="company-grid">
        {Array.from(new Set(jobListings.map((job) => job.company))).map((company) => (
          <div key={company} className="company-card">
            <h3>{company}</h3>
            <p>{jobListings.find((job) => job.company === company)?.description || 'Growing team creating meaningful digital experiences.'}</p>
            <Link to="/jobs" className="text-link">View roles</Link>
          </div>
        ))}
      </div>
    </main>
  );
}

function LoginPage({ currentUser, setCurrentUser, userList }: { currentUser: UserProfile | null; setCurrentUser: (user: UserProfile | null) => void; userList: UserProfile[] }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentUser) navigate('/profile');
  }, [currentUser, navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const match = userList.find((user) => user.email.toLowerCase() === form.email.toLowerCase() && user.password === form.password);
    if (!match) {
      setError('These login details do not match our records.');
      return;
    }
    setCurrentUser(match);
    navigate('/profile');
  };

  return (
    <main className="container content-page auth-wrap">
      <div className="auth-card">
        <div className="eyebrow"><LogIn size={16} /> Login</div>
        <h1>Welcome back</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email address <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password <div className="password-wrap"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button type="button" className="visibility-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
          {error && <div className="error-box">{error}</div>}
          <button className="button primary-button" type="submit">Login</button>
        </form>
        <div className="auth-links">
          <Link to="/signup">Create account</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </main>
  );
}

function SignupPage({ userList, onCreateUser, setCurrentUser }: { userList: UserProfile[]; onCreateUser: (users: UserProfile[]) => void; setCurrentUser: (user: UserProfile) => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim()) {
      setError('Please add your full name.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (userList.some((user) => user.email.toLowerCase() === form.email.toLowerCase())) {
      setError('An account with that email already exists.');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      location: 'Not set',
      skillSummary: 'Early career professional',
      remotePreference: 'Remote',
      careerGoal: 'Find my next opportunity',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    onCreateUser([newUser, ...userList]);
    setCurrentUser(newUser);
    navigate('/profile');
  };

  return (
    <main className="container content-page auth-wrap">
      <div className="auth-card">
        <div className="eyebrow"><Users size={16} /> Sign Up</div>
        <h1>Create your account</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full name <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></label>
          <label>Email address <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password <div className="password-wrap"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button type="button" className="visibility-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
          <label>Confirm password <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required /></label>
          {error && <div className="error-box">{error}</div>}
          <button className="button primary-button" type="submit">Create account</button>
        </form>
        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </main>
  );
}

function ForgotPasswordPage({ userList }: { userList: UserProfile[] }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const exists = userList.some((user) => user.email.toLowerCase() === email.toLowerCase());
    setStatus(exists ? 'A reset link has been prepared for your account. Configure your authentication provider to send it in production mode.' : 'If that email is linked to an account, a reset email will be sent.');
  };

  return (
    <main className="container content-page auth-wrap">
      <div className="auth-card">
        <div className="eyebrow"><ShieldCheck size={16} /> Forgot Password</div>
        <h1>Reset your password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email address <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <button className="button primary-button" type="submit">Request reset</button>
        </form>
        {status && <div className="success-box">{status}</div>}
        <div className="auth-links"><Link to="/login">Back to Login</Link></div>
      </div>
    </main>
  );
}

function ProfilePage({ currentUser, setCurrentUser }: { currentUser: UserProfile | null; setCurrentUser: (user: UserProfile | null) => void }) {
  const navigate = useNavigate();
  if (!currentUser) {
    return <main className="container content-page"><div className="empty-state"><h3>Sign in to view your profile.</h3><Link to="/login" className="button primary-button">Go to login</Link></div></main>;
  }

  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    location: currentUser.location,
    remotePreference: currentUser.remotePreference,
    careerGoal: currentUser.careerGoal,
    skillSummary: currentUser.skillSummary
  });

  const saveChanges = () => {
    setCurrentUser({ ...currentUser, ...form });
  };

  const handleDelete = () => {
    setCurrentUser(null);
    localStorage.removeItem('ivy-user');
    navigate('/');
  };

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><UserCircle2 size={16} /> Profile</div>
          <h1>Your profile</h1>
        </div>
      </div>

      <div className="builder-layout">
        <div className="detail-card form-card">
          <label>Full name <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
          <label>Location <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
          <label>Remote preference <select value={form.remotePreference} onChange={(e) => setForm({ ...form, remotePreference: e.target.value })}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
          <label>Career goal <input value={form.careerGoal} onChange={(e) => setForm({ ...form, careerGoal: e.target.value })} /></label>
          <label>Skills summary <textarea value={form.skillSummary} onChange={(e) => setForm({ ...form, skillSummary: e.target.value })} /></label>
          <button className="button primary-button" onClick={saveChanges}>Save profile</button>
          <button className="button danger-button" onClick={handleDelete}>Delete account</button>
        </div>

        <div className="detail-card preview-card">
          <h3>Quick overview</h3>
          <div className="score-list">
            <div className="score-box"><span>Preferred work</span><strong>{form.remotePreference}</strong></div>
            <div className="score-box"><span>Location</span><strong>{form.location}</strong></div>
            <div className="score-box"><span>Goal</span><strong>{form.careerGoal}</strong></div>
          </div>
          <div className="analysis-points">
            <div><strong>Skills:</strong> {form.skillSummary}</div>
            <div><strong>Account email:</strong> {currentUser.email}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactPage() {
  const [form, setForm] = useState<ContactSubmission>({
    name: '',
    email: '',
    category: 'General enquiry',
    subject: '',
    message: '',
    consent: false
  });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus('Please complete all required fields.');
      return;
    }
    if (!form.consent) {
      setStatus('Please confirm you agree to being contacted.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, honeypot: '' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to send message.');
      setStatus(data.demo ? 'Demo request accepted. Add your Resend API key to send live emails to Glowwithivyx@gmail.com.' : 'You’re all set! Your message has been sent to the Ivy6 team. We’ll be in touch as soon as we can. Thanks for reaching out.');
      setForm({ name: '', email: '', category: 'General enquiry', subject: '', message: '', consent: false });
    } catch (error) {
      setStatus('The email service is currently unavailable. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Mail size={16} /> Contact Ivy6</div>
          <h1>We’d love to hear from you.</h1>
        </div>
      </div>

      <div className="contact-layout">
        <div className="detail-card contact-card">
          <p><Phone size={16} /> 07045410578</p>
          <p><Mail size={16} /> Glowwithivyx@gmail.com</p>
          <p className="muted">Questions, ideas, or something we can improve? We’d love to hear from you.</p>
        </div>

        <form className="detail-card form-card" onSubmit={handleSubmit}>
          <label>Full name <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Email address <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Enquiry category <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>General enquiry</option><option>Technical support</option><option>Job listing issue</option><option>Employer enquiry</option><option>Partnership</option><option>Feedback</option><option>Other</option></select></label>
          <label>Subject <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></label>
          <label>Message <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
          <label className="checkbox-row"><input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} /> I consent to being contacted about this enquiry.</label>
          <button className="button primary-button" type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Submit'}</button>
          {status && <div className={status.includes('all set') || status.includes('Demo request accepted') ? 'success-box' : 'error-box'}>{status}</div>}
        </form>
      </div>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Sparkles size={16} /> About Ivy6</div>
          <h1>We’re here to help people move forward with more confidence.</h1>
        </div>
      </div>
      <div className="text-page">
        <p>Ivy6 was built to support people who feel stuck, overwhelmed, or uncertain about their next career move. We believe job searching should feel less lonely and more informed.</p>
        <p>Our platform blends job discovery, AI support, personal planning, and preparation tools so people can move from uncertainty to action without feeling abandoned in the process.</p>
      </div>
    </main>
  );
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><CircleHelp size={16} /> Help Centre</div>
          <h1>Frequently asked questions</h1>
        </div>
      </div>
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <div key={item.q} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              {item.q}
              <span>{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && <p>{item.a}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}

function PrivacyPage() {
  return <LegalPage title="Privacy Policy" text="We respect user privacy and only keep the information needed to support job discovery, account access, saved opportunities, and application tracking. We do not sell personal data. Profile information is protected and access is limited to the user and authorised administrators. Additional details can be added as the service evolves." />;
}

function TermsPage() {
  return <LegalPage title="Terms of Use" text="Ivy6 provides tools for career support and job discovery. These services are informational and should be used as part of a broader job-search process. Users remain responsible for making informed decisions about any opportunity or application and for using personal information responsibly." />;
}

function CookiePolicyPage() {
  return <LegalPage title="Cookie Policy" text="We may use cookies or similar technologies to improve site performance, remember preferences, and maintain secure session activity. You can manage or disable cookies in your browser settings. Some core features may not work properly without them." />;
}

function LegalPage({ title, text }: { title: string; text: string }) {
  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Shield size={16} /> Legal</div>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="text-page">
        <p>{text}</p>
      </div>
    </main>
  );
}

function EmployersPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Landmark size={16} /> Employers</div>
          <h1>Submit an opportunity for review.</h1>
        </div>
      </div>
      <div className="detail-card form-card employer-card">
        <label>Company name <input placeholder="Your company" /></label>
        <label>Role title <input placeholder="Senior product designer" /></label>
        <label>Email <input type="email" placeholder="hello@company.com" /></label>
        <label>Job description <textarea placeholder="Share the role details and location." /></label>
        <button className="button primary-button" onClick={() => setSubmitted(true)}>Submit for review</button>
        {submitted && <div className="success-box">Thank you. Your opportunity has been received and will be reviewed before publication.</div>}
      </div>
    </main>
  );
}

function AdminPage({ currentUser, isAdmin }: { currentUser: UserProfile | null; isAdmin: boolean }) {
  const [isAuthed, setIsAuthed] = useState(Boolean(currentUser && isAdmin));

  useEffect(() => {
    setIsAuthed(Boolean(currentUser && isAdmin));
  }, [currentUser, isAdmin]);

  if (!isAuthed) {
    return (
      <main className="container content-page">
        <div className="empty-state">
          <ShieldCheck size={32} />
          <h3>Access restricted.</h3>
          <p>This area is protected for authorised administrators only.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container content-page admin-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><LayoutDashboard size={16} /> Admin Dashboard</div>
          <h1>Platform overview</h1>
        </div>
      </div>

      <div className="admin-grid">
        <div className="detail-card stat-card"><span>Jobs reviewed</span><strong>128</strong></div>
        <div className="detail-card stat-card"><span>Live alerts</span><strong>24</strong></div>
        <div className="detail-card stat-card"><span>Reported listings</span><strong>3</strong></div>
        <div className="detail-card stat-card"><span>Active users</span><strong>1,460</strong></div>
      </div>

      <div className="admin-lists">
        <div className="detail-card">
          <h3>Pending job reviews</h3>
          <ul className="check-list compact-list">
            <li><CheckCircle2 size={18} /> Customer Success Associate</li>
            <li><CheckCircle2 size={18} /> Junior Data Analyst</li>
            <li><CheckCircle2 size={18} /> Product Operations Intern</li>
          </ul>
        </div>
        <div className="detail-card">
          <h3>Reports requiring attention</h3>
          <ul className="check-list compact-list">
            <li><ShieldCheck size={18} /> One duplicate listing</li>
            <li><ShieldCheck size={18} /> One employer submission with missing salary information</li>
            <li><ShieldCheck size={18} /> One suspicious job description flagged</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="container content-page">
      <div className="empty-state">
        <CircleDashed size={30} />
        <h3>Page not found.</h3>
        <p>The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="button primary-button">Return home</Link>
      </div>
    </main>
  );
}

export default App;

function useSearchParams(): URLSearchParams {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

function useNavigate() {
  throw new Error('The useNavigate hook is already provided by react-router-dom and should not be redefined.');
}

function useParams() {
  throw new Error('The useParams hook is already provided by react-router-dom and should not be redefined.');
}

function useLocation() {
  throw new Error('The useLocation hook is already provided by react-router-dom and should not be redefined.');
}
