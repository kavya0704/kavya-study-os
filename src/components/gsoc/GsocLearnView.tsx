import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Youtube, 
  FileText, 
  Globe, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { GSOC_RESOURCES } from '../../data/gsoc2027';
import { GsocResource } from '../../types/gsoc';

type CategoryFilter = 'all' | 'video' | 'docs' | 'program' | 'case_study';

export const GsocLearnView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('video');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = GSOC_RESOURCES.filter(r => {
    let matchesCategory = true;
    if (activeCategory === 'video') {
      matchesCategory = r.type === 'video' || r.type === 'playlist';
    } else if (activeCategory === 'docs') {
      matchesCategory = r.type === 'docs' || r.type === 'exercise';
    } else if (activeCategory === 'program') {
      matchesCategory = r.type === 'program';
    } else if (activeCategory === 'case_study') {
      matchesCategory = r.type === 'case_study';
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      r.title.toLowerCase().includes(q) ||
      (r.channelOrPublisher && r.channelOrPublisher.toLowerCase().includes(q)) ||
      r.id.toLowerCase().includes(q) ||
      (r.approximateDurationLabel && r.approximateDurationLabel.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const videoCount = GSOC_RESOURCES.filter(r => r.type === 'video' || r.type === 'playlist').length;
  const docsCount = GSOC_RESOURCES.filter(r => r.type === 'docs' || r.type === 'exercise').length;
  const programCount = GSOC_RESOURCES.filter(r => r.type === 'program').length;
  const caseStudyCount = GSOC_RESOURCES.filter(r => r.type === 'case_study').length;

  return (
    <div className="space-y-4 animate-in fade-in pb-12 text-slate-900">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 flex items-center space-x-1.5">
            <Sparkles size={14} />
            <span>Verified 45-Resource Master Library</span>
          </span>
          <span className="text-xs font-bold text-slate-500">
            100% Free & Open Access
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          GSoC 2027 Research & Learning Hub
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Exclusively vetted resources: Git & GitHub masterclasses, DIPY developer webinars, pytest & NumPy documentation, official Google guides, and accepted contributor proposals.
        </p>

        {/* Search Input */}
        <div className="relative pt-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, topic, publisher, or ID (e.g. Git, NumPy, Traversy, V02)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory('video')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeCategory === 'video'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Youtube size={14} />
            <span>Videos & Playlists ({videoCount})</span>
          </button>

          <button
            onClick={() => setActiveCategory('docs')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeCategory === 'docs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <FileText size={14} />
            <span>Core Docs & Books ({docsCount})</span>
          </button>

          <button
            onClick={() => setActiveCategory('program')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeCategory === 'program'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Globe size={14} />
            <span>Official GSoC Guides ({programCount})</span>
          </button>

          <button
            onClick={() => setActiveCategory('case_study')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              activeCategory === 'case_study'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BookOpen size={14} />
            <span>Contributor Case Studies ({caseStudyCount})</span>
          </button>

          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All ({GSOC_RESOURCES.length})
          </button>
        </div>
      </div>

      {/* 2. Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredResources.map((res: GsocResource) => {
          const targetUrl = res.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${res.title} ${res.channelOrPublisher}`)}`;

          return (
            <div
              key={res.id}
              className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    res.type === 'video' || res.type === 'playlist'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : res.type === 'docs' || res.type === 'exercise'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : res.type === 'program'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {res.type.replace('_', ' ').toUpperCase()} • {res.id.toUpperCase()}
                  </span>

                  {res.approximateDurationLabel && (
                    <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{res.approximateDurationLabel}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                  {res.title}
                </h3>

                {/* Channel / Publisher */}
                {res.channelOrPublisher && (
                  <p className="text-xs font-bold text-teal-700">
                    by {res.channelOrPublisher}
                  </p>
                )}

                <p className="text-[11px] text-slate-400">
                  Language: {res.language} • Verified: {res.verifiedAt}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 size={13} />
                  <span>Verified Resource</span>
                </span>

                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <span>Open Resource</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">No matching resources found.</p>
          <p className="text-xs text-slate-400">Try adjusting your keyword query or switching categories.</p>
        </div>
      )}
    </div>
  );
};
