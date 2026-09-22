import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCcw, 
  RotateCcw,
  X 
} from 'lucide-react';
import { 
  exportStudyOsBackup, 
  validateBackupJson, 
  restoreStudyOsBackup, 
  resetDatabaseToDefaults, 
  ValidationResult 
} from '../../services/export/jsonExporter';
import { exportStudyNotesMarkdown } from '../../services/export/markdownExporter';
import { useTaskStore } from '../../stores/useTaskStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { useProfileStore } from '../../stores/useProfileStore';

export const BackupRestoreCard: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { loadDate, currentDate } = useTaskStore();
  const { refreshProgress } = useProgressStore();
  const { reloadProfile } = useProfileStore();

  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isExportingMd, setIsExportingMd] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Restore State
  const [pendingValidation, setPendingValidation] = useState<ValidationResult | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreFeedback, setRestoreFeedback] = useState<string | null>(null);

  // Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmationText, setResetConfirmationText] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Handle JSON Export
  const handleExportJson = async () => {
    setIsExportingJson(true);
    setExportFeedback(null);
    try {
      const backup = await exportStudyOsBackup();
      setExportFeedback(`Exported ${backup.stats.tasksCount} tasks, ${backup.stats.notesCount} notes to JSON.`);
      setTimeout(() => setExportFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      setExportFeedback(`Export error: ${msg}`);
    } finally {
      setIsExportingJson(false);
    }
  };

  // Handle Markdown Notes Export
  const handleExportMarkdown = async () => {
    setIsExportingMd(true);
    setExportFeedback(null);
    try {
      const res = await exportStudyNotesMarkdown();
      setExportFeedback(`Exported ${res.notesCount} study notes to clean Markdown archive.`);
      setTimeout(() => setExportFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Markdown export failed';
      setExportFeedback(`Markdown export error: ${msg}`);
    } finally {
      setIsExportingMd(false);
    }
  };

  // Handle File Selected for Restore
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validation = validateBackupJson(content);
      setPendingValidation(validation);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Execute Restore
  const handleConfirmRestore = async () => {
    if (!pendingValidation?.backupData) return;
    setIsRestoring(true);
    try {
      const result = await restoreStudyOsBackup(pendingValidation.backupData);
      setPendingValidation(null);
      setRestoreFeedback(`Restored ${result.restoredCounts.tasks} tasks & ${result.restoredCounts.days} roadmap days!`);
      
      // Reload active stores
      await reloadProfile();
      await loadDate(currentDate || '2026-09-22');
      await refreshProgress(currentDate || '2026-09-22');
      setTimeout(() => setRestoreFeedback(null), 4500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Restore failed';
      setRestoreFeedback(`Restore failed: ${msg}`);
    } finally {
      setIsRestoring(false);
    }
  };

  // Execute Factory Reset
  const handleConfirmReset = async () => {
    if (resetConfirmationText !== 'RESET') return;
    setIsResetting(true);
    try {
      await resetDatabaseToDefaults();
      setShowResetModal(false);
      setResetConfirmationText('');
      setRestoreFeedback('StudyOS successfully reset to factory seed roadmap.');
      
      // Reload stores
      await reloadProfile();
      await loadDate('2026-09-22');
      await refreshProgress('2026-09-22');
      setTimeout(() => setRestoreFeedback(null), 4500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      setRestoreFeedback(`Reset failed: ${msg}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Database size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Data Backup & Restore</h3>
            <p className="text-[11px] text-slate-700">100% offline ownership & portability</p>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleExportJson}
          disabled={isExportingJson}
          className="p-3 bg-slate-50 hover:bg-slate-100 active:scale-98 border border-slate-200 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <Download size={16} />
            <span className="text-[10px] font-bold text-slate-600 font-mono">.JSON</span>
          </div>
          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
            {isExportingJson ? 'Generating...' : 'Full Backup'}
          </div>
          <div className="text-[10px] text-slate-600 font-medium mt-0.5">All 8 IndexedDB stores</div>
        </button>

        <button
          type="button"
          onClick={handleExportMarkdown}
          disabled={isExportingMd}
          className="p-3 bg-slate-50 hover:bg-slate-100 active:scale-98 border border-slate-200 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center justify-between text-cyan-600 mb-1">
            <FileText size={16} />
            <span className="text-[10px] font-bold text-slate-600 font-mono">.MD</span>
          </div>
          <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
            {isExportingMd ? 'Compiling...' : 'Export Notes'}
          </div>
          <div className="text-[10px] text-slate-600 font-medium mt-0.5">Notes, reflections & logs</div>
        </button>
      </div>

      {/* Feedback Banner */}
      {exportFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-900 font-medium">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* Restore Section */}
      <div className="pt-2 border-t border-slate-100">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-98 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 transition-all flex items-center justify-center space-x-2 shadow-sm"
        >
          <Upload size={14} className="text-blue-600 stroke-[2.5]" />
          <span>Restore from Backup File</span>
        </button>

        {restoreFeedback && (
          <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-900 font-medium">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>{restoreFeedback}</span>
          </div>
        )}
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-red-600 flex items-center">
            <AlertTriangle size={12} className="mr-1 text-red-600" /> Factory Reset
          </h4>
          <p className="text-[10px] text-slate-600 font-medium">Restore clean original 101-day seeds</p>
        </div>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Restore Confirmation Modal */}
      {pendingValidation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Confirm Backup Restore</h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingValidation(null)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            {pendingValidation.valid ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                  <p className="font-bold">Valid StudyOS Backup File</p>
                  <p className="text-[11px] text-slate-800 mt-1">{pendingValidation.summary}</p>
                </div>
                <p className="text-slate-700 font-medium">
                  Restoring will safely update your local IndexedDB tables with the contents of this backup.
                </p>
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPendingValidation(null)}
                    className="flex-1 py-2 bg-slate-100 text-slate-900 border border-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRestore}
                    disabled={isRestoring}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1"
                  >
                    {isRestoring ? (
                      <RefreshCcw size={14} className="animate-spin" />
                    ) : (
                      <span>Restore Data</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900">
                  <p className="font-bold text-red-950">Invalid Backup File</p>
                  <p className="text-[11px] text-red-800 mt-1">{pendingValidation.error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingValidation(null)}
                  className="w-full py-2 bg-slate-100 text-slate-900 border border-slate-300 rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Double-Confirmation Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-700">Reset StudyOS Database</h3>
                <p className="text-[11px] text-red-600 font-medium">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              This will erase all custom study progress, logged timer sessions, notes, and resets the 101-day roadmap back to original factory seeds.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-1.5">
                Type <strong className="text-red-600 font-mono">RESET</strong> to confirm:
              </label>
              <input
                type="text"
                value={resetConfirmationText}
                onChange={e => setResetConfirmationText(e.target.value)}
                placeholder="RESET"
                style={{ fontSize: '16px' }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono font-bold uppercase shadow-sm"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmationText('');
                }}
                className="flex-1 py-2 bg-slate-100 text-slate-900 border border-slate-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={resetConfirmationText !== 'RESET' || isResetting}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-40 flex items-center justify-center space-x-1"
              >
                {isResetting ? (
                  <RotateCcw size={14} className="animate-spin" />
                ) : (
                  <span>Confirm Reset</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
