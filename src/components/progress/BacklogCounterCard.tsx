import React, { useState, useEffect } from 'react';
import { Video, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getDb } from '../../services/db';
import { StudyTask } from '../../types';

interface BacklogCounterCardProps {
  onOpenVideoDetails?: (videoNumber: number) => void;
}

export const BacklogCounterCard: React.FC<BacklogCounterCardProps> = ({
  onOpenVideoDetails
}) => {
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function calculateBacklog() {
      setLoading(true);
      const db = await getDb();
      const allTasks: StudyTask[] = await db.getAll('study_tasks');

      const completedSet = new Set<number>();
      for (const t of allTasks) {
        if (t.category === 'masai_backlog' && t.status === 'completed' && t.backlogVideoNumber) {
          completedSet.add(t.backlogVideoNumber);
        }
      }

      setCompletedVideos(completedSet);
      setLoading(false);
    }

    calculateBacklog();
  }, []);

  const completedCount = completedVideos.size;
  const totalCount = 25;
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3.5">
      {/* Top Header & Metric */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Video size={18} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              Masai Backlog Recovery
            </span>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              25-Video Sprint
            </h3>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-black text-slate-900 font-mono">
            {completedCount} <span className="text-slate-400 text-xs">/ 25</span>
          </div>
          <span className="text-xs font-bold text-blue-600">
            {percent}% Cleared
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(2, percent)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-0.5">
          <span>Sprint: 28 Sep – 27 Oct</span>
          <span>{totalCount - completedCount} videos remaining</span>
        </div>
      </div>

      {/* Sprint Invariant Callout */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
        <div className="flex items-center space-x-1.5 font-black text-amber-900 text-xs">
          <ShieldCheck size={14} className="text-amber-600" />
          <span>Strict Anti-Cramming Invariant</span>
        </div>
        <p className="text-xs text-amber-900 font-medium leading-relaxed">
          Strictly 1 backlog video per day. Each video enforces 6 mandatory verification steps (active viewing, blank-editor replication, 3–5 recall questions, variation, doubt log, and Git proof).
        </p>
      </div>

      {/* 25-Pill Interactive Matrix */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-900 block px-0.5">
          All 25 Backlog Modules Status:
        </span>

        {loading ? (
          <div className="py-4 text-center text-xs text-slate-400 animate-pulse">
            Checking backlog items...
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => {
              const isCleared = completedVideos.has(num);
              const isNext = !isCleared && num === completedCount + 1;

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onOpenVideoDetails && onOpenVideoDetails(num)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                    isCleared
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : isNext
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-black leading-none">#{num}</span>
                  <div className="mt-1">
                    {isCleared ? (
                      <CheckCircle2 size={12} className="text-blue-600" />
                    ) : (
                      <span className="text-[9px] text-slate-500 font-medium">Pending</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
