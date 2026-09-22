import React from 'react';
import { GraduationCap, Clock, Check } from 'lucide-react';
import { useProfileStore } from '../../stores/useProfileStore';

const DAYS_MAP = [
  { id: 1, label: 'Mon', full: 'Monday' },
  { id: 2, label: 'Tue', full: 'Tuesday' },
  { id: 3, label: 'Wed', full: 'Wednesday' },
  { id: 4, label: 'Thu', full: 'Thursday' },
  { id: 5, label: 'Fri', full: 'Friday' },
  { id: 6, label: 'Sat', full: 'Saturday' },
  { id: 0, label: 'Sun', full: 'Sunday' }
];

export const CollegeScheduleConfig: React.FC = () => {
  const { profile, updateCollegeWeekdays } = useProfileStore();
  const selectedDays = profile.collegeWeekdays || [1, 3, 5];

  const handleToggleDay = (dayId: number) => {
    let next: number[];
    if (selectedDays.includes(dayId)) {
      // Don't allow deselecting everything
      if (selectedDays.length <= 1) return;
      next = selectedDays.filter(d => d !== dayId);
    } else {
      next = [...selectedDays, dayId].sort((a, b) => a - b);
    }
    updateCollegeWeekdays(next);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <GraduationCap size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">College Attendance</h3>
            <p className="text-[11px] text-slate-700">Days with in-person campus lectures</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {selectedDays.length} Days/Week
        </span>
      </div>

      {/* Day Selector Matrix */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS_MAP.map(day => {
          const isSelected = selectedDays.includes(day.id);
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => handleToggleDay(day.id)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-900'
              }`}
            >
              <span>{day.label}</span>
              {isSelected && <Check size={12} className="mt-1 text-indigo-600 stroke-[3]" />}
            </button>
          );
        })}
      </div>

      {/* Target Velocity Explainer */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3 text-xs">
        <Clock size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-slate-800 font-medium leading-relaxed">
            <strong className="text-indigo-900 font-bold">College Days (Selected):</strong> Planned study velocity is capped at <strong>3.5 hours</strong>.
          </p>
          <p className="text-slate-800 leading-relaxed">
            <strong className="text-teal-900 font-bold">Non-College Days:</strong> Maximum focused velocity targets <strong>6.0 hours</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
