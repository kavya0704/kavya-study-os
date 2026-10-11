import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Plus, 
  ExternalLink, 
  Filter, 
  Sparkles,
  X,
  GitBranch
} from 'lucide-react';
import { useGsocStore } from '../../stores/useGsocStore';
import { ContributionRecord, ContributionState } from '../../types/gsoc';
import { kolkataToday } from '../../engines/gsocDateUtils';

export const GsocContributionsBoard: React.FC = () => {
  const { contributions, addContribution, updateContribution } = useGsocStore();
  const [filterState, setFilterState] = useState<ContributionState | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ContributionRecord | null>(null);

  // Form State
  const [formOrgName, setFormOrgName] = useState('DIPY');
  const [formRepoUrl, setFormRepoUrl] = useState('https://github.com/dipy/dipy');
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formBranch, setFormBranch] = useState('');
  const [formState, setFormState] = useState<ContributionState>('submitted');
  const [formIsPractice, setFormIsPractice] = useState(false);
  const [formTestsDesc, setFormTestsDesc] = useState('');
  const [formTestResult, setFormTestResult] = useState<'passed' | 'failed' | 'not_run'>('passed');
  const [formReviewFeedback, setFormReviewFeedback] = useState('');
  const [formNextAction, setFormNextAction] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formChecklist, setFormChecklist] = useState({
    scopeAccepted: true,
    reproducible: true,
    appropriateTest: true,
    cleanDiff: true,
    docsIncluded: false,
    understandable: true,
    reviewResponded: false
  });

  const mergedCount = contributions.filter(c => c.state === 'merged').length;
  const inReviewCount = contributions.filter(c => c.state === 'submitted' || c.state === 'in_progress').length;
  const draftCount = contributions.filter(c => c.state === 'draft_pr').length;

  const filteredList = contributions.filter(c => {
    if (filterState === 'all') return true;
    return c.state === filterState;
  });

  const resetForm = () => {
    setFormOrgName('DIPY');
    setFormRepoUrl('https://github.com/dipy/dipy');
    setFormTitle('');
    setFormUrl('');
    setFormBranch('');
    setFormState('submitted');
    setFormIsPractice(false);
    setFormTestsDesc('');
    setFormTestResult('passed');
    setFormReviewFeedback('');
    setFormNextAction('');
    setFormNotes('');
    setFormChecklist({
      scopeAccepted: true,
      reproducible: true,
      appropriateTest: true,
      cleanDiff: true,
      docsIncluded: false,
      understandable: true,
      reviewResponded: false
    });
    setEditingRecord(null);
  };

  const handleOpenEdit = (rec: ContributionRecord) => {
    setEditingRecord(rec);
    setFormOrgName(rec.orgName);
    setFormRepoUrl(rec.repoUrl);
    setFormTitle(rec.title);
    setFormUrl(rec.issueOrPrUrl);
    setFormBranch(rec.branchName);
    setFormState(rec.state);
    setFormIsPractice(rec.isPracticeRepo);
    setFormTestsDesc(rec.testsRunDescription);
    setFormTestResult(rec.testResult);
    setFormReviewFeedback(rec.reviewFeedback);
    setFormNextAction(rec.nextAction);
    setFormNotes(rec.learningNotes);
    setFormChecklist(rec.qualityChecklist);
    setShowAddModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    if (editingRecord) {
      await updateContribution({
        ...editingRecord,
        orgName: formOrgName,
        repoUrl: formRepoUrl,
        title: formTitle.trim(),
        issueOrPrUrl: formUrl.trim(),
        branchName: formBranch.trim(),
        state: formState,
        isPracticeRepo: formIsPractice,
        testsRunDescription: formTestsDesc.trim(),
        testResult: formTestResult,
        reviewFeedback: formReviewFeedback.trim(),
        nextAction: formNextAction.trim(),
        learningNotes: formNotes.trim(),
        qualityChecklist: formChecklist
      });
    } else {
      await addContribution({
        orgId: formOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        orgName: formOrgName,
        repoUrl: formRepoUrl,
        title: formTitle.trim(),
        issueOrPrUrl: formUrl.trim(),
        branchName: formBranch.trim() || 'patch-1',
        state: formState,
        isPracticeRepo: formIsPractice,
        testsRunDescription: formTestsDesc.trim(),
        testResult: formTestResult,
        reviewFeedback: formReviewFeedback.trim(),
        nextAction: formNextAction.trim(),
        mergedDate: formState === 'merged' ? kolkataToday() : undefined,
        learningNotes: formNotes.trim(),
        qualityChecklist: formChecklist
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const getStateBadge = (state: ContributionState) => {
    switch (state) {
      case 'merged':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">MERGED 🎉</span>;
      case 'submitted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">SUBMITTED</span>;
      case 'in_progress':
      case 'planned':
      case 'reproduced':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 text-teal-800 border border-teal-200">IN PROGRESS</span>;
      case 'changes_requested':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">CHANGES REQUESTED</span>;
      case 'draft_pr':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">DRAFT PR</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">CLOSED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{state}</span>;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-12 text-slate-900">
      {/* 1. Header & KPI Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 flex items-center space-x-1.5">
            <Sparkles size={14} />
            <span>Open Source Proof-Of-Work Tracker</span>
          </span>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Log Contribution / PR</span>
          </button>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            GSoC Contribution Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Targeting <strong>3 to 5 merged PRs</strong> before proposal submission deadline. Maintainers evaluate real pull request conversations, test coverage, and documentation rigor.
          </p>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total PRs</span>
            <span className="text-lg font-black text-slate-900">{contributions.length}</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Merged PRs</span>
            <span className="text-lg font-black text-emerald-800">{mergedCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">In Review</span>
            <span className="text-lg font-black text-blue-800">{inReviewCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Drafts</span>
            <span className="text-lg font-black text-slate-700">{draftCount}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filterState === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({contributions.length})
          </button>
          <button
            onClick={() => setFilterState('merged')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filterState === 'merged' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Merged ({mergedCount})
          </button>
          <button
            onClick={() => setFilterState('submitted')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filterState === 'submitted' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setFilterState('changes_requested')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filterState === 'changes_requested' 
                ? 'bg-amber-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Changes Requested
          </button>
          <button
            onClick={() => setFilterState('draft_pr')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              filterState === 'draft_pr' 
                ? 'bg-slate-700 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Draft PR
          </button>
        </div>
      </div>

      {/* 2. Contributions List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <GitPullRequest size={32} className="mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No contributions logged yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Once you start Phase 2 & Phase 3 (Good First Issues), log your practice PRs and upstream patches here.
            </p>
          </div>
        ) : (
          filteredList.map((rec) => {
            return (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 hover:border-teal-200 transition-all"
              >
                {/* Top Row */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {rec.orgName}
                      </span>
                      {getStateBadge(rec.state)}
                      {rec.isPracticeRepo && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          Practice Sandbox
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-400">
                        Opened: {rec.openedDate}
                      </span>
                      {rec.mergedDate && (
                        <span className="text-[11px] font-bold text-emerald-600">
                          Merged: {rec.mergedDate}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                      {rec.title}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
                      <GitBranch size={12} className="text-slate-400 shrink-0" />
                      <span>{rec.branchName}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(rec)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                    >
                      Update
                    </button>
                    <a
                      href={rec.issueOrPrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white transition-colors"
                      title="Open PR on GitHub"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Tests & Feedback Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {rec.testsRunDescription && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                        Test Suite Executed ({rec.testResult.toUpperCase()})
                      </span>
                      <p className="text-slate-700 line-clamp-2">{rec.testsRunDescription}</p>
                    </div>
                  )}

                  {rec.nextAction && (
                    <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-200">
                      <span className="text-[10px] font-black uppercase text-teal-700 block mb-0.5">
                        Next Action
                      </span>
                      <p className="text-slate-800 line-clamp-2">{rec.nextAction}</p>
                    </div>
                  )}
                </div>

                {/* Quality Checklist Summary */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${rec.qualityChecklist.appropriateTest ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    ✓ Tests Passed
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${rec.qualityChecklist.reproducible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    ✓ Clean Commits
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${rec.qualityChecklist.docsIncluded ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    ✓ Docs Updated
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${rec.qualityChecklist.scopeAccepted ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    ✓ Scope Accepted
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="bg-white w-full max-w-xl rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-slate-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingRecord ? 'Update Contribution / PR' : 'Log New Open Source Contribution'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formOrgName}
                    onChange={e => setFormOrgName(e.target.value)}
                    placeholder="e.g. DIPY, PyTorch-Ignite"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    State / Status *
                  </label>
                  <select
                    value={formState}
                    onChange={e => setFormState(e.target.value as ContributionState)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="draft">Draft (Local Branch)</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="changes_requested">Changes Requested</option>
                    <option value="merged">Merged 🎉</option>
                    <option value="closed">Closed / Abandoned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  PR Title / Feature Name *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. MAINT: Optimize spherical harmonics evaluation with Cython"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    GitHub PR or Issue URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formUrl}
                    onChange={e => setFormUrl(e.target.value)}
                    placeholder="https://github.com/.../pull/123"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formBranch}
                    onChange={e => setFormBranch(e.target.value)}
                    placeholder="fix/shm-eval-docs"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="practiceCheck"
                  checked={formIsPractice}
                  onChange={e => setFormIsPractice(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="practiceCheck" className="text-xs font-semibold text-slate-700">
                  This was in a practice repo / sandbox (e.g. first-contributions)
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tests Run & Local Validation
                </label>
                <input
                  type="text"
                  value={formTestsDesc}
                  onChange={e => setFormTestsDesc(e.target.value)}
                  placeholder="e.g. pytest dipy/reconst/tests/ -k test_shm (all 14 passed)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Review Feedback & Next Steps
                </label>
                <textarea
                  rows={2}
                  value={formNextAction}
                  onChange={e => setFormNextAction(e.target.value)}
                  placeholder="Mentor suggested addressing docstring flake8 warning and re-running CI..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Quality Checklist toggles */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Quality Checklist Prior to Submission
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formChecklist.appropriateTest}
                      onChange={e => setFormChecklist({ ...formChecklist, appropriateTest: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                    <span>Local tests pass</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formChecklist.reproducible}
                      onChange={e => setFormChecklist({ ...formChecklist, reproducible: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                    <span>Clean commit log</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formChecklist.docsIncluded}
                      onChange={e => setFormChecklist({ ...formChecklist, docsIncluded: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                    <span>Docs / docstrings updated</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formChecklist.scopeAccepted}
                      onChange={e => setFormChecklist({ ...formChecklist, scopeAccepted: e.target.checked })}
                      className="rounded text-teal-600"
                    />
                    <span>Scope accepted / Issue linked</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                >
                  {editingRecord ? 'Save Changes' : 'Log Contribution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
