import React from 'react';
import { 
  User, 
  Smartphone, 
  Wifi, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  Moon,
  Timer
} from 'lucide-react';
import { 
  CollegeScheduleConfig, 
  LifeBlocksConfig, 
  AISettingsConfig, 
  BackupRestoreCard 
} from '../components/settings';
import { useProfileStore } from '../stores/useProfileStore';

export const SettingsView: React.FC = () => {
  const { profile, updateDefaultFocusIntervalMinutes } = useProfileStore();

  const handleIntervalChange = (minutes: number) => {
    updateDefaultFocusIntervalMinutes(minutes);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-28 space-y-3.5 animate-in fade-in">
      {/* Profile & OS Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-base">
              KS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  {profile.displayName || 'Kavya Shaw'}
                </h2>
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[9px] font-bold uppercase">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-700 flex items-center mt-0.5 font-medium">
                <Calendar size={11} className="mr-1 text-blue-600" />
                101-Day Machine Learning Sprint
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <ShieldCheck size={11} className="mr-1 text-emerald-600" />
              v1.0.0
            </span>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Target End</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">31 Dec 2026</div>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Masai Backlog</div>
            <div className="text-xs font-bold text-amber-700 mt-0.5">25 Lessons</div>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Timezone</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Asia/Kolkata</div>
          </div>
        </div>
      </div>

      {/* College Schedule Configuration */}
      <CollegeScheduleConfig />

      {/* Daily Life Constraints (Teaching, Gym, Puja) */}
      <LifeBlocksConfig />

      {/* Default Focus Timer Interval */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Timer size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Focus Interval Preset</h3>
              <p className="text-[11px] text-slate-700">Default Pomodoro interval length</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 font-mono">
            {profile.defaultFocusIntervalMinutes || 25} Minutes
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { mins: 25, label: '25m Pomodoro' },
            { mins: 50, label: '50m Deep Work' },
            { mins: 90, label: '90m Ultradian' }
          ].map(preset => {
            const isSelected = (profile.defaultFocusIntervalMinutes || 25) === preset.mins;
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => handleIntervalChange(preset.mins)}
                className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Groq AI Cloud Inference */}
      <AISettingsConfig />

      {/* Full Database Backup & Markdown Export */}
      <BackupRestoreCard />

      {/* iPhone 16 PWA Native Shell & System Specs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Smartphone size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">PWA Mobile Environment</h3>
            <p className="text-[11px] text-slate-700">Web Audio, Vibration & Lock-Screen Reconciler</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 flex items-center font-medium">
              <Wifi size={13} className="mr-1.5 text-emerald-600" /> Offline IndexedDB
            </span>
            <span className="font-bold text-emerald-700">Active (8 Stores)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700 flex items-center font-medium">
              <Moon size={13} className="mr-1.5 text-blue-600" /> Design Theme
            </span>
            <span className="font-bold text-slate-900">StudyOS Light (High Contrast)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700 flex items-center font-medium">
              <Sparkles size={13} className="mr-1.5 text-amber-600" /> Anti-Zoom Rule
            </span>
            <span className="font-bold text-slate-900">16px Minimum Inputs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700 flex items-center font-medium">
              <User size={13} className="mr-1.5 text-slate-600" /> Standalone PWA
            </span>
            <span className="font-bold text-slate-900">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
