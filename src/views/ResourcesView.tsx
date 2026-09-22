import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { Resource } from '../types';
import { useResourceStore } from '../stores/useResourceStore';
import { 
  ResourceCard, 
  ResourceSegments, 
  BrokenLinkModal, 
  AddCustomResourceModal 
} from '../components/resources';

export const ResourcesView: React.FC = () => {
  const {
    resources,
    isLoading,
    searchQuery,
    selectedSegment,
    selectedLanguage,
    onlyPrimary,
    loadResources,
    setSearchQuery,
    setSelectedSegment,
    setSelectedLanguage,
    setOnlyPrimary,
    toggleFavorite,
    incrementUseCount
  } = useResourceStore();

  const [selectedForBrokenReport, setSelectedForBrokenReport] = useState<Resource | null>(null);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  // Compute segment counts
  const counts = {
    all: resources.length,
    video: resources.filter(r => r.type === 'video').length,
    documentation: resources.filter(r => r.type === 'documentation').length,
    practice: resources.filter(r => r.type === 'practice').length,
    career: resources.filter(r => r.type === 'career').length,
    saved: resources.filter(r => r.isFavourite).length
  };

  // Filter resources
  const filtered = resources.filter(r => {
    if (selectedSegment === 'saved' && !r.isFavourite) return false;
    if (selectedSegment !== 'all' && selectedSegment !== 'saved' && r.type !== selectedSegment) return false;
    if (selectedLanguage !== 'All' && r.language !== selectedLanguage) return false;
    if (onlyPrimary && !r.isPrimary) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchTopic = r.topic.toLowerCase().includes(q);
      const matchProvider = r.provider.toLowerCase().includes(q);
      const matchCategory = r.category.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic && !matchProvider && !matchCategory) return false;
    }

    return true;
  });

  const languages: Array<'All' | 'Hindi' | 'Hinglish' | 'English'> = ['All', 'Hindi', 'Hinglish', 'English'];

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-28 space-y-3.5 animate-in fade-in">
      {/* Title & Add Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Canonical Resources</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              62 Curated
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Official docs, tutorials, practice platforms & jobs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCustomOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all shrink-0 active:scale-95"
        >
          <Plus size={14} />
          <span>Add Link</span>
        </button>
      </div>

      {/* Real-time Search Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic, library, provider..."
          style={{ fontSize: '16px' }}
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Segmented Categories Navigation */}
      <ResourceSegments
        selectedSegment={selectedSegment}
        onSelectSegment={setSelectedSegment}
        counts={counts}
      />

      {/* Filter Chips Bar */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5 text-xs">
        <div className="flex items-center space-x-1 shrink-0">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLanguage(lang)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedLanguage === lang
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOnlyPrimary(!onlyPrimary)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center space-x-1 ${
            onlyPrimary
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Sparkles size={11} />
          <span>Primary Only</span>
        </button>
      </div>

      {/* Resources List */}
      <div className="space-y-2.5 pt-1">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400 text-xs animate-pulse">
            Loading curated resources...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 bg-white border border-slate-100 rounded-3xl p-5 text-slate-500 text-xs shadow-xs">
            No resources match your search criteria.
          </div>
        ) : (
          filtered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onToggleFavorite={toggleFavorite}
              onReportBroken={(res) => setSelectedForBrokenReport(res)}
              onLaunch={incrementUseCount}
            />
          ))
        )}
      </div>

      {/* Report Broken Link Modal */}
      {selectedForBrokenReport && (
        <BrokenLinkModal
          resource={selectedForBrokenReport}
          isOpen={!!selectedForBrokenReport}
          onClose={() => setSelectedForBrokenReport(null)}
        />
      )}

      {/* Add Custom Resource Modal */}
      <AddCustomResourceModal
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
      />
    </div>
  );
};
