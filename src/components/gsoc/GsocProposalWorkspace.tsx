import React, { useState } from 'react';
import { 
  Download, 
  Save, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { useGsocStore } from '../../stores/useGsocStore';
import { downloadProposalMarkdown } from '../../services/export/gsocBackup';
import { ProposalDraft } from '../../types/gsoc';

interface SectionConfig {
  key: keyof ProposalDraft;
  title: string;
  placeholder: string;
  guidance: string;
}

const PROPOSAL_SECTIONS: SectionConfig[] = [
  {
    key: 'title',
    title: '1. Proposal Title & Abstract',
    placeholder: 'e.g. DIPY: Accelerated Microstructural Estimation using Cython and OpenMP Kernels...',
    guidance: 'State the exact project title and a 200-word executive summary of what you are building.'
  },
  {
    key: 'selectedOrgId',
    title: '2. Target Organization & Ideas Page Link',
    placeholder: 'dipy',
    guidance: 'Enter the target organization ID (dipy, pytorch-ignite, matplotlib) and reference the official ideas page URL.'
  },
  {
    key: 'ideaUrl',
    title: '3. Official Project Idea URL',
    placeholder: 'https://github.com/dipy/dipy/wiki/Google-Summer-of-Code-2027#idea-1',
    guidance: 'Direct permalink to the project description in the organization wiki or discussion board.'
  },
  {
    key: 'contactChannel',
    title: '4. Community Channel & Mentor Discussions',
    placeholder: 'Discussed on DIPY Gitter channel #gsoc with maintainers @mentor1 and @mentor2...',
    guidance: 'Log dates, thread URLs, and maintainer feedback received before finalizing scope.'
  },
  {
    key: 'problemAndUsers',
    title: '5. Problem Description & Target Users',
    placeholder: 'Currently, voxel-wise diffusion tensor fitting on whole-brain scans takes over 15 minutes...',
    guidance: 'Explain why this feature matters, who benefits, and what pain point is resolved.'
  },
  {
    key: 'architectureAnalysis',
    title: '6. Codebase & Architecture Analysis',
    placeholder: 'The current implementation resides in dipy.reconst.dti. The bottlenecks are within...',
    guidance: 'Demonstrate that you have read the actual source code, citing modules, classes, and algorithms.'
  },
  {
    key: 'proposedApproach',
    title: '7. Proposed Technical Solution',
    placeholder: 'We propose introducing a compiled Cython extension with nogil loops and NumPy memoryviews...',
    guidance: 'Technical details: algorithms, data structures, libraries, and design patterns.'
  },
  {
    key: 'deliverablesMvp',
    title: '8. Core Deliverables (Minimum Viable Product)',
    placeholder: '1. Optimized Cython kernel\n2. Backward-compatible API wrapper\n3. Full pytest suite\n4. Tutorial gallery example',
    guidance: 'Items guaranteed to be delivered by the mid-term and final evaluation deadlines.'
  },
  {
    key: 'deliverablesStretch',
    title: '9. Stretch Goals (Optional Bonus)',
    placeholder: '1. GPU acceleration via PyTorch tensor backend\n2. Interactive 3D visualization gallery example',
    guidance: 'High-value extensions to tackle if core MVP is completed ahead of schedule.'
  },
  {
    key: 'explicitExclusions',
    title: '10. Explicit Exclusions (Out of Scope)',
    placeholder: 'This project will not alter legacy file parsers or modify non-diffusion modalities...',
    guidance: 'Crucial for GSoC scoring: prevents scope creep by explicitly defining what you will NOT do.'
  },
  {
    key: 'testValidationPlan',
    title: '11. Testing, Validation & Documentation Plan',
    placeholder: 'Unit tests covering edge cases via pytest, benchmarks using pytest-benchmark against baseline...',
    guidance: 'How mentors will verify correctness, accuracy, numerical stability, and Sphinx documentation.'
  },
  {
    key: 'timelineWeekly',
    title: '12. Weekly Execution Timeline (32-Week Alignment)',
    placeholder: 'Community Bonding (Weeks 1-4): ...\nCoding Phase 1 (Weeks 5-8): ...\nMidterm Evaluation (Week 12): ...\nFinal Evaluation: ...',
    guidance: 'Concrete weekly milestones with measurable deliverables for each week.'
  },
  {
    key: 'pastWorkEvidence',
    title: '13. Proof of Work, Merged PRs & Bio',
    placeholder: 'Merged PR #1: https://github.com/dipy/dipy/pull/...\nMerged PR #2: ...\nBio: 3rd year B.Tech CSE AI/ML student...',
    guidance: 'Provide links to your merged PRs in this repo, relevant GitHub projects, and background.'
  }
];

export const GsocProposalWorkspace: React.FC = () => {
  const { activeProposal, saveProposalDraft } = useGsocStore();
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const proposal: ProposalDraft = activeProposal || {
    id: 'gsoc-2027-proposal-main',
    title: 'Accelerated Numerical Fitting for DIPY Reconstruction',
    selectedOrgId: 'dipy',
    ideaUrl: 'https://github.com/dipy/dipy/wiki/Google-Summer-of-Code-2027',
    contactChannel: 'DIPY Gitter & GitHub Discussions',
    problemAndUsers: '',
    architectureAnalysis: '',
    proposedApproach: '',
    deliverablesMvp: '',
    deliverablesStretch: '',
    explicitExclusions: '',
    testValidationPlan: '',
    timelineWeekly: '',
    dependenciesAndRisks: '',
    pastWorkEvidence: '',
    availabilityAndExams: '',
    communicationPlan: '',
    feedbackLog: '',
    templateComplianceNotes: '',
    aiDisclosure: '',
    lastAutoSaved: '2026-10-21',
    isSubmittedToPlatform: false
  };

  const handleFieldChange = (key: keyof ProposalDraft, val: string) => {
    saveProposalDraft({ [key]: val });
  };

  const handleManualSave = async () => {
    await saveProposalDraft({});
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExport = () => {
    downloadProposalMarkdown(proposal, 'gsoc-2027-proposal.md');
  };

  const currentSection = PROPOSAL_SECTIONS[activeSectionIdx];
  const filledSectionsCount = PROPOSAL_SECTIONS.filter(s => {
    const val = (proposal as Record<string, any>)[s.key];
    return typeof val === 'string' && val.trim().length > 20;
  }).length;

  const readinessScore = Math.round((filledSectionsCount / PROPOSAL_SECTIONS.length) * 100);

  return (
    <div className="space-y-4 animate-in fade-in pb-12 text-slate-900">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 flex items-center space-x-1.5">
            <Sparkles size={14} />
            <span>Official Contributor Proposal Guide</span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              title="Download proposal as Markdown"
            >
              <Download size={13} />
              <span>Export .md</span>
            </button>

            <button
              onClick={handleManualSave}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Save size={13} />
              <span>{saveSuccess ? 'Saved!' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            GSoC 2027 Proposal Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Standard 12-section proposal blueprint adhering strictly to Google Summer of Code guidelines. Scored on architecture depth, realistic milestones, and proof of work.
          </p>
        </div>

        {/* Proposal Readiness Meter */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-slate-600">Proposal Readiness Score</span>
            <span className="text-teal-600 font-black">
              {filledSectionsCount} of {PROPOSAL_SECTIONS.length} Sections Drafted ({readinessScore}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${readinessScore >= 80 ? 'bg-emerald-500' : 'bg-teal-500'}`}
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
          {PROPOSAL_SECTIONS.map((sec, idx) => {
            const val = proposal[sec.key];
            const isFilled = typeof val === 'string' && val.trim().length > 20;
            const isSelected = activeSectionIdx === idx;

            return (
              <button
                key={sec.key}
                onClick={() => setActiveSectionIdx(idx)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : isFilled
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isFilled && <CheckCircle2 size={12} className={isSelected ? 'text-emerald-400' : 'text-emerald-600'} />}
                <span>{sec.title.split('.')[0]}. {sec.title.split('.')[1]?.slice(0, 14)}...</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Section Editor */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-teal-600">
              Section {activeSectionIdx + 1} of {PROPOSAL_SECTIONS.length}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Autosaves locally to IndexedDB
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {currentSection.title}
          </h3>

          <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <strong>Guidance:</strong> {currentSection.guidance}
          </p>
        </div>

        {/* Input / Textarea */}
        {currentSection.key === 'title' || currentSection.key === 'ideaUrl' || currentSection.key === 'selectedOrgId' ? (
          <input
            type="text"
            value={String((proposal as Record<string, any>)[currentSection.key] || '')}
            onChange={e => handleFieldChange(currentSection.key, e.target.value)}
            placeholder={currentSection.placeholder}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
          />
        ) : (
          <textarea
            rows={10}
            value={String((proposal as Record<string, any>)[currentSection.key] || '')}
            onChange={e => handleFieldChange(currentSection.key, e.target.value)}
            placeholder={currentSection.placeholder}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400 font-mono"
          />
        )}

        {/* Prev / Next Section Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            disabled={activeSectionIdx === 0}
            onClick={() => setActiveSectionIdx(activeSectionIdx - 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            &larr; Previous Section
          </button>

          <span className="text-xs font-bold text-slate-400">
            {activeSectionIdx + 1} / {PROPOSAL_SECTIONS.length}
          </span>

          <button
            disabled={activeSectionIdx === PROPOSAL_SECTIONS.length - 1}
            onClick={() => setActiveSectionIdx(activeSectionIdx + 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
          >
            Next Section &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
