export interface InternshipOpening {
  id: string;
  title: string;
  company: string;
  companyLogoText: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  stipend: string;
  batch: string;
  skills: string[];
  applyUrl: string;
  sourcePlatform: string;
  postedDate: string;
  deadline: string;
  description: string;
  weekNumber: number;
  featured?: boolean;
}

export interface WeeklyInternshipBatch {
  weekNumber: number;
  weekLabel: string;
  lastUpdated: string;
  targetApplicationsGoal: number;
  internships: InternshipOpening[];
}

export const CURRENT_WEEKLY_INTERNSHIPS: WeeklyInternshipBatch = {
  weekNumber: 41,
  weekLabel: 'Week of Oct 10 – Oct 17, 2026',
  lastUpdated: '2026-10-10',
  targetApplicationsGoal: 40,
  internships: [
    {
      id: 'intern-2026-w41-01',
      title: 'Research & Applied ML Intern',
      company: 'Microsoft India',
      companyLogoText: 'MS',
      location: 'Bengaluru / Hyderabad',
      workMode: 'Hybrid',
      stipend: '₹80,000 / month',
      batch: '2026 / 2027 Graduates',
      skills: ['Python', 'PyTorch', 'Deep Learning', 'Algorithms'],
      applyUrl: 'https://careers.microsoft.com/v2/global/en/internship_eligibility',
      sourcePlatform: 'Microsoft Careers',
      postedDate: 'Oct 09, 2026',
      deadline: 'Rolling / Early Applicant Advantage',
      description: 'Work alongside Microsoft Research teams developing large-scale generative models and applied intelligence pipelines.',
      weekNumber: 41,
      featured: true
    },
    {
      id: 'intern-2026-w41-02',
      title: 'Software Engineering & ML Student Intern',
      company: 'Google India',
      companyLogoText: 'GO',
      location: 'Bengaluru / Hyderabad',
      workMode: 'Hybrid',
      stipend: '₹90,000 / month',
      batch: '2026 / 2027 Engineering Students',
      skills: ['Python', 'C++', 'Data Structures', 'ML Fundamentals'],
      applyUrl: 'https://www.google.com/about/careers/applications/jobs/results/?q=internship%20india',
      sourcePlatform: 'Google Careers',
      postedDate: 'Oct 08, 2026',
      deadline: 'Rolling Evaluation',
      description: 'Design and implement scalable machine learning models and backend pipelines serving billions of users.',
      weekNumber: 41,
      featured: true
    },
    {
      id: 'intern-2026-w41-03',
      title: 'AI & Deep Learning Systems Intern',
      company: 'NVIDIA India',
      companyLogoText: 'NV',
      location: 'Bengaluru / Pune',
      workMode: 'Hybrid',
      stipend: '₹65,000 / month',
      batch: '2026 / 2027 Batch',
      skills: ['Python', 'CUDA', 'PyTorch', 'TensorRT', 'LLMs'],
      applyUrl: 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite',
      sourcePlatform: 'NVIDIA Careers',
      postedDate: 'Oct 09, 2026',
      deadline: '30 Oct 2026',
      description: 'Accelerate neural network inference and optimize model architectures using GPU acceleration libraries.',
      weekNumber: 41,
      featured: true
    },
    {
      id: 'intern-2026-w41-04',
      title: 'Applied Scientist / Machine Learning Intern',
      company: 'Amazon India',
      companyLogoText: 'AM',
      location: 'Bengaluru / Hyderabad',
      workMode: 'Hybrid',
      stipend: '₹75,000 / month',
      batch: '2026 / 2027 Batch',
      skills: ['Python', 'Scikit-Learn', 'NLP', 'Distributed Systems'],
      applyUrl: 'https://www.amazon.jobs/en/job_categories/machine-learning-science',
      sourcePlatform: 'Amazon Jobs',
      postedDate: 'Oct 07, 2026',
      deadline: 'Rolling Application',
      description: 'Build predictive customer intelligence models and automated NLP pipelines for Amazon retail and AWS services.',
      weekNumber: 41,
      featured: false
    },
    {
      id: 'intern-2026-w41-05',
      title: 'Machine Learning & GenAI Intern',
      company: 'Razorpay',
      companyLogoText: 'RZ',
      location: 'Bengaluru',
      workMode: 'Hybrid',
      stipend: '₹50,000 / month',
      batch: '2026 Batch',
      skills: ['Python', 'FastAPI', 'LangChain', 'Vector DBs', 'SQL'],
      applyUrl: 'https://razorpay.com/jobs/',
      sourcePlatform: 'Razorpay Careers',
      postedDate: 'Oct 08, 2026',
      deadline: '28 Oct 2026',
      description: 'Build real-time fraud detection and LLM-powered assistant workflows on payment infrastructure.',
      weekNumber: 41,
      featured: false
    },
    {
      id: 'intern-2026-w41-06',
      title: 'Data Science & Applied AI Intern',
      company: 'Swiggy',
      companyLogoText: 'SW',
      location: 'Bengaluru / Remote Friendly',
      workMode: 'Remote',
      stipend: '₹45,000 / month',
      batch: '2026 / 2027 Batch',
      skills: ['Python', 'Pandas', 'Predictive Modeling', 'Recommendation Systems'],
      applyUrl: 'https://careers.swiggy.com/',
      sourcePlatform: 'Swiggy Careers',
      postedDate: 'Oct 09, 2026',
      deadline: '31 Oct 2026',
      description: 'Develop recommendation and demand-forecasting algorithms using high-throughput feature stores.',
      weekNumber: 41,
      featured: false
    },
    {
      id: 'intern-2026-w41-07',
      title: 'Generative AI & Foundation Models Intern',
      company: 'Fractal Analytics',
      companyLogoText: 'FA',
      location: 'Mumbai / Bengaluru / Remote',
      workMode: 'Remote',
      stipend: '₹40,000 / month',
      batch: '2026 Graduates',
      skills: ['Python', 'Hugging Face', 'Prompt Engineering', 'RAG Pipelines'],
      applyUrl: 'https://fractal.ai/careers/',
      sourcePlatform: 'Fractal Careers',
      postedDate: 'Oct 07, 2026',
      deadline: 'Rolling Selection',
      description: 'Design Retrieval-Augmented Generation (RAG) pipelines and fine-tune open-weights models for enterprise clients.',
      weekNumber: 41,
      featured: false
    },
    {
      id: 'intern-2026-w41-08',
      title: 'Indic AI & LLM Research Intern',
      company: 'Sarvam AI / Krutrim',
      companyLogoText: 'SA',
      location: 'Bengaluru / Remote',
      workMode: 'Remote',
      stipend: '₹45,000 / month',
      batch: '2026 / 2027 Batch',
      skills: ['Python', 'PyTorch', 'Data Curation', 'Indian NLP'],
      applyUrl: 'https://internshala.com/internships/machine-learning-internship/',
      sourcePlatform: 'Internshala Premier',
      postedDate: 'Oct 08, 2026',
      deadline: 'Rolling Evaluation',
      description: 'Contribute to tokenization benchmarks, datasets curation, and evaluation suites for Indian language models.',
      weekNumber: 41,
      featured: false
    },
    {
      id: 'intern-2026-w41-09',
      title: 'ML & Applied Data Science Challenge Intern',
      company: 'Unstop Hiring Challenge',
      companyLogoText: 'UN',
      location: 'Pan-India',
      workMode: 'Remote',
      stipend: '₹30,000 / month + PPO',
      batch: '2026 / 2027 Batch',
      skills: ['Python', 'Scikit-Learn', 'Feature Engineering', 'Git'],
      applyUrl: 'https://unstop.com/internships',
      sourcePlatform: 'Unstop Opportunities',
      postedDate: 'Oct 09, 2026',
      deadline: '25 Oct 2026',
      description: 'Participate in the nationwide ML sprint track with fast-track direct interviews and internship offers.',
      weekNumber: 41,
      featured: false
    },
    {
      id: 'intern-2026-w41-10',
      title: 'Open Source AI & Transformers Fellow',
      company: 'Hugging Face Ecosystem',
      companyLogoText: 'HF',
      location: 'Worldwide Remote',
      workMode: 'Remote',
      stipend: '₹60,000 / month ($700 USD)',
      batch: 'Open to All Students',
      skills: ['Python', 'Transformers', 'Gradio', 'Spaces', 'Open Source'],
      applyUrl: 'https://huggingface.co/jobs',
      sourcePlatform: 'Hugging Face Careers',
      postedDate: 'Oct 06, 2026',
      deadline: 'Rolling',
      description: 'Build public AI demos, create Gradio applications, and contribute to state-of-the-art open-source repositories.',
      weekNumber: 41,
      featured: true
    }
  ]
};
