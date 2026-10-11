import { BrowserRouter, NavLink, Route, Routes, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Briefcase,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Heart,
  LogIn,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';

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
    applicationUrl: 'https://example.com/apply/brightpath',
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
    applicationUrl: 'https://example.com/apply/mileone',
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
    applicationUrl: 'https://example.com/apply/northstar',
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
    applicationUrl: 'https://example.com/apply/astercloud',
  },
];

const defaultPrompts = [
  'Help me find jobs that match my skills.',
  'Improve my CV.',
  'Explain this job description.',
  'Help me prepare for an interview.',
  'I have no work experience. Where should I start?',
  'Help me write a cover letter.',
];

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Find Jobs', path: '/jobs' },
  { label: 'Saved Jobs', path: '/saved-jobs' },
  { label: 'AI Career Assistant', path: '/ai-career-assistant' },
  { label: 'Applications', path: '/applications' },
  { label: 'Login', path: '/login' },
  { label: 'Sign Up', path: '/signup' },
];

function readStorage<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => readStorage<UserProfile | null>('ivy-user', null));
  const [userList, setUserList] = useState<UserProfile[]>(() => readStorage<UserProfile[]>('ivy-users', []));
  const [savedJobs, setSavedJobs] = useState<string[]>(() => readStorage<string[]>('ivy-saved-jobs', []));
  const [applications, setApplications] = useState<AppRecord[]>(() => readStorage<AppRecord[]>('ivy-applications', []));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => readStorage<ChatMessage[]>('ivy-chat-messages', [
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hey, welcome to Ivy6. Looking for a job, working on your CV, or trying to figure out your next move? We can work through it together.',
    },
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
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
  };

  const addApplication = (job: Job, status: AppRecord['status'], notes = '') => {
    const record: AppRecord = {
      id: `${job.id}-${Date.now()}`,
      jobId: job.id,
      company: job.company,
      title: job.title,
      status,
      notes,
      date: formatDate(new Date()),
    };
    setApplications((prev) => [record, ...prev]);
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === 'admin@ivy6.com';

  const aiReply = (prompt: string) => {
    const clean = prompt.toLowerCase();

    if (clean.includes('cv') || clean.includes('resume')) {
      return 'Lead with your strongest impact, keep formatting simple, and quantify achievements when you can. If you are early in your career, highlight transferable skills, school work, and side projects.';
    }

    if (clean.includes('interview')) {
      return 'Use the STAR method: Situation, Task, Action, Result. Keep your answers clear, concise, and relevant to the role.';
    }

    if (clean.includes('cover letter')) {
      return 'A good cover letter is personal and specific. Mention why the role fits your strengths and share 2-3 points that show why you would be valuable.';
    }

    if (clean.includes('experience') || clean.includes('no work')) {
      return 'You do not need a perfect CV to start. Lead with transferable skills, volunteer work, projects, and strengths you can prove.';
    }

    if (clean.includes('remote') || clean.includes('job')) {
      return 'Start with roles that match your current strengths and preferred working style. Build a focused shortlist and apply with custom motivation.';
    }

    return 'Break the goal into a simple plan: identify a target role, match your strengths to the job, and take one clear next step this week.';
  };

  const addAiMessage = (text: string, role: 'assistant' | 'user' = 'user') => {
    setChatMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, role, text }]);
  };

  const submitAiPrompt = (prompt: string) => {
    if (!prompt.trim()) return;
    addAiMessage(prompt, 'user');
    window.setTimeout(() => {
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
        createdAt: new Date().toISOString(),
      };
      setUserList((prev) => [adminUser, ...prev]);
    }
  };

  useEffect(() => {
    seedAdminIfNeeded();
  }, [userList]);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppLayout currentUser={currentUser} isAdmin={isAdmin} onLogout={() => setCurrentUser(null)} savedJobs={savedJobs} />
        <Routes>
          <Route path="/" element={<HomePage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} />} />
          <Route path="/jobs" element={<JobsPage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} addApplication={addApplication} />} />
          <Route path="/saved-jobs" element={<SavedJobsPage savedJobs={savedJobs} onSaveToggle={toggleSavedJob} />} />
          <Route path="/applications" element={<ApplicationsPage applications={applications} />} />
          <Route path="/ai-career-assistant" element={<AICareerAssistantPage chatMessages={chatMessages} defaultPrompts={defaultPrompts} onSendPrompt={submitAiPrompt} />} />
          <Route path="/login" element={<LoginPage currentUser={currentUser} setCurrentUser={setCurrentUser} userList={userList} />} />
          <Route path="/signup" element={<SignupPage userList={userList} onCreateUser={setUserList} setCurrentUser={setCurrentUser} />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/contact" element={<ContactPage />} />
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

        <button type="button" className="menu-toggle" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => {
            if ((item.path === '/login' || item.path === '/signup') && currentUser) return null;
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            );
          })}

          {currentUser && (
            <>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} onClick={() => setMenuOpen(false)}>
                Profile
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} onClick={() => setMenuOpen(false)}>
                  Admin
                </NavLink>
              )}
              <button type="button" className="button ghost-button" onClick={onLogout}>Sign Out</button>
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
            <Link to="/saved-jobs">Saved Jobs</Link>
            <Link to="/ai-career-assistant">AI Assistant</Link>
          </div>
        </div>
        <div>
          <h4>Support</h4>
          <div className="footer-links">
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ savedJobs, onSaveToggle }: { savedJobs: string[]; onSaveToggle: (jobId: string) => void }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

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
            <h1>Your next opportunity starts here.</h1>
            <p>Job hunting can feel overwhelming. Finding your next opportunity does not have to be.</p>
            <div className="hero-actions">
              <button type="button" className="button primary-button" onClick={() => navigate('/jobs')}>Find My Next Job <ArrowRight size={18} /></button>
              <button type="button" className="button secondary-button" onClick={() => navigate('/ai-career-assistant')}>Meet Your AI Career Assistant</button>
            </div>

            <form className="search-panel" onSubmit={handleSubmit}>
              <div className="search-row">
                <label>
                  <span>What kind of job are you looking for?</span>
                  <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Product design, data analyst..." />
                </label>
                <label>
                  <span>Where would you like to work?</span>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lagos, Remote, Abuja..." />
                </label>
                <button type="submit" className="button primary-button compact">Search jobs</button>
              </div>
            </form>
          </div>

          <div className="hero-visual">
            <div className="hero-preview">
              <div className="preview-top">
                <div className="dot red" />
                <div className="dot yellow" />
                <div className="dot green" />
              </div>
              <div className="preview-card">
                <div className="preview-header">
                  <span className="sidebar-dot" />
                  <span>Career dashboard</span>
                </div>
                <div className="preview-content">
                  <div className="stat-box">
                    <small>Potential matches</small>
                    <strong>12</strong>
                  </div>
                  <div className="mini-bars">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="list-item"><span /> <small>CV improvement ready</small></div>
                  <div className="list-item"><span /> <small>Interview prep queued</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-head">
          <div>
            <div className="eyebrow"><Sparkles size={16} /> Recommended opportunities</div>
            <h2>Opportunities to explore</h2>
          </div>
          <Link to="/jobs" className="text-link">See all jobs</Link>
        </div>

        <div className="job-grid">
          {featuredJobs.map((job) => (
            <article key={job.id} className="job-card">
              <div className="card-top-row">
                <div>
                  <p className="job-company">{job.company}</p>
                  <h3>{job.title}</h3>
                </div>
                <button type="button" className={`save-button ${savedJobs.includes(job.id) ? 'active' : ''}`} onClick={() => onSaveToggle(job.id)} aria-label={`Save ${job.title}`}>
                  <Heart size={16} />
                </button>
              </div>
              <div className="meta-row">
                <span><Briefcase size={14} /> {job.employmentType}</span>
                <span>{job.location}</span>
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
    if (!value || value === 'All') params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  const clearAll = () => setSearchParams({});

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><Search size={16} /> Find Jobs</div>
          <h1>Explore opportunities</h1>
        </div>
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
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <Search size={30} />
          <h3>Nothing matching your search just yet.</h3>
          <p>Try broadening your keyword, location, or remote filters.</p>
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
                <button type="button" className={`save-button ${savedJobs.includes(job.id) ? 'active' : ''}`} onClick={() => onSaveToggle(job.id)}>
                  <Heart size={16} />
                </button>
              </div>
              <div className="meta-row">
                <span>{job.location}</span>
                <span>{job.employmentType}</span>
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
      )}
    </main>
  );
}

function JobDetailPage({ savedJobs, onSaveToggle, addApplication }: { savedJobs: string[]; onSaveToggle: (jobId: string) => void; addApplication: (job: Job, status: AppRecord['status'], notes?: string) => void }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = jobListings.find((entry) => entry.id === jobId);

  if (!job) {
    return (
      <main className="container content-page">
        <div className="empty-state">
          <h3>Job not found.</h3>
          <Link to="/jobs" className="button primary-button">Back to jobs</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container content-page job-detail-wrap">
      <div className="job-detail-header">
        <div>
          <div className="eyebrow"><BriefcaseBusiness size={16} /> {job.company}</div>
          <h1>{job.title}</h1>
          <div className="meta-row detail-meta">
            <span>{job.location}</span>
            <span>{job.posted}</span>
            <span>{job.remote}</span>
          </div>
        </div>
        <div className="job-detail-actions">
          <button type="button" className={`button ${savedJobs.includes(job.id) ? 'secondary-button' : 'primary-button'}`} onClick={() => onSaveToggle(job.id)}>
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
              {job.responsibilities.map((item) => (
                <li key={item}><CheckCircle2 size={18} /> {item}</li>
              ))}
            </ul>
          </div>
          <div className="detail-card">
            <h3>Qualifications</h3>
            <ul className="check-list">
              {job.qualifications.map((item) => (
                <li key={item}><CheckCircle2 size={18} /> {item}</li>
              ))}
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
            </div>
          </div>

          <div className="detail-card side-card">
            <h3>Advance your application</h3>
            <button type="button" className="button secondary-button" onClick={() => addApplication(job, 'Interested', 'Saved for later follow-up.')}>Track interest</button>
            <button type="button" className="button ghost-button" onClick={() => navigate('/profile')}>Build my CV</button>
          </div>
        </aside>
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
          <Heart size={30} />
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
                <button type="button" className="save-button active" onClick={() => onSaveToggle(job.id)}>
                  <Heart size={16} />
                </button>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="card-bottom-row">
                <span>{job.posted}</span>
                <Link to={`/jobs/${job.id}`} className="text-link">Open</Link>
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
            <button type="button" key={prompt} className="prompt-pill" onClick={() => onSendPrompt(prompt)}>{prompt}</button>
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
          <button type="button" className="button primary-button" onClick={() => { onSendPrompt(value); setValue(''); }}>Send</button>
        </div>
      </div>
    </main>
  );
}

function LoginPage({ currentUser, setCurrentUser, userList }: { currentUser: UserProfile | null; setCurrentUser: (user: UserProfile | null) => void; userList: UserProfile[] }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

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
          <label>Password <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          {error && <div className="error-box">{error}</div>}
          <button type="submit" className="button primary-button">Login</button>
        </form>
        <div className="auth-links">
          <Link to="/signup">Create account</Link>
        </div>
      </div>
    </main>
  );
}

function SignupPage({ userList, onCreateUser, setCurrentUser }: { userList: UserProfile[]; onCreateUser: (users: UserProfile[]) => void; setCurrentUser: (user: UserProfile) => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

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
      createdAt: new Date().toISOString(),
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
          <label>Password <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <label>Confirm password <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required /></label>
          {error && <div className="error-box">{error}</div>}
          <button type="submit" className="button primary-button">Create account</button>
        </form>
      </div>
    </main>
  );
}

function ProfilePage({ currentUser, setCurrentUser }: { currentUser: UserProfile | null; setCurrentUser: (user: UserProfile | null) => void }) {
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <main className="container content-page">
        <div className="empty-state">
          <h3>Sign in to view your profile.</h3>
          <Link to="/login" className="button primary-button">Go to login</Link>
        </div>
      </main>
    );
  }

  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    location: currentUser.location,
    remotePreference: currentUser.remotePreference,
    careerGoal: currentUser.careerGoal,
    skillSummary: currentUser.skillSummary,
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
          <button type="button" className="button primary-button" onClick={saveChanges}>Save profile</button>
          <button type="button" className="button danger-button" onClick={handleDelete}>Delete account</button>
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
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus('Please complete all fields.');
      return;
    }
    setStatus('Thanks for reaching out. We will respond soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="container content-page">
      <div className="page-header">
        <div>
          <div className="eyebrow"><ShieldCheck size={16} /> Contact Ivy6</div>
          <h1>We’d love to hear from you.</h1>
        </div>
      </div>
      <div className="detail-card form-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full name <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Email address <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Subject <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></label>
          <label>Message <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
          <button type="submit" className="button primary-button">Send</button>
          {status && <div className="success-box">{status}</div>}
        </form>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="container content-page">
      <div className="empty-state">
        <h3>Page not found.</h3>
        <p>The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="button primary-button">Return home</Link>
      </div>
    </main>
  );
}

export default App;
