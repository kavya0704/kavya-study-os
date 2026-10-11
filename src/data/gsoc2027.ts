import { 
  GsocResource, 
  GsocPhase, 
  GsocWeek, 
  GsocDay, 
  OrganizationResearch, 
  OfficialEvent 
} from '../types/gsoc';
import { generateTargets, GSOC_START_DATE, GSOC_END_DATE } from '../engines/gsocDateUtils';

export const GSOC_CONFIG = {
  owner: 'Kavya Shaw',
  track: 'B.Tech CSE (AI/ML) · Graduation: 2028',
  startDate: GSOC_START_DATE,
  endDate: GSOC_END_DATE,
  totalTargets: 223,
  totalWeeks: 32,
  timeZone: 'Asia/Kolkata',
  curriculumVersion: '2027-prep-2026-10-11'
};

export const GSOC_OFFICIAL_EVENTS: OfficialEvent[] = [
  {
    id: 'organizationAnnouncement',
    instant: null,
    status: 'unannounced',
    sourceUrl: 'https://developers.google.com/open-source/gsoc/timeline',
    verifiedAt: null,
    estimateLabel: 'Estimate: mid-February 2027 · awaiting official announcement'
  },
  {
    id: 'applicationOpen',
    instant: null,
    status: 'unannounced',
    sourceUrl: 'https://developers.google.com/open-source/gsoc/timeline',
    verifiedAt: null,
    estimateLabel: 'Estimate: late-March 2027 · awaiting official announcement'
  },
  {
    id: 'applicationDeadline',
    instant: null,
    status: 'unannounced',
    sourceUrl: 'https://developers.google.com/open-source/gsoc/timeline',
    verifiedAt: null,
    estimateLabel: 'Estimate: early-April 2027 · awaiting official announcement'
  },
  {
    id: 'resultsAnnouncement',
    instant: null,
    status: 'unannounced',
    sourceUrl: 'https://developers.google.com/open-source/gsoc/timeline',
    verifiedAt: null,
    estimateLabel: 'Estimate: early-May 2027 · awaiting official announcement'
  },
  {
    id: 'bondingStart',
    instant: null,
    status: 'unannounced',
    sourceUrl: 'https://developers.google.com/open-source/gsoc/timeline',
    verifiedAt: null,
    estimateLabel: 'Estimate: May 2027 · awaiting official announcement'
  },
  {
    id: 'codingStart',
    instant: null,
    status: 'unannounced',
    sourceUrl: 'https://developers.google.com/open-source/gsoc/timeline',
    verifiedAt: null,
    estimateLabel: 'Estimate: late-May/June 2027 · awaiting official announcement'
  }
];

export const GSOC_RESOURCES: GsocResource[] = [
  // YouTube Videos (V01–V16)
  {
    id: 'V01',
    title: 'So you want to be a Google Summer of Code Contributor?',
    channelOrPublisher: 'Google Open Source / GSoC',
    url: 'https://youtu.be/YN7uGCg5vLg',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Short overview',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V02',
    title: 'Git & GitHub Crash Course 2025',
    channelOrPublisher: 'Traversy Media',
    url: 'https://www.youtube.com/watch?v=vA5TTz6BXhY',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 1 hour',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V03',
    title: 'Git and GitHub for Beginners — Crash Course',
    channelOrPublisher: 'freeCodeCamp / Gwen Faraday',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 1 hour',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V04',
    title: 'Complete Guide to Open Source — How to Contribute',
    channelOrPublisher: 'freeCodeCamp / Eddie Jaoude',
    url: 'https://www.youtube.com/watch?v=yzeVMecydCE',
    type: 'video',
    language: 'English',
    durationSeconds: 2512,
    approximateDurationLabel: '41:52',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V05',
    title: 'Command Line Basics for Beginners — Full Course',
    channelOrPublisher: 'freeCodeCamp / Scrimba',
    url: 'https://youtu.be/mABpAI-pCw0',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 1 hour',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V06',
    title: 'Python Full Course for free',
    channelOrPublisher: 'Bro Code',
    url: 'https://www.youtube.com/watch?v=ix9cRaBkVe0',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Comprehensive Python video',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V07',
    title: 'Python Tutorials playlist',
    channelOrPublisher: 'Corey Schafer',
    url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
    type: 'playlist',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'In-depth modular playlist',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V08',
    title: 'Pytest Tutorial — How to Test Python Code',
    channelOrPublisher: 'freeCodeCamp / Farhan Ali',
    url: 'https://www.youtube.com/watch?v=cHYq1MRoyI0',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 2 hours',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V09',
    title: 'Unit Testing with the unittest Module',
    channelOrPublisher: 'Corey Schafer',
    url: 'https://www.youtube.com/watch?v=6tNS--WetLI',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 45 minutes',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V10',
    title: 'Python NumPy Tutorial for Beginners',
    channelOrPublisher: 'freeCodeCamp / Keith Galli',
    url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 1 hour',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V11',
    title: 'Complete Python Pandas Data Science Tutorial',
    channelOrPublisher: 'Keith Galli',
    url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 1 hour',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V12',
    title: 'Matplotlib: Creating and Customizing Our First Plots',
    channelOrPublisher: 'Corey Schafer',
    url: 'https://www.youtube.com/watch?v=UO98lJQ3QGI',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 30 minutes',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V13',
    title: 'Matplotlib Tutorials playlist',
    channelOrPublisher: 'Corey Schafer',
    url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_',
    type: 'playlist',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Plotting playlist',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V14',
    title: 'PyTorch for Deep Learning & Machine Learning — Full Course',
    channelOrPublisher: 'freeCodeCamp / Daniel Bourke',
    url: 'https://www.youtube.com/watch?v=V_xro1bcAuA',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: '26 hours total · selective chapters only',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V15',
    title: 'Machine Learning for Everybody — Full Course',
    channelOrPublisher: 'freeCodeCamp / Kylie Ying',
    url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 4 hours',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'V16',
    title: 'GitHub Actions Certification — Full Course',
    channelOrPublisher: 'freeCodeCamp / Andrew Brown',
    url: 'https://www.youtube.com/watch?v=Tz7FsunBbfQ',
    type: 'video',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'About 3 hours',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },

  // Official Documentation & Guides (D01–D12)
  {
    id: 'D01',
    title: 'GitHub Hello World Walkthrough',
    channelOrPublisher: 'GitHub Docs',
    url: 'https://docs.github.com/en/get-started/using-github/hello-world',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Interactive guide',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D02',
    title: 'Contributing to Open Source on GitHub',
    channelOrPublisher: 'GitHub Docs',
    url: 'https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-open-source',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Official docs',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D03',
    title: 'Pro Git Book (Free Official Reference)',
    channelOrPublisher: 'Scott Chacon & Ben Straub',
    url: 'https://git-scm.com/book/en/v2',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Book reference',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D04',
    title: 'Connecting to GitHub with SSH Keys',
    channelOrPublisher: 'GitHub Docs',
    url: 'https://docs.github.com/en/authentication/connecting-to-github-with-ssh',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Official security guide',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D05',
    title: 'First Contributions Practice Repository',
    channelOrPublisher: 'First Contributions Community',
    url: 'https://github.com/firstcontributions/first-contributions',
    type: 'exercise',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Hands-on practice PR',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D06',
    title: 'GitHub Open Source Guide: How to Contribute',
    channelOrPublisher: 'GitHub Open Source Guides',
    url: 'https://opensource.guide/how-to-contribute/',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Essential etiquette',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D07',
    title: 'The Official Python Tutorial',
    channelOrPublisher: 'Python Software Foundation',
    url: 'https://docs.python.org/3/tutorial/',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Language reference',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D08',
    title: 'Python Virtual Environments & Packages',
    channelOrPublisher: 'Python Software Foundation',
    url: 'https://docs.python.org/3/tutorial/venv.html',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Official venv docs',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D09',
    title: 'Pytest Getting Started Guide',
    channelOrPublisher: 'pytest-dev',
    url: 'https://docs.pytest.org/en/stable/getting-started.html',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Official testing guide',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D10',
    title: 'Learn PyTorch Open Course Material',
    channelOrPublisher: 'Daniel Bourke',
    url: 'https://www.learnpytorch.io/',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Notebooks reference',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D11',
    title: 'NumPy Absolute Basics for Beginners',
    channelOrPublisher: 'NumPy.org',
    url: 'https://numpy.org/doc/stable/user/absolute_beginners.html',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Official array guide',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'D12',
    title: 'GitHub Actions Quickstart',
    channelOrPublisher: 'GitHub Docs',
    url: 'https://docs.github.com/en/actions/get-started/quickstart',
    type: 'docs',
    language: 'English',
    durationSeconds: null,
    approximateDurationLabel: 'Official CI guide',
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },

  // Official GSoC Links (O01–O13)
  {
    id: 'O01',
    title: 'Google Summer of Code Official Home',
    channelOrPublisher: 'Google Open Source',
    url: 'https://summerofcode.withgoogle.com/',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O02',
    title: 'GSoC Official FAQ & Eligibility',
    channelOrPublisher: 'Google Open Source',
    url: 'https://developers.google.com/open-source/gsoc/faq',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O03',
    title: 'GSoC Official Timeline',
    channelOrPublisher: 'Google Open Source',
    url: 'https://developers.google.com/open-source/gsoc/timeline',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O04',
    title: 'GSoC Program Rules',
    channelOrPublisher: 'Google Open Source',
    url: 'https://summerofcode.withgoogle.com/rules/',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O05',
    title: 'GSoC Contributor Guide: Student Manual',
    channelOrPublisher: 'Google Open Source',
    url: 'https://google.github.io/gsocguides/student/',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O06',
    title: 'GSoC Guide: Choosing an Organization',
    channelOrPublisher: 'Google Open Source',
    url: 'https://google.github.io/gsocguides/student/choosing-an-organization',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O07',
    title: 'GSoC Guide: Making First Contact',
    channelOrPublisher: 'Google Open Source',
    url: 'https://google.github.io/gsocguides/student/making-first-contact',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O08',
    title: 'GSoC Guide: Writing a Proposal',
    channelOrPublisher: 'Google Open Source',
    url: 'https://google.github.io/gsocguides/student/writing-a-proposal',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O09',
    title: 'GSoC Guide: Communication Best Practices',
    channelOrPublisher: 'Google Open Source',
    url: 'https://google.github.io/gsocguides/student/communication-best-practices',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O10',
    title: 'Python Software Foundation (PSF) Historical Ideas List',
    channelOrPublisher: 'PSF GSoC',
    url: 'https://python-gsoc.org/ideas.html',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O11',
    title: 'NumFOCUS GSoC Historical Ideas Directory',
    channelOrPublisher: 'NumFOCUS',
    url: 'https://github.com/numfocus/gsoc/blob/master/2026/ideas-list.md',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O12',
    title: 'GSoC Official Guidance on AI-Generated Submissions',
    channelOrPublisher: 'Google Open Source',
    url: 'https://developers.google.com/open-source/gsoc/resources/ai_guidance',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'O13',
    title: 'GSoC Guide: Being Turned Down & Continuation',
    channelOrPublisher: 'Google Open Source',
    url: 'https://google.github.io/gsocguides/student/being-turned-down',
    type: 'program',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },

  // Contributor Case Studies (C01–C04)
  {
    id: 'C01',
    title: 'Shilpi Prasad: DIPY GSoC 2023 Contributor Journey',
    channelOrPublisher: 'DIPY Blog',
    url: 'https://dipy.org/posts/2023/2023_05_29_Shilpi_Week_0_1.html',
    type: 'case_study',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'C02',
    title: 'DIPY Feature Pull Request #2749 (Shilpi Prasad)',
    channelOrPublisher: 'DIPY Repository',
    url: 'https://github.com/dipy/dipy/pull/2749',
    type: 'case_study',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'C03',
    title: 'Tomás Guija Valiente: DIPY GSoC 2026 First Steps',
    channelOrPublisher: 'DIPY Blog',
    url: 'https://dipy.org/posts/2026/2026_05_25_Tomas.html',
    type: 'case_study',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  },
  {
    id: 'C04',
    title: 'Wagtail Contributor Guide: Strategic High-Quality PRs',
    channelOrPublisher: 'Wagtail CMS Community',
    url: 'https://github.com/wagtail/gsoc/blob/main/contributor-guide.md',
    type: 'case_study',
    language: 'English',
    durationSeconds: null,
    verifiedAt: '2026-10-11',
    verification: 'title_or_page_opened'
  }
];

export const GSOC_ORGANIZATIONS: OrganizationResearch[] = [
  {
    id: 'dipy',
    name: 'DIPY (Diffusion Imaging in Python)',
    umbrella: 'Python Software Foundation (PSF)',
    status: 'exploring',
    repoUrl: 'https://github.com/dipy/dipy',
    issuesUrl: 'https://github.com/dipy/dipy/issues',
    contributingUrl: 'https://github.com/dipy/dipy/blob/aaecdba94a98d0f2ad329932e7c24d31f646f0fd/.github/CONTRIBUTING.md',
    ideasUrl: 'https://github.com/dipy/dipy/wiki/Google-Summer-of-Code-2026',
    stack: ['Python', 'NumPy', 'SciPy', 'Cython', 'Medical Imaging'],
    historicalRequirements: 'Python/NumPy analysis experience. Recommends at least one small bug fix, docs improvement or enhancement before applying.',
    prerequisites: 'Comfortable with NumPy array indexing, shapes, testing fixtures, and basic scientific imaging pipelines.',
    channelName: 'DIPY Gitter / Discussions',
    channelUrl: 'https://github.com/dipy/dipy/discussions',
    codeMapNotes: 'Core entry point -> dipy.core -> dipy.reconst -> tests/test_*.py.',
    notes: 'Recommended for scientific computing & imaging interests. Pair with NumPy revision.',
    confirmed2027: false
  },
  {
    id: 'ignite',
    name: 'PyTorch-Ignite',
    umbrella: 'NumFOCUS',
    status: 'exploring',
    repoUrl: 'https://github.com/pytorch/ignite',
    issuesUrl: 'https://github.com/pytorch/ignite/issues',
    contributingUrl: 'https://github.com/pytorch/ignite/blob/master/CONTRIBUTING.md',
    ideasUrl: 'https://github.com/pytorch/ignite/wiki/GSoC-2026-project-idea',
    stack: ['Python', 'PyTorch', 'Deep Learning', 'pytest', 'CI'],
    historicalRequirements: '2026 ideas page specifically required at least 3 accepted PRs before proposal evaluation.',
    prerequisites: 'Understanding of PyTorch training loops, Engine, Events, metrics, handlers, and clean pytest unit tests.',
    channelName: 'PyTorch-Ignite Discord / GitHub Discussions',
    channelUrl: 'https://github.com/pytorch/ignite/discussions',
    codeMapNotes: 'ignite.engine.Engine -> ignite.metrics -> tests/ignite/engine.',
    notes: 'Direct connection to PyTorch & AI/ML coursework. Watch historical 3 accepted PRs rule closely.',
    confirmed2027: false
  },
  {
    id: 'matplotlib',
    name: 'Matplotlib',
    umbrella: 'NumFOCUS',
    status: 'exploring',
    repoUrl: 'https://github.com/matplotlib/matplotlib',
    issuesUrl: 'https://github.com/matplotlib/matplotlib/issues',
    contributingUrl: 'https://matplotlib.org/devdocs/devel/index.html',
    ideasUrl: 'https://github.com/matplotlib/matplotlib/wiki/Matplotlib-GSoC-2026-Ideas',
    stack: ['Python', 'NumPy', 'C++', 'GUI Backends', 'Plotting'],
    historicalRequirements: 'Demonstrated proficiency in Python & NumPy. Core backend/GUI work has substantial prerequisites.',
    prerequisites: 'Python plotting API, image comparison tests, pytest fixtures, and clean reproducible scripts.',
    channelName: 'Matplotlib Discourse',
    channelUrl: 'https://discourse.matplotlib.org/',
    codeMapNotes: 'matplotlib.pyplot -> matplotlib.axes._axes -> lib/matplotlib/tests.',
    notes: 'Valuable alternative for foundational plotting, documentation, and rigorous visual testing.',
    confirmed2027: false
  },
  {
    id: 'holidays',
    name: 'Open World Holidays (vacanza/holidays)',
    umbrella: 'Python Software Foundation (PSF)',
    status: 'exploring',
    repoUrl: 'https://github.com/vacanza/holidays',
    issuesUrl: 'https://github.com/vacanza/holidays/issues',
    contributingUrl: 'https://holidays.readthedocs.io/en/latest/contributing/',
    ideasUrl: 'https://github.com/vacanza/holidays/wiki/GSoC-2026',
    stack: ['Python', 'Calendar Logic', 'pytest', 'Date Utilities'],
    historicalRequirements: 'Pure Python with strong unit test discipline and verified official government/legal holiday sources.',
    prerequisites: 'Python datetime arithmetic, inheritance, parameterization, and strict sourcing guidelines.',
    channelName: 'GitHub Discussions / Issues',
    channelUrl: 'https://github.com/vacanza/holidays/discussions',
    codeMapNotes: 'holidays.countries -> holidays.holiday_base -> tests/countries.',
    notes: 'Approachable pure-Python community. Zero C++ dependencies; excellent for building contribution discipline.',
    confirmed2027: false
  },
  {
    id: 'opencv',
    name: 'OpenCV',
    umbrella: 'OpenCV Foundation',
    status: 'exploring',
    repoUrl: 'https://github.com/opencv/opencv',
    issuesUrl: 'https://github.com/opencv/opencv/issues',
    contributingUrl: 'https://github.com/opencv/opencv/wiki/How_to_contribute',
    ideasUrl: 'https://github.com/opencv/opencv/wiki/GSoC_2026',
    stack: ['C++', 'Python', 'Computer Vision', 'CMake', 'CUDA'],
    historicalRequirements: 'Most core work is in C++ unless noted otherwise in specific ideas.',
    prerequisites: 'Strong C++ and Python bindings understanding, CMake builds, and computer vision foundations.',
    channelName: 'OpenCV Forum / Pull Requests',
    channelUrl: 'https://forum.opencv.org/',
    codeMapNotes: 'modules/core -> modules/imgproc -> python/cv2.',
    notes: 'Stretch choice due to heavy C++ build requirements. Only consider if prerequisites are met.',
    confirmed2027: false
  }
];

export const GSOC_PHASES: GsocPhase[] = [
  {
    id: 'P1',
    phaseNumber: 1,
    title: 'Git and Collaboration from Zero',
    focus: 'Git CLI, branches, remotes, conflicts, and PR etiquette',
    targetRangeText: '21 Oct – 3 Nov 2026',
    startDate: '2026-10-21',
    endDate: '2026-11-03',
    evidenceToProduce: 'Practice repo, conflict resolved, PR workflow repeated independently without tutorials.'
  },
  {
    id: 'P2',
    phaseNumber: 2,
    title: 'Python Contribution Foundations',
    focus: 'Python/OOP revision, venv, pytest, debugging, NumPy arrays, and documentation',
    targetRangeText: '4 Nov – 17 Nov 2026',
    startDate: '2026-11-04',
    endDate: '2026-11-17',
    evidenceToProduce: 'Small tested package; explain a regression test and an array example independently.'
  },
  {
    id: 'P3',
    phaseNumber: 3,
    title: 'Choose a Community & Candidate Trials',
    focus: 'Two candidate trials (DIPY & Ignite), setup, code maps, issue triage, main/backup decision',
    targetRangeText: '18 Nov – 1 Dec 2026',
    startDate: '2026-11-18',
    endDate: '2026-12-01',
    evidenceToProduce: 'One running main repo, selected issue, requirements record, and community introduction.'
  },
  {
    id: 'P4',
    phaseNumber: 4,
    title: 'Become Useful: Scoped Changes & CI',
    focus: 'Scoped changes, regression tests, review response, CI understanding, and domain learning',
    targetRangeText: '2 Dec 2026 – 2 Feb 2027',
    startDate: '2026-12-02',
    endDate: '2027-02-02',
    evidenceToProduce: 'Evidence ledger of real useful changes and review responses; org prerequisites tracked.'
  },
  {
    id: 'P5',
    phaseNumber: 5,
    title: 'Find & Scope an Idea: Technical Spike',
    focus: 'Technical exploration, architecture mapping, spike experiment, and 2027 org list check',
    targetRangeText: '3 Feb – 2 Mar 2027',
    startDate: '2027-02-03',
    endDate: '2027-03-02',
    evidenceToProduce: 'Current idea/mentor channel, working prototype spike, project boundaries, and risk log.'
  },
  {
    id: 'P6',
    phaseNumber: 6,
    title: 'Prepare & Submit Proposal',
    focus: 'Original proposal drafting, feedback, milestones, availability, and official platform submission',
    targetRangeText: '3 Mar – 6 Apr 2027',
    startDate: '2027-03-03',
    endDate: '2027-04-06',
    evidenceToProduce: 'Reviewed draft and actual submission confirmation on official platform within confirmed window.'
  },
  {
    id: 'P7',
    phaseNumber: 7,
    title: 'Review Readiness & Decision Period',
    focus: 'Continue contributions, defend design, answer questions, and record official results',
    targetRangeText: '7 Apr – 4 May 2027',
    startDate: '2027-04-07',
    endDate: '2027-05-04',
    evidenceToProduce: 'Technical explanation walk-through, maintained branch, and honest outcome status recorded.'
  },
  {
    id: 'P8',
    phaseNumber: 8,
    title: 'Bonding / Start Readiness',
    focus: 'If selected: align scope, environment, and first milestone. If not: open-source continuation plan',
    targetRangeText: '5 May – 31 May 2027',
    startDate: '2027-05-05',
    endDate: '2027-05-31',
    evidenceToProduce: 'Mentor-agreed first work items or an open-source continuation plan.'
  }
];

export const GSOC_WEEKS: GsocWeek[] = [
  // WEEK 1
  {
    number: 1,
    phaseId: 'P1',
    theme: 'Orientation and Git from zero',
    dateRangeText: '2026-10-21 – 2026-10-27',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'What GSoC and Git actually are',
        practicalAction: 'Read the FAQ and orientation. Install/check Git; create a practice folder and GitHub account/profile if needed.',
        doneWhen: 'Git version recorded; five lines distinguish Git, GitHub and GSoC.',
        resourceIds: ['V01', 'O02', 'D01'],
        type: 'learn'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'CLI and file navigation',
        practicalAction: 'Learn paths, pwd, ls, cd, mkdir and reading files. Build a small project folder using the terminal.',
        doneWhen: 'Recreate the folder tree without looking at the video.',
        resourceIds: ['V05'],
        type: 'learn'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Working tree, staging and commits',
        practicalAction: 'Use the Git course initialization/status/add/commit section; make three purposeful local commits.',
        doneWhen: 'Explain which changes are unstaged, staged and committed.',
        resourceIds: ['V02', 'D03'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'GitHub remote and authentication',
        practicalAction: 'Use the remotes section and current SSH docs; push the practice repository, excluding private keys and environment files.',
        doneWhen: 'Remote is correct and the pushed files match your local commit.',
        resourceIds: ['V02', 'D04'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Read history and diff',
        practicalAction: 'Change one function or text file; inspect diff, stage only the intended change and read the commit history.',
        doneWhen: 'Explain one diff and locate the commit that introduced it.',
        resourceIds: ['V02', 'D03'],
        type: 'practice'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Branch and pull request basics',
        practicalAction: 'Complete the GitHub Hello World exercise; open and merge a practice PR in your own repository.',
        doneWhen: 'Describe branch, PR, review and merge; save the practice PR link.',
        resourceIds: ['D01', 'V02'],
        type: 'practice'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light recall and buffer',
        practicalAction: 'From memory, explain the six previous actions. Fix one unclear step; choose next week study slots.',
        doneWhen: 'Short recall note and a realistic next-week schedule saved.',
        resourceIds: ['D03'],
        type: 'review'
      }
    ]
  },

  // WEEK 2
  {
    number: 2,
    phaseId: 'P1',
    theme: 'Collaboration, conflicts and one practice contribution',
    dateRangeText: '2026-10-28 – 2026-11-03',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Branches and deliberate conflict',
        practicalAction: 'Follow the branching/conflict section. Make conflicting edits on two branches in a disposable repo and resolve them.',
        doneWhen: 'Merged result contains the intended lines; explain the conflict markers.',
        resourceIds: ['V02', 'D03'],
        type: 'practice'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Fork versus clone; origin versus upstream',
        practicalAction: 'Read the GitHub contribution walkthrough. Fork the practice project and inspect both remotes.',
        doneWhen: 'Draw or write the local/fork/upstream relationship correctly.',
        resourceIds: ['D02', 'V04'],
        type: 'learn'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Keep a fork current',
        practicalAction: 'Fetch upstream, inspect what changed and update your practice branch with the documented merge workflow.',
        doneWhen: 'Explain fetch versus pull and show the resulting history.',
        resourceIds: ['D03', 'V02'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Undo safely',
        practicalAction: 'Practice restore, revert and stash on disposable changes. Read reset/rebase conceptually before trying them locally.',
        doneWhen: 'Recover a deliberate mistake without rewriting a shared branch.',
        resourceIds: ['D03', 'V02'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'One guided external practice PR',
        practicalAction: 'Follow First Contributions if still appropriate; make its requested training change and submit once.',
        doneWhen: 'Save the PR as practice, regardless of when it is reviewed.',
        resourceIds: ['D05', 'D02'],
        type: 'practice'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Read contribution rules and PR etiquette',
        practicalAction: 'Read an actual project README, CONTRIBUTING and code of conduct; compare one reviewed PR to your practice PR.',
        doneWhen: 'Write a useful PR description and three review-etiquette rules.',
        resourceIds: ['D06', 'V04'],
        type: 'learn'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Independent workflow skill check',
        practicalAction: 'Repeat branch, edit, test/check, commit and PR steps without a tutorial. Revisit only the failing step.',
        doneWhen: 'An honest checklist identifies what you can do independently.',
        resourceIds: ['D02', 'D03'],
        type: 'review'
      }
    ]
  },

  // WEEK 3
  {
    number: 3,
    phaseId: 'P2',
    theme: 'Python revision for contributing',
    dateRangeText: '2026-11-04 – 2026-11-10',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Functions and a small module',
        practicalAction: 'Revise functions/arguments only as needed; write a small utility module rather than replaying the whole Python course.',
        doneWhen: 'Call three functions from a second file and explain return values.',
        resourceIds: ['V06', 'D07'],
        type: 'learn'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Collections and relevant complexity',
        practicalAction: 'Revise lists, dicts and sets; implement duplicate detection and a small frequency counter.',
        doneWhen: 'Correct results on empty/repeated input; explain the data-structure choice.',
        resourceIds: ['V06', 'D07'],
        type: 'learn'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'OOP and reading an interface',
        practicalAction: 'Revise classes, instances and composition; write a small class with clear methods and a docstring.',
        doneWhen: 'Explain class versus instance and test one behavior manually.',
        resourceIds: ['V06', 'V07'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Virtual environment and package layout',
        practicalAction: 'Create a venv, install a dependency and inspect a real pyproject.toml. Record reproducible setup commands.',
        doneWhen: 'A clean environment can run the utility module; venv is ignored by Git.',
        resourceIds: ['D08', 'D07'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'First pytest tests',
        practicalAction: 'Use pytest first-test section. Test normal inputs, empty inputs and one invalid input in the utility.',
        doneWhen: 'Tests run locally; intentionally breaking the function makes a relevant test fail.',
        resourceIds: ['V08', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Tracebacks and regression-test reasoning',
        practicalAction: 'Introduce a small bug, read the traceback and use a debugger or print investigation; fix it with a regression test.',
        doneWhen: 'Explain why the failing test reproduces the bug and why the fix is correct.',
        resourceIds: ['V08', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light Python recall',
        practicalAction: 'Close tutorials and solve two earlier logic questions; review the utility package setup and tests.',
        doneWhen: 'One weak concept identified; utility repository and test log saved.',
        resourceIds: ['D07', 'D09'],
        type: 'review'
      }
    ]
  },

  // WEEK 4
  {
    number: 4,
    phaseId: 'P2',
    theme: 'Tests, arrays and scientific examples',
    dateRangeText: '2026-11-11 – 2026-11-17',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Fixtures and parametrized tests',
        practicalAction: 'Use pytest fixture/parametrization sections; remove repeated setup and test several boundary cases.',
        doneWhen: 'Explain fixture lifetime at the level used and read test failures correctly.',
        resourceIds: ['V08', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Files, exceptions and useful documentation',
        practicalAction: 'Read/write a small JSON or CSV fixture; handle a missing file intentionally; write usage/setup documentation.',
        doneWhen: 'A new user can follow the README and see the same output.',
        resourceIds: ['V06', 'D07'],
        type: 'practice'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'NumPy arrays and indexing',
        practicalAction: 'Use the NumPy array/shape/indexing sections; compare lists and arrays using small examples.',
        doneWhen: 'Show shape, dtype, slice and copy behavior with assertions.',
        resourceIds: ['V10', 'D11'],
        type: 'learn'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Numerical tests and a small plot',
        practicalAction: 'Practice broadcasting and a numerical assertion; make one labelled plot. Use pandas only if needed.',
        doneWhen: 'One plot is reproducible and the array test passes with sensible tolerance.',
        resourceIds: ['V10', 'V12', 'D11'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Read a real test and source file',
        practicalAction: 'Pick DIPY or Ignite preliminarily; locate a function, its docstring and a nearby test without changing upstream code.',
        doneWhen: 'Save a one-page source-to-test map and unfamiliar terms.',
        resourceIds: ['D09', 'D06'],
        type: 'learn'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Tiny project demonstration',
        practicalAction: 'Package the utility, array example, tests and README. Demonstrate it from a clean local checkout.',
        doneWhen: 'Setup, example and focused tests run; explain them in two minutes.',
        resourceIds: ['D08', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Foundation gate and buffer',
        practicalAction: 'Check Git, environments, tracebacks and tests. Keep missing topics as a small remedial list for the next week.',
        doneWhen: 'Ready-for-repo checklist is honest; no automatic mastery claim.',
        resourceIds: ['D02', 'D09'],
        type: 'review'
      }
    ]
  },

  // WEEK 5
  {
    number: 5,
    phaseId: 'P3',
    theme: 'Candidate trials: DIPY and Ignite',
    dateRangeText: '2026-11-18 – 2026-11-24',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'DIPY users and contribution rules',
        practicalAction: 'Read DIPY overview, contribution guide and historical ideas; choose a simple example, not a large algorithm.',
        doneWhen: 'Explain the example user/problem and record prerequisites.',
        resourceIds: ['D06', 'O06'],
        type: 'learn',
        branch: 'dipy'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'DIPY local example',
        practicalAction: 'Follow the current documented setup and run one small example using manageable data. Log setup errors precisely.',
        doneWhen: 'Example output or a reproducible blocker with commands/version/commit.',
        resourceIds: ['D08', 'D09'],
        type: 'practice',
        branch: 'dipy'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'DIPY focused test and issue scan',
        practicalAction: 'Run a relevant test; read three current issues and two reviewed PRs. Do not claim an issue without context.',
        doneWhen: 'Source/test map and one bounded potential task saved.',
        resourceIds: ['D09', 'D06'],
        type: 'practice',
        branch: 'dipy'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Ignite concepts and prerequisites',
        practicalAction: 'Read the getting-started guide; revise only the necessary tensor/training-loop concepts from the PyTorch course.',
        doneWhen: 'Explain tensor, trainer, evaluator, Engine and Events at a basic level.',
        resourceIds: ['V14', 'D10'],
        type: 'learn',
        branch: 'ignite'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Ignite CPU or small-data example',
        practicalAction: 'Run a minimal documented example using supported versions; reduce data size rather than buying GPU time.',
        doneWhen: 'Working example or an explicit dependency/skill blocker with evidence.',
        resourceIds: ['D09', 'D10'],
        type: 'practice',
        branch: 'ignite'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Ignite requirements and issue scan',
        practicalAction: 'Read the historical three-accepted-PR requirement, current contribution guide, issues and recent reviews.',
        doneWhen: 'Record what is historical and what must be rechecked for 2027.',
        resourceIds: ['D06', 'O06'],
        type: 'learn',
        branch: 'ignite'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Compare two practical trials',
        practicalAction: 'Score interest, setup, skills, workflow and available time using Section 5. Capture actual observations.',
        doneWhen: 'Comparison saved; no invented mentor-response or acceptance score.',
        resourceIds: ['O06'],
        type: 'review'
      }
    ]
  },

  // WEEK 6
  {
    number: 6,
    phaseId: 'P3',
    theme: 'Select a main community and a small task',
    dateRangeText: '2026-11-25 – 2026-12-01',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Backup trial: Matplotlib or holidays',
        practicalAction: 'Try only one backup: a simple plot/test workflow or holiday calendar/test. Read its contribution instructions.',
        doneWhen: 'One backup setup and prerequisite notes saved.',
        resourceIds: ['V12', 'D09'],
        type: 'learn'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Choose the main repository',
        practicalAction: 'Choose DIPY, Ignite or the better-fitting backup based on demonstrated fit. Store one main and one backup.',
        doneWhen: 'Selection reason, skill gaps and realistic weekly capacity recorded.',
        resourceIds: ['O06'],
        type: 'practice'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Join the prescribed public channel',
        practicalAction: 'Read recent discussion, find the stated newcomer channel and prepare a specific introduction. Post yourself if appropriate.',
        doneWhen: 'Channel/link and a concise introduction or draft recorded.',
        resourceIds: ['O07', 'O09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Issue triage and duplication check',
        practicalAction: 'Inspect a small unclaimed issue; search existing PRs and reproduce it. Confirm expected behavior before implementing.',
        doneWhen: 'Issue URL, expected/actual result and existing-work check recorded.',
        resourceIds: ['D02', 'D06'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Agree on a bounded scope',
        practicalAction: 'Ask one precise question or describe a small approach in the required channel. If blocked, continue a local reproduction.',
        doneWhen: 'Public discussion/draft and proposed scope saved; no assumption of assignment.',
        resourceIds: ['O07', 'O09'],
        type: 'practice'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Create a development branch and test plan',
        practicalAction: 'Create a branch in your fork; identify exactly what files/tests/docs would change for the selected task.',
        doneWhen: 'Branch, source map, test command and next action saved.',
        resourceIds: ['D02', 'D03'],
        type: 'practice'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Weekly review and requirements record',
        practicalAction: 'Review the main-project choice, setup and issue. Schedule next week around actual college/coursework.',
        doneWhen: 'Main-project checklist and one realistic contribution target.',
        resourceIds: ['O06', 'O09'],
        type: 'review'
      }
    ]
  },

  // WEEK 7
  {
    number: 7,
    phaseId: 'P4',
    theme: 'First useful change in the main project',
    dateRangeText: '2026-12-02 – 2026-12-08',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Read the affected behavior',
        practicalAction: 'Trace the selected issue function/class through callers, docs and tests; inspect relevant prior reviews.',
        doneWhen: 'Explain the intended behavior and the narrow change boundary.',
        resourceIds: ['D06'],
        type: 'contribute'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Write a reproduction or failing test',
        practicalAction: 'Build the smallest input that demonstrates the problem; add a test where the project expects it.',
        doneWhen: 'Failure occurs for the intended reason, or investigation explains why not.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Implement the smallest fix',
        practicalAction: 'Change one coherent behavior. Use the repository style; avoid unrelated formatting or refactors.',
        doneWhen: 'The focused reproduction/test now behaves correctly.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Test boundaries and documentation',
        practicalAction: 'Run relevant tests, inspect edge cases and add documentation/changelog only if the project requires it.',
        doneWhen: 'Actual commands/results and limitations recorded.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Prepare a draft PR',
        practicalAction: 'Review the diff; write problem, approach and validation. Open a draft only if the change is coherent and welcome.',
        doneWhen: 'PR URL or locally ready draft plus a complete description saved.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Feedback or local verification',
        practicalAction: 'Address any real review comments. If none, check another edge case locally and avoid repeated status pings.',
        doneWhen: 'One verified improvement or precise next-action note.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Weekly evidence review',
        practicalAction: 'Recall the code change, update contribution status honestly, and note what review taught you.',
        doneWhen: 'Evidence ledger distinguishes draft/submitted/merged states.',
        resourceIds: ['O09'],
        type: 'review'
      }
    ]
  },

  // WEEK 8
  {
    number: 8,
    phaseId: 'P4',
    theme: 'Review response and contribution completion',
    dateRangeText: '2026-12-09 – 2026-12-15',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Read feedback carefully',
        practicalAction: 'Summarize each review comment and its underlying concern; ask a specific clarification where necessary.',
        doneWhen: 'Actionable review checklist with links or local-review observations.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Reproduce the review concern',
        practicalAction: 'Write a test/example for the disputed or overlooked case before editing more code.',
        doneWhen: 'Concern reproduced or accurately explained with evidence.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Revise implementation',
        practicalAction: 'Make the requested focused correction; follow the maintainer workflow for commits and history.',
        doneWhen: 'Corrected behavior and clean diff.',
        resourceIds: ['D02', 'D03'],
        type: 'contribute'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Run required checks',
        practicalAction: 'Run focused tests and agreed lint/docs checks; log environment-specific limitations rather than claiming full success.',
        doneWhen: 'Updated validation log and no unexplained new failures.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Update PR description',
        practicalAction: 'Summarize what changed since review. Link tests and answer the actual questions in the prescribed channel.',
        doneWhen: 'Reviewer can inspect each addressed point clearly.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Pending-review fallback',
        practicalAction: 'If review remains pending, investigate a second small issue locally. If merged/closed, record the real status.',
        doneWhen: 'Useful local work or accurate outcome; no forced weekly PR quota.',
        resourceIds: ['D06'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Lessons and catch-up',
        practicalAction: 'Review source/test relationships from memory and choose next week highest-value action.',
        doneWhen: 'One technical lesson and one communication lesson saved.',
        resourceIds: ['O09'],
        type: 'review'
      }
    ]
  },

  // WEEK 9
  {
    number: 9,
    phaseId: 'P4',
    theme: 'A second scoped bug or test improvement',
    dateRangeText: '2026-12-16 – 2026-12-22',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Select a meaningful next problem',
        practicalAction: 'Choose a second bounded task based on project needs and what you now understand; check existing work.',
        doneWhen: 'Issue/problem plus a justified scope, not a cosmetic count target.',
        resourceIds: ['D06'],
        type: 'contribute'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Minimal reproduction',
        practicalAction: 'Create a small reproducible example with version, input, expected and actual results.',
        doneWhen: 'Another person can reproduce the behavior from your notes.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Regression test',
        practicalAction: 'Add the relevant regression test; ensure it fails for the bug rather than setup or random data.',
        doneWhen: 'A clear failure signal tied to the problem.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Fix and edge cases',
        practicalAction: 'Implement the small change and test nearby inputs, errors and existing behavior.',
        doneWhen: 'Focused tests pass and edge cases are explained.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Documentation and review',
        practicalAction: 'Update necessary usage notes; inspect the diff and request review through the project normal process.',
        doneWhen: 'Ready draft/PR or explicit remaining blocker with evidence.',
        resourceIds: ['D02', 'O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Review follow-through',
        practicalAction: 'Respond to actual feedback or improve local reproduction while waiting.',
        doneWhen: 'No unanswered actionable comment you could resolve in the block.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Weekly skill consolidation',
        practicalAction: 'Explain both investigated changes and revisit one weak Python/Git concept only if needed.',
        doneWhen: 'Short independent explanation and honest contribution states.',
        resourceIds: ['D03', 'D09'],
        type: 'review'
      }
    ]
  },

  // WEEK 10
  {
    number: 10,
    phaseId: 'P4',
    theme: 'CI and reproducible development',
    dateRangeText: '2026-12-23 – 2026-12-29',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Inspect the project actual CI',
        practicalAction: 'Read workflow files and their test jobs; identify what is relevant to your contribution.',
        doneWhen: 'Explain trigger, job, runner and command without copying blindly.',
        resourceIds: ['V16', 'D12'],
        type: 'learn'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Practice one GitHub Actions workflow',
        practicalAction: 'In your practice repo only, add a minimal Python test workflow using current official action examples.',
        doneWhen: 'A test runs on a practice push/PR and its logs are readable.',
        resourceIds: ['D12', 'V16'],
        type: 'practice'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Understand a CI failure',
        practicalAction: 'Deliberately break the practice test, inspect the failing step, fix it and compare to target-project logs.',
        doneWhen: 'Explain application failure versus environment/setup failure.',
        resourceIds: ['D12', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Reproduce locally',
        practicalAction: 'Run the relevant checks from the target project contributing guide in your supported environment.',
        doneWhen: 'Commands and actual pass/fail results saved.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Clean setup documentation',
        practicalAction: 'Check your setup notes from a fresh environment; propose an upstream improvement only if it is actually useful.',
        doneWhen: 'Reproducible setup instructions and a bounded justified change if needed.',
        resourceIds: ['D08', 'D06'],
        type: 'practice'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Open reviews and follow-up',
        practicalAction: 'Finish outstanding review fixes or investigate a relevant CI/test concern locally.',
        doneWhen: 'Next contribution action is tied to a real project need.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light review and holiday flexibility',
        practicalAction: 'Review the CI concepts; use a leave/capacity override if needed. Do not assign festival dates by guess.',
        doneWhen: 'Updated calendar and one-page CI summary.',
        resourceIds: ['D12'],
        type: 'review'
      }
    ]
  },

  // WEEK 11
  {
    number: 11,
    phaseId: 'P4',
    theme: 'Codebase map and year-end evidence',
    dateRangeText: '2026-12-30 – 2027-01-05',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Public API and internal modules',
        practicalAction: 'Map one component public entry points to implementation and tests in the main project.',
        doneWhen: 'A navigable source map with real file/function references.',
        resourceIds: ['D06'],
        type: 'practice'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Trace an end-to-end example',
        practicalAction: 'Run a tiny example and trace inputs through the component to outputs.',
        doneWhen: 'Explain shape/state transformations and where failures would appear.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Light new-year buffer',
        practicalAction: 'Keep this a low-pressure review: check open reviews, back up notes and verify the next study target.',
        doneWhen: 'Backup saved and one clear next action; leave allowed.',
        resourceIds: ['O09'],
        type: 'buffer'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Small focused improvement',
        practicalAction: 'Continue the open issue, test or docs improvement that fits your code map.',
        doneWhen: 'Coherent local change and relevant test evidence.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Evidence ledger audit',
        practicalAction: 'Check all contribution URLs/statuses, exact work you did and review lessons; separate practice and project work.',
        doneWhen: 'No exaggerated claim or invented merged PR in the ledger.',
        resourceIds: ['O09'],
        type: 'review'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Check official updates',
        practicalAction: 'Open the timeline and project channels. Record any newly announced 2027 information with a primary-source link.',
        doneWhen: 'Facts are dated and sourced; unknown events remain unknown.',
        resourceIds: ['O03'],
        type: 'review'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Review and next-month focus',
        practicalAction: 'Set January goals around one useful component and your actual course/college workload.',
        doneWhen: 'Small achievable plan with buffer, not a PR-count leaderboard.',
        resourceIds: ['O06'],
        type: 'review'
      }
    ]
  },

  // WEEK 12
  {
    number: 12,
    phaseId: 'P4',
    theme: 'Deepen the chosen project domain',
    dateRangeText: '2027-01-06 – 2027-01-12',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Choose one domain gap',
        practicalAction: 'Identify one topic needed by current work: DIPY image/array conventions, Ignite training events, plotting or calendar rules.',
        doneWhen: 'A gap tied to actual code, with the correct branch resource chosen.',
        resourceIds: ['D11', 'D10'],
        type: 'learn'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Project-specific learning',
        practicalAction: 'Study the chosen project relevant docs/example only. For Ignite, use selected PyTorch tensors/autograd lessons if necessary.',
        doneWhen: 'Explain one new concept and its role in the current task.',
        resourceIds: ['V14', 'D10'],
        type: 'learn'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Build a tiny domain example',
        practicalAction: 'Write a standalone demonstration using small synthetic inputs; no large dataset or paid compute required.',
        doneWhen: 'Working example with stated assumptions and output.',
        resourceIds: ['D11', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Test domain assumptions',
        practicalAction: 'Check boundary values, shapes, device/state or date conventions that apply to the example.',
        doneWhen: 'Tests/assertions show at least one meaningful failure mode.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Connect example to real source',
        practicalAction: 'Locate the project API/module implementing the behavior and a relevant test or review.',
        doneWhen: 'Example-to-source map and one useful question.',
        resourceIds: ['D06'],
        type: 'learn'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Apply the learning',
        practicalAction: 'Improve an open contribution or write a scoped local test based on the new understanding.',
        doneWhen: 'Visible improvement in a real task, not just watched video time.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Recall and requirements check',
        practicalAction: 'Recall the domain concept, review organization-specific prerequisites and update your skill-gap list.',
        doneWhen: 'Evidence-based gap list and next contribution action.',
        resourceIds: ['O06'],
        type: 'review'
      }
    ]
  },

  // WEEK 13
  {
    number: 13,
    phaseId: 'P4',
    theme: 'Small design discussion and third change if required',
    dateRangeText: '2027-01-13 – 2027-01-19',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Understand an enhancement request',
        practicalAction: 'Read a relevant small enhancement and its discussion; distinguish user need from implementation preference.',
        doneWhen: 'Problem, users and constraints summarized accurately.',
        resourceIds: ['D06'],
        type: 'contribute'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Write a short design note',
        practicalAction: 'Describe two approaches, public API impact, test strategy and trade-offs before broad code changes.',
        doneWhen: 'One-page design draft with an intentionally bounded scope.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Discuss through the normal channel',
        practicalAction: 'Ask about the scoped approach if required. If waiting, prototype locally without claiming approval.',
        doneWhen: 'Discussion link or local draft and unresolved assumptions recorded.',
        resourceIds: ['O07', 'O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Implement a narrow prototype',
        practicalAction: 'Code the smallest risky part with supported dependencies and small inputs.',
        doneWhen: 'Prototype demonstrates a technical assumption or identifies a specific blocker.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Test and document the prototype',
        practicalAction: 'Add checks and usage notes; inspect actual behavior instead of polishing a demo only.',
        doneWhen: 'Repeatable experiment and actual results.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Review contribution prerequisites',
        practicalAction: 'If Ignite remains main, check actual accepted-PR count against its current requirement; prioritize quality and review follow-through.',
        doneWhen: 'Requirement status is accurate; no synthetic PR splitting to inflate count.',
        resourceIds: ['D06', 'O06'],
        type: 'review'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Weekly review',
        practicalAction: 'Review the design trade-offs and select one realistic improvement for the next week.',
        doneWhen: 'Can explain the design without reading a generated script.',
        resourceIds: ['O09'],
        type: 'review'
      }
    ]
  },

  // WEEK 14
  {
    number: 14,
    phaseId: 'P4',
    theme: 'Validation, robustness and review backlog',
    dateRangeText: '2027-01-20 – 2027-01-26',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Inventory open work',
        practicalAction: 'List open reviews, unfinished tests and known assumptions in the main project.',
        doneWhen: 'Prioritized backlog with one next action per item.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Edge-case testing',
        practicalAction: 'Write a useful boundary case for an active change, using stable and appropriately small fixtures.',
        doneWhen: 'A meaningful regression signal, not a test mirroring implementation.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Numerical or state correctness',
        practicalAction: 'For scientific/ML work inspect dtype, tolerance, shape, seed, train/eval state; for other work inspect its actual invariants.',
        doneWhen: 'Relevant correctness assumptions documented and checked.',
        resourceIds: ['D11', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Compatibility and docs',
        practicalAction: 'Inspect supported Python/dependency versions and document any practical compatibility limitation.',
        doneWhen: 'No false claim that every version/platform was tested.',
        resourceIds: ['D08'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Submit/update coherent work',
        practicalAction: 'Finalize one ready contribution or update an existing review; include actual validation evidence.',
        doneWhen: 'Clean diff and useful PR update, or explicit blocker.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Answer review questions',
        practicalAction: 'Explain your implementation and tests; make focused corrections rather than starting a large unrelated task.',
        doneWhen: 'Review action list updated honestly.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Recall and buffer',
        practicalAction: 'Revisit one tricky code path from memory; use remaining time to catch up or take a planned rest.',
        doneWhen: 'Recall note and next-week priority saved.',
        resourceIds: ['D09'],
        type: 'review'
      }
    ]
  },

  // WEEK 15
  {
    number: 15,
    phaseId: 'P4',
    theme: 'Move from contributions to project research',
    dateRangeText: '2027-01-27 – 2027-02-02',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'List project needs',
        practicalAction: 'Read issues, roadmap and historical ideas in the main project; list needs you actually understand.',
        doneWhen: 'Three possible problem areas with source links, not promises of 2027 ideas.',
        resourceIds: ['O06'],
        type: 'learn'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Read two historical examples',
        practicalAction: 'Read the attributed DIPY contributor accounts; extract preparation lessons without copying their proposals or career claims.',
        doneWhen: 'Two lessons and one difference from your own skill/availability level.',
        resourceIds: ['C01', 'C03'],
        type: 'learn'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Assess scope against your time',
        practicalAction: 'Compare small/medium/large project hours to college, teaching and exam commitments; record summer uncertainties.',
        doneWhen: 'Honest preliminary capacity and a tractable scope preference.',
        resourceIds: ['O02', 'O08'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Investigate one likely technical area',
        practicalAction: 'Trace the relevant module and run a small example/test connected to one problem area.',
        doneWhen: 'A technical research note grounded in source code.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Maintain current contributions',
        practicalAction: 'Finish reviews or a scoped fix; do not disappear from the community while writing plans.',
        doneWhen: 'Contribution ledger and next action are current.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Check 2027 announcements',
        practicalAction: 'Review the official timeline, organization news and project channel; store confirmed facts only.',
        doneWhen: 'Updated source/checked date or explicit unannounced status.',
        resourceIds: ['O03'],
        type: 'review'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'January review',
        practicalAction: 'Audit what you can explain, run and maintain; choose February one main research direction.',
        doneWhen: 'Project-readiness checklist without any selection-probability score.',
        resourceIds: ['O06'],
        type: 'review'
      }
    ]
  },

  // WEEK 16
  {
    number: 16,
    phaseId: 'P5',
    theme: 'Technical spike and measurable scope',
    dateRangeText: '2027-02-03 – 2027-02-09',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Select one research question',
        practicalAction: 'Choose the riskiest unanswered question in a possible project direction; avoid treating historical ideas as confirmed.',
        doneWhen: 'One concrete question and experiment boundary.',
        resourceIds: ['O08'],
        type: 'learn'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Baseline experiment',
        practicalAction: 'Run current behavior with a small reproducible input and record output/time only where performance matters.',
        doneWhen: 'Baseline commands, environment and observations saved.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Prototype the risky part',
        practicalAction: 'Implement only enough to test the hypothesis, in a clearly experimental branch.',
        doneWhen: 'Working spike or a precise documented limitation.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Compare alternatives',
        practicalAction: 'Test a second reasonable approach or explain why it is unsuitable; avoid optimizing before correctness.',
        doneWhen: 'Evidence-backed trade-off note.',
        resourceIds: ['O08'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Define success',
        practicalAction: 'Write observable acceptance criteria and what testing/evaluation would show project completion.',
        doneWhen: 'Measurable deliverables and exclusions.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Invite focused technical feedback',
        practicalAction: 'Share a concise question or spike through the project prescribed channel if useful; record feedback actually received.',
        doneWhen: 'Specific feedback/questions and an honest next step.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light review and buffer',
        practicalAction: 'Review the experiment, clean notes and schedule the next block around actual capacity.',
        doneWhen: 'One-page spike summary with links and assumptions.',
        resourceIds: ['O08'],
        type: 'review'
      }
    ]
  },

  // WEEK 17
  {
    number: 17,
    phaseId: 'P5',
    theme: 'Architecture, tests and prerequisite closure',
    dateRangeText: '2027-02-10 – 2027-02-16',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Map the target component',
        practicalAction: 'Update the code map for the possible project: entry point, interfaces, tests, docs and dependencies.',
        doneWhen: 'Named real files/APIs with a clear relationship.',
        resourceIds: ['D06'],
        type: 'practice'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Close one prerequisite gap',
        practicalAction: 'Study a narrow weak concept needed by that component. Choose current docs and a relevant resource; no new unrelated stack.',
        doneWhen: 'Explain the concept through a tiny example.',
        resourceIds: ['D09', 'D10', 'D11'],
        type: 'learn'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Testing strategy',
        practicalAction: 'List unit/integration/behavior checks that fit the proposed change and repository conventions.',
        doneWhen: 'Test plan verifies outcomes and realistic failure cases.',
        resourceIds: ['D09'],
        type: 'proposal'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Prototype reproducibility',
        practicalAction: 'Run your spike from a clean supported environment and fix undocumented setup assumptions.',
        doneWhen: 'Someone else could repeat the experiment from your notes.',
        resourceIds: ['D08'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Review open contributions',
        practicalAction: 'Respond to pending actionable reviews and verify organization-specific prerequisites from current sources.',
        doneWhen: 'Accurate status/evidence; waiting for review is not marked as your failure.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Draft a project questions list',
        practicalAction: 'Write targeted questions about scope, design, dependencies and priorities for a future mentor discussion.',
        doneWhen: 'Concise questions answerable from your research context.',
        resourceIds: ['O07', 'O09'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Weekly recall',
        practicalAction: 'Explain current architecture and the experiment in three minutes; update your technical gap list.',
        doneWhen: 'Independent explanation and a manageable next-week plan.',
        resourceIds: ['O08'],
        type: 'review'
      }
    ]
  },

  // WEEK 18
  {
    number: 18,
    phaseId: 'P5',
    theme: 'Official organization list checkpoint',
    dateRangeText: '2027-02-17 – 2027-02-23',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Check announcements, without assuming a date',
        practicalAction: 'Open the official timeline and home. If the 2027 list is published, record the main project participation and umbrella.',
        doneWhen: 'Confirmed source/date or unknown status, never a copied 2026 badge.',
        resourceIds: ['O01', 'O03'],
        type: 'review'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Recheck project instructions',
        practicalAction: 'Read current application/ideas/prerequisite/template/AI instructions from the participating project if available.',
        doneWhen: 'Current requirements record and unresolved questions.',
        resourceIds: ['O12'],
        type: 'learn'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Participation decision',
        practicalAction: 'If the main project is not participating, activate the studied backup explicitly; if the list is unknown, continue main-project work.',
        doneWhen: 'Decision with evidence; all old contributions retained.',
        resourceIds: ['O06', 'O10', 'O11'],
        type: 'proposal'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Understand a real idea',
        practicalAction: 'Read an available current idea and relevant source; otherwise continue the local technical spike as provisional research.',
        doneWhen: 'Problem, required skills and open assumptions summarized.',
        resourceIds: ['O08'],
        type: 'learn'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Prepare an informed discussion',
        practicalAction: 'Share the small prototype/question through the prescribed channel; do not ask for a guaranteed slot.',
        doneWhen: 'Technical discussion/draft and follow-up action saved.',
        resourceIds: ['O07', 'O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Keep contributing',
        practicalAction: 'Complete a review fix or small local improvement while waiting for project guidance.',
        doneWhen: 'Actual contribution action logged with accurate status.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Checkpoint review',
        practicalAction: 'Review official versus personal dates and whether the chosen idea remains a good fit.',
        doneWhen: 'Updated fit decision and next-week objectives.',
        resourceIds: ['O03', 'O06'],
        type: 'review'
      }
    ]
  },

  // WEEK 19
  {
    number: 19,
    phaseId: 'P5',
    theme: 'Select the idea and write a scope note',
    dateRangeText: '2027-02-24 – 2027-03-02',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Shortlist actual ideas',
        practicalAction: 'Compare one or two current published ideas using interest, code understanding, prerequisites and time. If unavailable, mark provisional.',
        doneWhen: 'A reasoned idea choice, not several unrelated proposals.',
        resourceIds: ['O06', 'O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Current implementation and gap',
        practicalAction: 'Describe current behavior and why it falls short for real users; cite actual code/docs/issues.',
        doneWhen: 'Problem statement grounded in project needs.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'MVP and exclusions',
        practicalAction: 'Write the minimum useful result, optional stretch goals and explicitly excluded work.',
        doneWhen: 'Bounded deliverables that fit a realistic project size.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Approach and alternatives',
        practicalAction: 'Use the spike to describe implementation approach and relevant design trade-offs.',
        doneWhen: 'A technical explanation you can defend without copying a template answer.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Clarify with the community',
        practicalAction: 'Ask targeted questions about scope/priority. Apply feedback actually received; do not imply endorsement.',
        doneWhen: 'Assumptions and confirmed guidance are separate.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Risks and fallback scope',
        practicalAction: 'Identify dependency, algorithm, data, review and availability risks; define smaller fallback deliverables.',
        doneWhen: 'Risks have concrete mitigations or an explicit unresolved state.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Scope review',
        practicalAction: 'Review idea/template fit and check official timeline updates. Carry missing facts forward openly.',
        doneWhen: 'Ready to draft or a clear list of blockers.',
        resourceIds: ['O03', 'O08'],
        type: 'review'
      }
    ]
  },

  // WEEK 20
  {
    number: 20,
    phaseId: 'P6',
    theme: 'Proposal draft one',
    dateRangeText: '2027-03-03 – 2027-03-09',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Follow the actual organization template',
        practicalAction: 'Open the current template/instructions and create an original draft with accurate identity and links.',
        doneWhen: 'Template/AI-policy checklist and current-source date recorded.',
        resourceIds: ['O08', 'O12'],
        type: 'proposal'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Write problem and users',
        practicalAction: 'Explain the need, affected users, current behavior and expected benefit in your own words.',
        doneWhen: 'Clear project-specific motivation without hype or copied claims.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Write technical approach',
        practicalAction: 'Describe modules/interfaces, the risky part and alternatives using your source map and experiment.',
        doneWhen: 'Proposal is technically inspectable and based on real research.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Write testing and success criteria',
        practicalAction: 'Add correctness checks, integration, docs and evaluation relevant to the idea.',
        doneWhen: 'Each required deliverable has a plausible verification method.',
        resourceIds: ['O08', 'D09'],
        type: 'proposal'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Plan weekly deliverables',
        practicalAction: 'Estimate effort against project size and availability; leave planning buffer and divide MVP from stretch work.',
        doneWhen: 'A realistic schedule with dependencies and buffer.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Write availability and evidence',
        practicalAction: 'Disclose college/teaching/exam constraints and link genuine work with your exact role.',
        doneWhen: 'No inflated hours, authorship, merges or mentor relationship.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Draft-one review',
        practicalAction: 'Read the whole draft aloud; identify missing assumptions and the best specific feedback question.',
        doneWhen: 'Complete first draft or clearly recorded missing sections.',
        resourceIds: ['O08'],
        type: 'review'
      }
    ]
  },

  // WEEK 21
  {
    number: 21,
    phaseId: 'P6',
    theme: 'Proposal feedback and refinement',
    dateRangeText: '2027-03-10 – 2027-03-16',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Request review correctly',
        practicalAction: 'Use the project stated early-review process if available; send a concise project-specific request yourself.',
        doneWhen: 'Feedback request/draft and date saved; no expectation of guaranteed review.',
        resourceIds: ['O08', 'O09'],
        type: 'proposal'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Strengthen the risky implementation',
        practicalAction: 'Improve the spike or test the largest remaining assumption while waiting for feedback.',
        doneWhen: 'Better technical evidence or a precise limitation.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Scope and schedule check',
        practicalAction: 'Compare MVP, workload, exams and project-size requirements; cut optional work before compressing required work.',
        doneWhen: 'Honest effort estimate and feasible commitments.',
        resourceIds: ['O02', 'O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Address actual feedback',
        practicalAction: 'Revise only what the feedback supports, recording why each change was made.',
        doneWhen: 'Feedback log maps comments to proposal changes.',
        resourceIds: ['O09'],
        type: 'proposal'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Readability and evidence audit',
        practicalAction: 'Check links, terminology, tests and factual claims; remove vague promises and unsupported statements.',
        doneWhen: 'A reviewer can inspect all cited evidence.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Check official application status',
        practicalAction: 'Open the official timeline; record actual open/deadline timestamps if announced. Do not assume this calendar date is opening day.',
        doneWhen: 'Exact fields are sourced or remain null.',
        resourceIds: ['O03', 'O01'],
        type: 'review'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light review',
        practicalAction: 'Explain the proposal in three minutes and list the two unresolved technical questions.',
        doneWhen: 'Clear independent explanation and next revision priorities.',
        resourceIds: ['O08'],
        type: 'review'
      }
    ]
  },

  // WEEK 22
  {
    number: 22,
    phaseId: 'P6',
    theme: 'Application-window preparation, event-dependent',
    dateRangeText: '2027-03-17 – 2027-03-23',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Official registration readiness',
        practicalAction: 'If applications are actually open, follow the official registration flow and current rules. Otherwise continue the draft locally.',
        doneWhen: 'Actual action/status recorded; no planner checkbox substitutes for registration.',
        resourceIds: ['O01', 'O04'],
        type: 'proposal',
        eventDependency: 'applicationOpen'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Eligibility and project prerequisites',
        practicalAction: 'Recheck current eligibility, accepted organization, project-specific requirements and permitted AI assistance.',
        doneWhen: 'Requirements are sourced and any gap is explicitly recorded.',
        resourceIds: ['O02', 'O12'],
        type: 'learn'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Finalize technical detail',
        practicalAction: 'Clarify unresolved implementation assumptions using code/tests and relevant community feedback.',
        doneWhen: 'Proposal separates tested evidence from intended future work.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Timeline and fallback plan',
        practicalAction: 'Review deliverables, dependencies, buffer and exam dates against the confirmed program schedule when available.',
        doneWhen: 'No official date is replaced by a personal target.',
        resourceIds: ['O03', 'O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Prepare submission format',
        practicalAction: 'Follow the current organization and platform file/format instructions; preview exported draft and links.',
        doneWhen: 'Readable current-format proposal with correct organization/template.',
        resourceIds: ['O08', 'O01'],
        type: 'proposal'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Feedback or submission preparation',
        practicalAction: 'Address final feedback; if ready and the window is open, prepare to submit through the official site well before its deadline.',
        doneWhen: 'Actual state is draft/ready/submitted, not auto-accepted.',
        resourceIds: ['O01', 'O09'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Window/deadline review',
        practicalAction: 'Review remaining real deadline time; set a personal reminder relative to that confirmed timestamp.',
        doneWhen: 'No fabricated countdown if the official deadline is unknown.',
        resourceIds: ['O03'],
        type: 'review'
      }
    ]
  },

  // WEEK 23
  {
    number: 23,
    phaseId: 'P6',
    theme: 'Final proposal and actual submission',
    dateRangeText: '2027-03-24 – 2027-03-30',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Last factual audit',
        practicalAction: 'Check identity, project, current ideas/template, evidence links, authorship and declared availability.',
        doneWhen: 'Every important claim is accurate and inspectable.',
        resourceIds: ['O08', 'O12'],
        type: 'proposal'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Technical consistency',
        practicalAction: 'Cross-check the proposal against source/API behavior and prototype/test results.',
        doneWhen: 'No contradiction between intended design and existing code.',
        resourceIds: ['O08', 'D09'],
        type: 'proposal'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Final review changes',
        practicalAction: 'Resolve received actionable feedback; avoid a last-minute unreviewed scope expansion.',
        doneWhen: 'Final change log and clearly bounded MVP.',
        resourceIds: ['O09'],
        type: 'proposal'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Submit if the real window is open',
        practicalAction: 'Submit only on the official GSoC platform, following its current instructions. If already submitted, verify status; if closed, log the true outcome.',
        doneWhen: 'Manual confirmation/evidence from the actual platform or honest unsubmitted status.',
        resourceIds: ['O01', 'O03'],
        type: 'proposal',
        eventDependency: 'applicationDeadline'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Verify submission and continue work',
        practicalAction: 'Check uploaded version/confirmation when possible. Resume a scoped contribution rather than repeatedly asking about selection.',
        doneWhen: 'Correct proposal version/status and one useful project action.',
        resourceIds: ['O01', 'O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Prepare technical explanation',
        practicalAction: 'Explain users, architecture, risks and test plan without reading scripted answers.',
        doneWhen: 'Five-minute explanation and a list of weak points to review.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Weekly buffer',
        practicalAction: 'Recheck the real deadline and status; finish any legitimate submission correction while permitted.',
        doneWhen: 'Accurate submission record; no silent deadline movement.',
        resourceIds: ['O03'],
        type: 'review'
      }
    ]
  },

  // WEEK 24
  {
    number: 24,
    phaseId: 'P6',
    theme: 'Deadline follow-through and continuation',
    dateRangeText: '2027-03-31 – 2027-04-06',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Check the actual deadline state',
        practicalAction: 'Verify the confirmed timeline. If submission remains open and your proposal is ready, complete it; if closed, do not claim otherwise.',
        doneWhen: 'True submission state and official deadline source retained.',
        resourceIds: ['O03', 'O01'],
        type: 'proposal',
        eventDependency: 'applicationDeadline'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Archive the submitted version',
        practicalAction: 'Save the exact submitted draft, evidence and any confirmation locally; distinguish it from later notes.',
        doneWhen: 'Version snapshot and actual submission time recorded.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Return to contribution work',
        practicalAction: 'Choose a manageable issue/test or finish an existing review in the main community.',
        doneWhen: 'Real next action without a claim that selection is assured.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Implement or investigate',
        practicalAction: 'Work on the chosen issue with the established reproduce/test/fix workflow.',
        doneWhen: 'Tested local change or useful reproduction evidence.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Documentation and validation',
        practicalAction: 'Inspect diff, run relevant checks and document actual results.',
        doneWhen: 'Small coherent ready change and accurate validation log.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Review response',
        practicalAction: 'Address feedback on contributions or proposal questions through the agreed channel.',
        doneWhen: 'Updated action list and specific answers with evidence.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light review',
        practicalAction: 'Summarize what was submitted and learned; plan the waiting period without daily result speculation.',
        doneWhen: 'Evidence archive and a healthy continuation plan.',
        resourceIds: ['O13'],
        type: 'review'
      }
    ]
  },

  // WEEK 25
  {
    number: 25,
    phaseId: 'P7',
    theme: 'Continue useful work while applications are reviewed',
    dateRangeText: '2027-04-07 – 2027-04-13',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Review main-project priorities',
        practicalAction: 'Read current reviews/issues and choose one small action useful independent of GSoC selection.',
        doneWhen: 'Bounded task tied to a project need.',
        resourceIds: ['D06'],
        type: 'contribute'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Reproduce or test',
        practicalAction: 'Create the smallest relevant example or regression test.',
        doneWhen: 'Clear observed behavior and test/reproduction evidence.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Implement the change',
        practicalAction: 'Make a focused correction or improvement; avoid starting a huge unrequested feature.',
        doneWhen: 'Understandable diff and appropriate local behavior.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Validate',
        practicalAction: 'Run focused checks, inspect compatibility and update necessary documentation.',
        doneWhen: 'Actual validation results and limitations recorded.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Explain the proposal',
        practicalAction: 'Practice a short technical walk-through of the submitted proposal and demonstrate its spike.',
        doneWhen: 'Can answer what/why/how/test/risk questions honestly.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Community communication',
        practicalAction: 'Respond to actual questions; share a concise update if the project expects it. Do not contact multiple mentors for status.',
        doneWhen: 'Helpful update or review response, not repeated pings.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Weekly review',
        practicalAction: 'Keep studying only the gaps found in real work; check announcements at a reasonable cadence.',
        doneWhen: 'Useful next-week priority and current fact status.',
        resourceIds: ['O03'],
        type: 'review'
      }
    ]
  },

  // WEEK 26
  {
    number: 26,
    phaseId: 'P7',
    theme: 'Technical discussion and review readiness',
    dateRangeText: '2027-04-14 – 2027-04-20',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Architecture recall',
        practicalAction: 'Explain the relevant source/API path, dependencies and public behavior from memory.',
        doneWhen: 'Accurate five-minute code map explanation.',
        resourceIds: ['O08'],
        type: 'practice'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Test-plan recall',
        practicalAction: 'Explain how each main deliverable will be verified and which cases may fail.',
        doneWhen: 'Concrete validation explanation rather than generic testing promises.',
        resourceIds: ['D09'],
        type: 'proposal'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Trade-offs and alternatives',
        practicalAction: 'Discuss one plausible alternative approach and why your design is currently preferable.',
        doneWhen: 'Reasoned trade-off plus what evidence might change your mind.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Answer a difficult question',
        practicalAction: 'Investigate an unresolved proposal assumption or an actual community question before writing an answer.',
        doneWhen: 'Evidence-backed answer or honest unresolved state.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Contribution follow-through',
        practicalAction: 'Resolve a review item or finalize a small local contribution.',
        doneWhen: 'No abandoned actionable review without an explanation.',
        resourceIds: ['D02'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Availability update',
        practicalAction: 'Recheck exam/teaching commitments and share a change if it affects a potential project timeline.',
        doneWhen: 'Current availability record, not a false full-time promise.',
        resourceIds: ['O08', 'O09'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light review and buffer',
        practicalAction: 'Review feedback, rest/catch up and choose one useful next task.',
        doneWhen: 'Sustainable plan for the next week.',
        resourceIds: ['O09'],
        type: 'review'
      }
    ]
  },

  // WEEK 27
  {
    number: 27,
    phaseId: 'P7',
    theme: 'First-milestone simulation',
    dateRangeText: '2027-04-21 – 2027-04-27',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Pick a safe simulation task',
        practicalAction: 'Choose a local task resembling the proposal first milestone without doing broad unapproved upstream changes.',
        doneWhen: 'Small simulated work item and acceptance criterion.',
        resourceIds: ['O08'],
        type: 'practice'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Plan the task',
        practicalAction: 'Break it into source research, test, implementation and documentation with honest estimates.',
        doneWhen: 'Task plan fits available hours.',
        resourceIds: ['O08'],
        type: 'practice'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Code the core behavior',
        practicalAction: 'Implement the narrow simulation or improve the existing spike.',
        doneWhen: 'A demonstrated behavior connected to the proposal.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Validate failure modes',
        practicalAction: 'Exercise one realistic failure/boundary case and correct an assumption if needed.',
        doneWhen: 'Verification reveals whether the design is robust enough.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Write a progress update',
        practicalAction: 'Summarize work, evidence, blocker and next step using the same concise format you would use during GSoC.',
        doneWhen: 'A useful update draft without invented progress.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Review and revise estimates',
        practicalAction: 'Compare planned to actual time; revise assumptions and scope accordingly.',
        doneWhen: 'Evidence-based estimate changes recorded.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light review',
        practicalAction: 'Review simulation lessons and current official result/start-date status.',
        doneWhen: 'Preparation remains useful whichever decision occurs.',
        resourceIds: ['O03', 'O13'],
        type: 'review'
      }
    ]
  },

  // WEEK 28
  {
    number: 28,
    phaseId: 'P7',
    theme: 'Results checkpoint, only when announced',
    dateRangeText: '2027-04-28 – 2027-05-04',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Check official result timing',
        practicalAction: 'Open the real timeline/platform. If results are not announced, keep status awaiting_results.',
        doneWhen: 'Correct actual status with source, not a guessed announcement date.',
        resourceIds: ['O03', 'O01'],
        type: 'review',
        eventDependency: 'resultsAnnouncement'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'If accepted: read instructions',
        practicalAction: 'Only after actual acceptance, read organization onboarding and current program instructions; otherwise continue pending reviews.',
        doneWhen: 'Actual acceptance evidence or unchanged awaiting status.',
        resourceIds: ['O05'],
        type: 'proposal'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'If not selected: continuation',
        practicalAction: 'If a real decision says not selected, record it, retain work and choose the next useful open-source action.',
        doneWhen: 'History preserved; no failure score or progress deletion.',
        resourceIds: ['O13'],
        type: 'review'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Discuss appropriate next steps',
        practicalAction: 'Use the prescribed channel for onboarding or a respectful feedback question when appropriate; no demand for selection reasons.',
        doneWhen: 'Useful next action or concise draft question.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Maintain current work',
        practicalAction: 'Resolve open reviews or update your local environment and spike.',
        doneWhen: 'Project work remains healthy and reproducible.',
        resourceIds: ['D02', 'D08'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Summer capacity check',
        practicalAction: 'Confirm expected weekly hours, exams/leave and internet/workstation availability.',
        doneWhen: 'An honest capacity record to discuss with a mentor if selected.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Review and branch decision',
        practicalAction: 'Select accepted/bonding, awaiting or continuing-open-source mode based only on actual evidence.',
        doneWhen: 'Correct next-phase mode and no automatic accepted badge.',
        resourceIds: ['O03', 'O13'],
        type: 'review'
      }
    ]
  },

  // WEEK 29
  {
    number: 29,
    phaseId: 'P8',
    theme: 'Bonding preparation or sustained contribution',
    dateRangeText: '2027-05-05 – 2027-05-11',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Agree on goals if selected',
        practicalAction: 'Accepted branch: clarify MVP, scope and responsibilities with mentors. Otherwise: choose one bounded community task.',
        doneWhen: 'Agreed notes or a useful contribution goal.',
        resourceIds: ['O05', 'O08'],
        type: 'proposal',
        eventDependency: 'bondingStart'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Current development environment',
        practicalAction: 'Run the project at the agreed branch/version and record setup commands and dependencies.',
        doneWhen: 'Reproducible environment and relevant focused tests.',
        resourceIds: ['D08', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Communication and availability',
        practicalAction: 'Accepted branch: agree on channels, updates, timezone and meetings. Other branch: maintain normal review communication.',
        doneWhen: 'Clear communication expectations and honest availability.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Detailed first work items',
        practicalAction: 'Break the first meaningful outcome into small tasks with tests/docs and dependencies.',
        doneWhen: 'Concrete task list with verifiable completion criteria.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Resolve a setup or review blocker',
        practicalAction: 'Use the normal workflow to investigate one blocker; provide logs and hypothesis if asking for help.',
        doneWhen: 'Blocker resolved or precisely reported.',
        resourceIds: ['O09', 'D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Update milestone plan',
        practicalAction: 'Align personal work items with confirmed program dates and mentor guidance if accepted; retain estimates if unknown.',
        doneWhen: 'No invented coding-start date or moved official deadline.',
        resourceIds: ['O03'],
        type: 'proposal'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light review',
        practicalAction: 'Review setup, expectations and next week; include planned rest and course/exam commitments.',
        doneWhen: 'Ready next actions with sustainable capacity.',
        resourceIds: ['O09'],
        type: 'review'
      }
    ]
  },

  // WEEK 30
  {
    number: 30,
    phaseId: 'P8',
    theme: 'Codebase readiness and evaluation expectations',
    dateRangeText: '2027-05-12 – 2027-05-18',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Deepen first-component understanding',
        practicalAction: 'Read source and tests for the first planned work area; locate relevant prior design/review discussion.',
        doneWhen: 'Can explain the starting component and its constraints.',
        resourceIds: ['D06'],
        type: 'practice'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Evaluation expectations if selected',
        practicalAction: 'Ask about deliverables, progress reporting and evaluations through the agreed channel; otherwise improve contribution quality.',
        doneWhen: 'Clear expectations or useful local checklist; no assumed evaluation pass.',
        resourceIds: ['O05'],
        type: 'proposal'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Baseline and tests',
        practicalAction: 'Record the baseline behavior and relevant checks for the first work item.',
        doneWhen: 'A reproducible baseline suitable for measuring the change.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Dependency and risk check',
        practicalAction: 'Identify external dependencies, review lead time and setup/compute limits; reduce scope where needed.',
        doneWhen: 'Practical risk list and mitigation or fallback.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Documentation and research notes',
        practicalAction: 'Organize source maps, experiments and setup into concise documentation for your own work and reviewers.',
        doneWhen: 'The next contributor/mentor can follow the relevant evidence.',
        resourceIds: ['D06'],
        type: 'practice'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Follow-through on feedback',
        practicalAction: 'Resolve open questions or review comments; keep the community updated as agreed.',
        doneWhen: 'Accurate progress note and clear next action.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Weekly recall',
        practicalAction: 'Explain first-milestone approach, tests and risks without reading a script.',
        doneWhen: 'Ready to begin scoped work, with remaining unknowns explicit.',
        resourceIds: ['O08'],
        type: 'review'
      }
    ]
  },

  // WEEK 31
  {
    number: 31,
    phaseId: 'P8',
    theme: 'Coding-start readiness, tied to the actual event',
    dateRangeText: '2027-05-19 – 2027-05-25',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Check official coding-start date',
        practicalAction: 'Verify the real 2027 start and bonding schedule. If unannounced or later, continue preparation without declaring a start.',
        doneWhen: 'Sourced date or explicit unknown status.',
        resourceIds: ['O03'],
        type: 'review',
        eventDependency: 'codingStart'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'Agree first milestone if selected',
        practicalAction: 'Confirm which tasks should begin at coding start and what completion evidence mentors expect.',
        doneWhen: 'Mentor-agreed starting scope or a local contribution plan.',
        resourceIds: ['O05', 'O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Environment rehearsal',
        practicalAction: 'From a clean checkout, run setup, example and first-milestone tests with agreed versions.',
        doneWhen: 'Setup rehearsal passes or an actionable blocker is recorded.',
        resourceIds: ['D08', 'D09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Issue and branch preparation',
        practicalAction: 'Prepare a narrow task/branch following community rules; avoid premature broad changes or claiming approval.',
        doneWhen: 'Starting task and branch are ready with test criteria.',
        resourceIds: ['D02'],
        type: 'practice'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Schedule and capacity rehearsal',
        practicalAction: 'Fit focused work, updates, college/teaching and rest into the actual week capacity.',
        doneWhen: 'A sustainable weekly schedule rather than inflated study hours.',
        resourceIds: ['O08'],
        type: 'proposal'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: 'Documentation and backup',
        practicalAction: 'Export notes/proposal/evidence and verify the work plan matches current source and dates.',
        doneWhen: 'Backup and current starting checklist saved.',
        resourceIds: ['O09'],
        type: 'review'
      },
      {
        slotLetter: 'g',
        coreMinutes: 30,
        learnOrFocus: 'Light readiness review',
        practicalAction: 'Review remaining blockers; only switch to coding-active mode if officially selected and the real start has arrived.',
        doneWhen: 'Correct mode based on actual status and dates.',
        resourceIds: ['O03', 'O05'],
        type: 'review'
      }
    ]
  },

  // WEEK 32 (Final Week: 6 targets, A through F)
  {
    number: 32,
    phaseId: 'P8',
    theme: 'Final preparation horizon and transition',
    dateRangeText: '2027-05-26 – 2027-05-31',
    slots: [
      {
        slotLetter: 'a',
        coreMinutes: 90,
        learnOrFocus: 'Actual-event transition',
        practicalAction: 'If selected and coding has begun, use the mentor-agreed project plan. Otherwise continue one useful preparation/contribution task.',
        doneWhen: 'Mode reflects actual evidence; no automatic program-start badge.',
        resourceIds: ['O03', 'O05'],
        type: 'proposal'
      },
      {
        slotLetter: 'b',
        coreMinutes: 90,
        learnOrFocus: 'First scoped action or maintenance',
        practicalAction: 'Complete the next agreed small work item or resolve an open contribution review.',
        doneWhen: 'Concrete code/test/review evidence rather than a watched-course count.',
        resourceIds: ['D09'],
        type: 'contribute'
      },
      {
        slotLetter: 'c',
        coreMinutes: 90,
        learnOrFocus: 'Validate and record',
        practicalAction: 'Run relevant checks, capture actual outcomes and write the next technical step.',
        doneWhen: 'Test log and accurate progress note.',
        resourceIds: ['D09'],
        type: 'practice'
      },
      {
        slotLetter: 'd',
        coreMinutes: 90,
        learnOrFocus: 'Communication follow-through',
        practicalAction: 'Give the agreed update or ask one precise blocker question through the correct channel.',
        doneWhen: 'Useful concise communication tied to actual work.',
        resourceIds: ['O09'],
        type: 'contribute'
      },
      {
        slotLetter: 'e',
        coreMinutes: 90,
        learnOrFocus: 'Review learning and contribution evidence',
        practicalAction: 'Review what you can independently explain, work produced, proposal status and current availability.',
        doneWhen: 'Honest portfolio/evidence summary without a Google-intern claim.',
        resourceIds: ['O02', 'O13'],
        type: 'review'
      },
      {
        slotLetter: 'f',
        coreMinutes: 90,
        learnOrFocus: '31 May horizon review',
        practicalAction: 'If the real coding start is later, schedule the maintenance cycle. If active, follow mentor milestones. If not selected, continue useful open-source work.',
        doneWhen: 'A clear next plan; progress/history retained in every outcome.',
        resourceIds: ['O03', 'O13'],
        type: 'review'
      }
    ]
  }
];

// Helper to expand a slot into 3-5 structured steps
function buildStepsForSlot(slot: GsocWeek['slots'][number], dayId: string) {
  const steps = [
    {
      id: `${dayId}-s1`,
      kind: (slot.type === 'proposal' ? 'proposal' : slot.type === 'contribute' ? 'contribute' : 'learn') as any,
      text: `Focus: ${slot.learnOrFocus}`,
      plannedMinutes: Math.round(slot.coreMinutes * 0.3),
      required: true,
      resourceRefs: slot.resourceIds.map(rid => ({ resourceId: rid })),
      doneWhen: 'Read or reviewed the concept and source references.'
    },
    {
      id: `${dayId}-s2`,
      kind: (slot.type === 'proposal' ? 'proposal' : slot.type === 'contribute' ? 'contribute' : 'practice') as any,
      text: `Action: ${slot.practicalAction}`,
      plannedMinutes: Math.round(slot.coreMinutes * 0.55),
      required: true,
      resourceRefs: slot.resourceIds.map(rid => ({ resourceId: rid })),
      doneWhen: slot.doneWhen
    },
    {
      id: `${dayId}-s3`,
      kind: 'review' as any,
      text: 'Evidence & Reflection: Record reproducible evidence, commit/diff links or notes.',
      plannedMinutes: Math.round(slot.coreMinutes * 0.15),
      required: true,
      resourceRefs: [],
      doneWhen: 'Recorded evidence and updated task status in StudyOS.'
    }
  ];
  return steps;
}

// Map phase ID from week number
function getPhaseForWeek(wNum: number): string {
  if (wNum <= 2) return 'P1';
  if (wNum <= 4) return 'P2';
  if (wNum <= 6) return 'P3';
  if (wNum <= 15) return 'P4';
  if (wNum <= 19) return 'P5';
  if (wNum <= 24) return 'P6';
  if (wNum <= 28) return 'P7';
  return 'P8';
}

/**
 * Canonical programmatically derived 223 GSoC daily targets.
 */
export const GSOC_DAYS: GsocDay[] = generateTargets(GSOC_WEEKS).map(t => {
  const slot = t.slotData;
  const phaseId = getPhaseForWeek(t.weekNumber);
  return {
    id: t.id,
    targetDate: t.targetDate,
    weekNumber: t.weekNumber,
    slotLetter: t.slotLetter,
    phaseId,
    title: slot.learnOrFocus,
    focusTopic: slot.learnOrFocus,
    practicalAction: slot.practicalAction,
    type: slot.type,
    coreMinutes: slot.coreMinutes,
    steps: buildStepsForSlot(slot, t.id),
    organizationBranch: slot.branch || 'all',
    eventDependency: slot.eventDependency,
    optional: Boolean(slot.optional),
    doneWhen: slot.doneWhen
  };
});
