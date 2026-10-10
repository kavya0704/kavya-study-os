import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Sparkles, 
  Target, 
  Bookmark, 
  CheckCircle2, 
  Plus, 
  X
} from 'lucide-react';
import { useInternshipStore } from '../../stores/useInternshipStore';
import { InternshipCard } from './InternshipCard';

type FilterTab = 'all' | 'remote' | 'top_tech' | 'saved' | 'applied';

export const InternshipBoard: React.FC = () => {
  const { 
    weeklyBatch, 
    customInternships,
    getAppliedCount, 
    getBookmarkedCount, 
    getInterviewCount,
    getStatus,
    addCustomInternship
  } = useInternshipStore();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding custom internship
  const [customTitle, setCustomTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customLocation, setCustomLocation] = useState('Remote');
  const [customWorkMode, setCustomWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [customStipend, setCustomStipend] = useState('');
  const [customApplyUrl, setCustomApplyUrl] = useState('');
  const [customSkills, setCustomSkills] = useState('');

  const appliedCount = getAppliedCount();
  const bookmarkedCount = getBookmarkedCount();
  const interviewCount = getInterviewCount();
  const goalTarget = weeklyBatch.targetApplicationsGoal || 40;
  const progressPercent = Math.min(100, Math.round((appliedCount / goalTarget) * 100));

  // Combine curated weekly openings with user's custom saved openings
  const allListings = [...weeklyBatch.internships, ...customInternships];

  // Filtering
  const filteredListings = allListings.filter((item) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCompany = item.company.toLowerCase().includes(q);
      const matchSkill = item.skills.some(s => s.toLowerCase().includes(q));
      const matchLocation = item.location.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchSkill && !matchLocation) return false;
    }

    // Category / status filter
    if (activeFilter === 'remote') return item.workMode === 'Remote';
    if (activeFilter === 'top_tech') return item.featured;
    if (activeFilter === 'saved') return getStatus(item.id) === 'saved';
    if (activeFilter === 'applied') {
      const s = getStatus(item.id);
      return s === 'applied' || s === 'interviewing' || s === 'offered';
    }

    return true;
  });

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customCompany || !customApplyUrl) return;

    addCustomInternship({
      title: customTitle,
      company: customCompany,
      companyLogoText: customCompany.slice(0, 2).toUpperCase(),
      location: customLocation,
      workMode: customWorkMode,
      stipend: customStipend || 'Competitive',
      batch: '2026 / 2027 Batch',
      skills: customSkills ? customSkills.split(',').map(s => s.trim()) : ['Python', 'AI/ML'],
      applyUrl: customApplyUrl.startsWith('http') ? customApplyUrl : `https://${customApplyUrl}`,
      sourcePlatform: 'Custom Discovery',
      postedDate: 'Today',
      deadline: 'Rolling',
      description: `Added by you to StudyOS pipeline on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`,
      featured: false
    });

    // Reset & close
    setCustomTitle('');
    setCustomCompany('');
    setCustomApplyUrl('');
    setCustomStipend('');
    setCustomSkills('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in pb-12">
      {/* 1. Header Banner & Goal Meter */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 md:p-7 text-white shadow-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {weeklyBatch.weekLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ⚡ Auto-Updated Weekly
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white mt-1.5 tracking-tight flex items-center space-x-2">
                <span>10 Fresh AI & Software Internships</span>
              </h1>
              <p className="text-xs text-slate-300 pt-0.5 max-w-xl">
                Active verified student openings across Big Tech, Indian AI unicorns & open-source labs. Updated every Monday.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-transform active:scale-95 flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
            >
              <Plus size={14} />
              <span>Track Custom Job</span>
            </button>
          </div>

          {/* Goal Tracker: 30-40 Target Applications */}
          <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center space-x-1.5 text-blue-300">
                <Target size={14} />
                <span>Roadmap Goal: 30–40 Targeted Applications</span>
              </div>
              <div className="text-white font-mono">
                {appliedCount} / {goalTarget} Applied ({progressPercent}%)
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Quick Stat Badges */}
            <div className="flex items-center space-x-3 text-[11px] text-slate-300 pt-0.5">
              <span className="flex items-center space-x-1 font-semibold">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>{appliedCount} Applied</span>
              </span>
              <span className="flex items-center space-x-1 font-semibold">
                <Bookmark size={12} className="text-amber-400" />
                <span>{bookmarkedCount} Saved</span>
              </span>
              <span className="flex items-center space-x-1 font-semibold">
                <Sparkles size={12} className="text-purple-400" />
                <span>{interviewCount} In Interview</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, role, or skill (e.g. PyTorch, Microsoft, Remote)..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({allListings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('remote')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'remote'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Remote
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('top_tech')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'top_tech'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Top Picks
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('saved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'saved'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ★ Saved ({bookmarkedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('applied')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'applied'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ✓ Applied ({appliedCount})
          </button>
        </div>
      </div>

      {/* 3. Listings Grid (Responsive: 1-col on mobile, 2-col on laptop/desktop) */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredListings.map((item) => (
            <InternshipCard key={item.id} internship={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
          <Briefcase size={28} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No internships match this filter</h3>
          <p className="text-xs text-slate-500">
            Try switching filters or search terms to see all 10 weekly openings.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Add Custom Internship Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Track a Custom Internship
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI / Machine Learning Engineer Intern"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarvam AI, OpenAI"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={customWorkMode}
                    onChange={(e) => setCustomWorkMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Remote"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stipend</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50,000 / mo"
                    value={customStipend}
                    onChange={(e) => setCustomStipend(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="Python, PyTorch, LangChain"
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Application URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={customApplyUrl}
                  onChange={(e) => setCustomApplyUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Add to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
