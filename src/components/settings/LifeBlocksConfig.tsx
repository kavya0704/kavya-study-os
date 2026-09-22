import React, { useState } from 'react';
import { BookOpen, Dumbbell, Sparkles, ShieldCheck } from 'lucide-react';
import { useProfileStore } from '../../stores/useProfileStore';

export const LifeBlocksConfig: React.FC = () => {
  const { profile, updateTeachingBlock, updateGymBlock } = useProfileStore();

  const [teachingStart, setTeachingStart] = useState(profile.teachingBlock?.startTime || '16:30');
  const [teachingEnd, setTeachingEnd] = useState(profile.teachingBlock?.endTime || '18:00');
  const [teachingEnabled, setTeachingEnabled] = useState(profile.teachingBlock?.enabled ?? true);

  const [gymStart, setGymStart] = useState(profile.gymBlock?.startTime || '06:30');
  const [gymEnd, setGymEnd] = useState(profile.gymBlock?.endTime || '07:45');
  const [gymEnabled, setGymEnabled] = useState(profile.gymBlock?.enabled ?? true);

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveBlocks = () => {
    updateTeachingBlock(teachingStart, teachingEnd, teachingEnabled);
    updateGymBlock(gymStart, gymEnd, gymEnabled);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Daily Life Anchors</h3>
          <p className="text-[11px] text-slate-700">Non-negotiable teaching, gym & rest routines</p>
        </div>
        {isSaved && (
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-700">
            <ShieldCheck size={13} className="mr-1" /> Saved!
          </span>
        )}
      </div>

      {/* Teaching Block */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <BookOpen size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Teaching Commitment</h4>
              <p className="text-[10px] text-slate-700 font-medium">1.5h afternoon teaching block</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={teachingEnabled}
              onChange={e => setTeachingEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {teachingEnabled && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                value={teachingStart}
                onChange={e => setTeachingStart(e.target.value)}
                style={{ fontSize: '16px' }}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-purple-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                value={teachingEnd}
                onChange={e => setTeachingEnd(e.target.value)}
                style={{ fontSize: '16px' }}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-purple-500 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Gym Block */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <Dumbbell size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Morning Gym & Fitness</h4>
              <p className="text-[10px] text-slate-700 font-medium">Energy & health replenishment</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={gymEnabled}
              onChange={e => setGymEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        {gymEnabled && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                value={gymStart}
                onChange={e => setGymStart(e.target.value)}
                style={{ fontSize: '16px' }}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                value={gymEnd}
                onChange={e => setGymEnd(e.target.value)}
                style={{ fontSize: '16px' }}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button for Life Blocks */}
      <button
        type="button"
        onClick={handleSaveBlocks}
        className="w-full py-2.5 bg-slate-900 hover:bg-black active:scale-98 text-white border border-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm"
      >
        Update Routine Blocks
      </button>

      {/* Protected Festival Invariant Card */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-xs">
        <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-amber-950">Durga Puja Festival Invariant</span>
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[9px] font-bold">
              17–21 Oct 2026
            </span>
          </div>
          <p className="text-slate-800 leading-relaxed text-[11px]">
            Fully protected cultural celebration. StudyOS enforces <strong>zero study tasks</strong>, protects your streak from breaking, and automatically prohibits automatic task rescheduling onto these dates.
          </p>
        </div>
      </div>
    </div>
  );
};
