import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  Flame, 
  GitPullRequest, 
  FileText, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { useGsocStore } from '../../stores/useGsocStore';
import { GSOC_PHASES } from '../../data/gsoc2027';
import { exportGsocBackup, importGsocBackup } from '../../services/export/gsocBackup';

export const GsocProgressView: React.FC = () => {
  const { 
    metrics, 
    days, 
    progressMap, 
    sessions, 
    contributions, 
    officialEvents, 
    resetGsocOnly, 
    loadAll 
  } = useGsocStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + Math.round(s.durationSeconds / 60), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const overallPercentage = metrics.totalDays > 0 
    ? Math.round((metrics.completedDays / metrics.totalDays) * 100) 
    : 0;

  const handleExportBackup = async () => {
    await exportGsocBackup();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importGsocBackup(text);
      if (res.success) {
        setImportStatus('Success: GSoC records restored.');
        await loadAll();
      } else {
        setImportStatus(`Error: ${res.error}`);
      }
    } catch {
      setImportStatus('Failed to read backup file.');
    }

    setTimeout(() => setImportStatus(null), 4000);
  };

  const handleConfirmReset = async () => {
    setResetting(true);
    await resetGsocOnly();
    setResetting(false);
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-12 text-slate-900">
      {/* 1. Header & Composite Score */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-700/40 relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Trophy size={13} className="text-amber-400" />
            <span>Readiness Scorecard</span>
          </span>

          <span className="text-xs font-bold text-slate-400">
            Kavya Shaw • Class of 2028
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              GSoC 2027 Preparation Index
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-medium leading-relaxed">
              Real-time weighted score evaluated across completed syllabus days, merged community PRs, study hours, and proposal maturity.
            </p>
          </div>

          <div className="text-center sm:text-right shrink-0 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-3xl sm:text-4xl font-black text-teal-400 block tracking-tight">
              {overallPercentage}%
            </span>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Preparation Readiness
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-2 relative z-10">
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Days Completed</span>
            <CheckCircle2 size={15} className="text-teal-600" />
          </div>
          <span className="text-xl font-black text-slate-900 block">
            {metrics.completedDays}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block">
            of {metrics.totalDays} target days
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Hours Studied</span>
            <Clock size={15} className="text-blue-600" />
          </div>
          <span className="text-xl font-black text-slate-900 block">
            {totalStudyHours}h
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block">
            {sessions.length} tracked sessions
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Active Streak</span>
            <Flame size={15} className="text-amber-500" />
          </div>
          <span className="text-xl font-black text-slate-900 block">
            {metrics.currentStreak} Days
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block">
            Excl. rest days
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Merged PRs</span>
            <GitPullRequest size={15} className="text-emerald-600" />
          </div>
          <span className="text-xl font-black text-slate-900 block">
            {metrics.contributionsCount.merged}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block">
            {contributions.length} total logged
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase">Proposal Draft</span>
            <FileText size={15} className="text-purple-600" />
          </div>
          <span className="text-xl font-black text-slate-900 block">
            {metrics.proposalReadinessScore}%
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block">
            12 sections standard
          </span>
        </div>
      </div>

      {/* 3. Phase Completion Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
          Phase-Wise Syllabus Completion
        </h3>

        <div className="space-y-3">
          {GSOC_PHASES.map((phase) => {
            const allPhaseDays = days.filter(d => d.phaseId === phase.id);
            const completedInPhase = allPhaseDays.filter(d => {
              const prog = progressMap[d.id];
              return prog && prog.completedStepIds.length === d.steps.length && d.steps.length > 0;
            }).length;

            const pct = allPhaseDays.length > 0 
              ? Math.round((completedInPhase / allPhaseDays.length) * 100) 
              : 0;

            return (
              <div key={phase.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="space-x-1.5 truncate pr-2">
                    <span className="font-bold text-slate-900">
                      Phase {phase.phaseNumber}: {phase.title}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      ({phase.targetRangeText})
                    </span>
                  </div>
                  <span className="font-black text-slate-700 shrink-0">
                    {completedInPhase}/{allPhaseDays.length} ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${pct === 100 ? 'bg-emerald-500' : 'bg-teal-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Official GSoC 2027 Program Timeline Notice */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Calendar size={14} />
            <span>Official Google Open Source Milestones</span>
          </span>

          <a
            href="https://summerofcode.withgoogle.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-teal-600 hover:underline flex items-center space-x-1"
          >
            <span>Verify on summerofcode.withgoogle.com</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
          GSoC 2027 Official Calendar Status
        </h3>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed font-medium space-y-1">
          <p>
            <strong>Official 2027 Program Dates:</strong> Google Open Source officially releases the annual GSoC calendar between late November and early January. No placeholder countdowns are displayed until verified.
          </p>
          <p className="text-[11px] text-slate-500">
            Historical cadence: Mentoring organizations announced late February; contributor proposals open mid-March and close early April; accepted contributors announced early May.
          </p>
        </div>

        {/* Milestones List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {officialEvents.map((evt) => (
            <div key={evt.id} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block capitalize">
                  {evt.id.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-400">
                  {evt.estimateLabel || 'Awaiting Google announcement'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600 uppercase">
                {evt.status === 'unannounced' ? 'Pending' : 'Confirmed'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Isolated Data Management & Safety */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            GSoC Hub Backup & Database Isolation
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            This hub maintains strict database isolation in IndexedDB (<code className="text-teal-700 bg-slate-100 px-1 py-0.5 rounded">kavya_studyos_gsoc_2027_v1</code>). Your AI/ML roadmap data, Masai coursework, and general notes are kept in a separate database and are never modified or reset here.
          </p>
        </div>

        {importStatus && (
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800 animate-in fade-in">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleExportBackup}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Download size={14} />
            <span>Export GSoC Backup (.json)</span>
          </button>

          <label className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer border border-slate-200">
            <Upload size={14} />
            <span>Restore GSoC Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors ml-auto"
          >
            <RotateCcw size={14} />
            <span>Reset GSoC Progress Only</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-rose-200 space-y-4 text-slate-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2 text-rose-600">
              <ShieldAlert size={22} />
              <h3 className="text-base font-black">
                Reset GSoC Hub Progress Only?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will erase your GSoC task checkboxes, proposal drafts, and contribution logs in <code className="font-mono text-slate-800">kavya_studyos_gsoc_2027_v1</code>.
            </p>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
              ✓ <strong>Safety Guaranteed:</strong> Your 90-Day AI/ML roadmap database, Masai notes, and main settings will remain 100% untouched and intact.
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                disabled={resetting}
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={resetting}
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset GSoC Hub'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
