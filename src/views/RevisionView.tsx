import React, { useEffect, useState } from 'react';
import { useRevisionStore } from '../stores/useRevisionStore';
import { useTaskStore } from '../stores';
import { SpacedReviewCard } from '../components/task/SpacedReviewCard';
import { Brain, Sparkles, ShieldCheck } from 'lucide-react';

export const RevisionView: React.FC = () => {
  const { items, isLoading, loadRevisionItems, gradeRevisionItem } = useRevisionStore();
  const { currentDate } = useTaskStore();
  const [filter, setFilter] = useState<'all' | 'due' | 'upcoming' | 'completed'>('due');

  useEffect(() => {
    loadRevisionItems();
  }, [loadRevisionItems]);

  const dueItems = items.filter(i => (i.dueDate <= currentDate) && i.status !== 'completed');
  const upcomingItems = items.filter(i => i.dueDate > currentDate && i.status !== 'completed');
  const completedItems = items.filter(i => i.status === 'completed');

  const filteredList = filter === 'due'
    ? dueItems
    : filter === 'upcoming'
    ? upcomingItems
    : filter === 'completed'
    ? completedItems
    : items;

  const totalReviews = items.length;
  const retentionPct = totalReviews > 0
    ? Math.round((completedItems.length / totalReviews) * 100)
    : 100;

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-28 space-y-3.5 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Spaced Active Recall
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles size={10} className="mr-1" /> Ebbinghaus Shield
            </span>
          </div>
          <p className="text-[11px] text-slate-700 mt-0.5 font-medium">
            D+1 (10m) • D+3 (20m) • D+7 (20m) Spaced Retrieval Intervals
          </p>
        </div>
      </div>

      {/* Retention Metrics Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid grid-cols-4 gap-1 text-center">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Due</span>
          <div className="text-lg font-bold text-amber-600 font-mono">
            {dueItems.length}
          </div>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Upcoming</span>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {upcomingItems.length}
          </div>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Mastered</span>
          <div className="text-lg font-bold text-emerald-600 font-mono">
            {completedItems.length}
          </div>
        </div>
        <div className="space-y-0.5 border-l border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Retention</span>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {retentionPct}%
          </div>
        </div>
      </div>

      {/* Durga Puja Protection Notice */}
      <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
        <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-slate-800">
          <strong className="text-amber-950 font-bold">Durga Puja Invariant:</strong> Any reviews mathematically falling on 17–21 Oct 2026 are shifted forward to 22 Oct to protect family rest. Max 2 reviews/day cap applied.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setFilter('due')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'due'
              ? 'bg-white text-slate-900 border border-slate-200 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Due ({dueItems.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('upcoming')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'upcoming'
              ? 'bg-white text-slate-900 border border-slate-200 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming ({upcomingItems.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-white text-slate-900 border border-slate-200 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Done ({completedItems.length})
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {isLoading ? (
          <div className="py-12 text-center text-slate-600 text-xs animate-pulse font-medium">
            Loading spaced retrieval schedule...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-12 text-center bg-white border border-slate-200 rounded-2xl p-6 text-slate-700 space-y-2 shadow-sm">
            <Brain size={32} className="mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">
              {filter === 'due'
                ? 'No Pending Reviews for Today!'
                : filter === 'upcoming'
                ? 'No Upcoming Reviews'
                : 'No Completed Reviews Yet'}
            </h3>
            <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
              Complete eligible tasks (Masai backlog, Python practice, ML theory) on the Today dashboard to generate D+1, D+3, and D+7 review cards.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <SpacedReviewCard
              key={item.id}
              item={item}
              currentDateStr={currentDate}
              onGrade={gradeRevisionItem}
            />
          ))
        )}
      </div>
    </div>
  );
};
