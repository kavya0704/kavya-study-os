import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Wrench, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface ReadinessDimension {
  id: string;
  category: string;
  title: string;
  description: string;
  proofCriterion: string;
}

const SCORECARD_DIMENSIONS: ReadinessDimension[] = [
  {
    id: 'backlog_recovery',
    category: 'Foundations',
    title: 'Masai Backlog Recovery (25/25)',
    description: 'All 25 backlog videos cleared with all 6 verification subtasks.',
    proofCriterion: '25 distinct verified lessons in IndexedDB'
  },
  {
    id: 'daily_consistency',
    category: 'Foundations',
    title: 'Daily Practice Pacing (101 Days)',
    description: 'Disciplined consistency without cramming or burn-out.',
    proofCriterion: 'Regular focus logs with Puja rest respected'
  },
  {
    id: 'production_python',
    category: 'Core Engineering',
    title: 'Production Python & OOP Fluency',
    description: 'Object-oriented programming, custom exceptions, dataclasses, vectorization.',
    proofCriterion: 'Blank-editor assessment passed & modular scripts'
  },
  {
    id: 'pandas_wrangling',
    category: 'Core Engineering',
    title: 'Data Wrangling & Pandas Fluency',
    description: 'Groupby, joins, pivots, datetime indexing, vectorized string methods.',
    proofCriterion: 'EDA scripts on Kaggle datasets'
  },
  {
    id: 'sql_analytics',
    category: 'Core Engineering',
    title: 'SQL Analytics & Window Functions',
    description: 'Aggregations, CTEs, window functions (ROW_NUMBER, RANK), joins.',
    proofCriterion: 'LeetCode 50 SQL solutions committed'
  },
  {
    id: 'leak_free_pipelines',
    category: 'Machine Learning',
    title: 'Leak-Free Scikit-Learn Pipelines',
    description: 'ColumnTransformer, train/test split safety, cross-validation scoring.',
    proofCriterion: 'Published classification & regression pipelines'
  },
  {
    id: 'feature_engineering',
    category: 'Machine Learning',
    title: 'Categorical Encoding & Scaling',
    description: 'One-Hot vs Ordinal encoding, StandardScaler, target encoding.',
    proofCriterion: 'Clean transformers with zero target leakage'
  },
  {
    id: 'git_proofs',
    category: 'Production',
    title: 'Git Version Control & Public Proofs',
    description: 'Clean commit histories, well-documented READMEs, model cards.',
    proofCriterion: 'Public GitHub repositories with commit proofs'
  },
  {
    id: 'portfolio_capstones',
    category: 'Production',
    title: 'Deployed Capstones & Web Apps',
    description: 'Customer Churn Tabular ML app + evaluated Grounded RAG system.',
    proofCriterion: 'Live Streamlit/HuggingFace deployed apps'
  },
  {
    id: 'dsa_problem_solving',
    category: 'Algorithms',
    title: 'DSA Fundamentals & Core Patterns',
    description: 'Two Pointers, Sliding Window, Hash Maps, Stacks, Binary Search.',
    proofCriterion: 'LeetCode 75 problem set completed'
  },
  {
    id: 'mock_interviews',
    category: 'Career',
    title: '3 Recorded Mock Technical Interviews',
    description: 'Verbal algorithmic trade-off defense & ML concept explanations.',
    proofCriterion: '3 recorded audio/video mock sessions with self-critique'
  },
  {
    id: 'internship_applications',
    category: 'Career',
    title: '30–40 Targeted Internship Applications',
    description: 'Submitted applications across LinkedIn, Internshala, Wellfound, Naukri.',
    proofCriterion: 'Spreadsheet tracker with 30 verified job submissions'
  }
];

const STORAGE_KEY = 'kavya_study_os_readiness_scorecard';

export const ReadinessScorecard: React.FC = () => {
  const [statuses, setStatuses] = useState<Record<string, 'ready' | 'repair'>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStatuses(JSON.parse(saved));
      } else {
        const initial: Record<string, 'ready' | 'repair'> = {
          backlog_recovery: 'repair',
          daily_consistency: 'ready',
          production_python: 'repair',
          pandas_wrangling: 'repair',
          sql_analytics: 'repair',
          leak_free_pipelines: 'repair',
          feature_engineering: 'repair',
          git_proofs: 'repair',
          portfolio_capstones: 'repair',
          dsa_problem_solving: 'repair',
          mock_interviews: 'repair',
          internship_applications: 'repair'
        };
        setStatuses(initial);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleToggle = (id: string) => {
    const current = statuses[id] || 'repair';
    const next = current === 'ready' ? 'repair' : 'ready';
    const updated: Record<string, 'ready' | 'repair'> = { ...statuses, [id]: next };
    setStatuses(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage safe
    }
  };

  const readyCount = Object.values(statuses).filter(s => s === 'ready').length;
  const totalCount = SCORECARD_DIMENSIONS.length;
  const percentage = Math.round((readyCount / totalCount) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3.5">
      {/* Header & Overall Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Award size={18} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
              31 December Milestone
            </span>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              Internship Readiness Scorecard
            </h3>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-black text-slate-900 font-mono">
            {readyCount} <span className="text-slate-400 text-xs">/ {totalCount}</span>
          </div>
          <span className={`text-xs font-black ${percentage >= 75 ? 'text-blue-600' : 'text-amber-700'}`}>
            {percentage}% Ready
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= 75 ? 'bg-blue-600' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.max(2, percentage)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-0.5">
          <span>Target: 100% by 31 December 2026</span>
          <span>{totalCount - readyCount} dimensions in repair</span>
        </div>
      </div>

      {/* Interactive 12 Dimension Checklist */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
            12 Essential Competency Dimensions:
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand All'}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div className="space-y-2">
          {SCORECARD_DIMENSIONS.map((dim, idx) => {
            const status = statuses[dim.id] || 'repair';
            const isReady = status === 'ready';

            if (!isExpanded && idx >= 4) return null;

            return (
              <div
                key={dim.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isReady
                    ? 'bg-blue-50/40 border-blue-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 px-2 py-0.5 rounded bg-white border border-slate-200">
                        {dim.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                      {dim.title}
                    </h4>
                    <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                      {dim.description}
                    </p>
                    <span className="text-[11px] font-bold text-blue-700 block mt-1">
                      Proof: {dim.proofCriterion}
                    </span>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggle(dim.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center space-x-1 ${
                      isReady
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isReady ? (
                      <>
                        <CheckCircle2 size={13} className="text-white" />
                        <span>Ready ✓</span>
                      </>
                    ) : (
                      <>
                        <Wrench size={13} className="text-amber-600" />
                        <span>Repair ⚠️</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-2xl text-xs font-bold transition-colors text-center"
          >
            Show All 12 Competencies ({totalCount - 4} more)
          </button>
        )}
      </div>
    </div>
  );
};
