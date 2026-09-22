import React from 'react';
import { 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { StudyDay } from '../../types';

interface AppHeaderProps {
  currentDay: StudyDay | null;
  currentDateStr: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  streakCount: number;
  backlogProgress: { completed: number; total: number };
  focusedMinutesToday: number;
  onOpenSearch?: () => void;
  onOpenAIDiagnostic?: () => void;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentDay,
  currentDateStr,
  onPrevDay,
  onNextDay,
  onToday,
  streakCount: _streakCount,
  backlogProgress: _backlogProgress,
  focusedMinutesToday: _focusedMinutesToday,
  onOpenSearch: _onOpenSearch,
  onOpenAIDiagnostic: _onOpenAIDiagnostic,
  onOpenSettings,
  onOpenNotifications
}) => {
  // Format human readable date
  const parsedDate = new Date(`${currentDateStr}T00:00:00`);
  const formattedDate = parsedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const getDayTypeBadgeText = () => {
    if (!currentDay) return 'Study Day • 6h';
    if (currentDay.isProtectedRestDay) {
      return (
        <span className="inline-flex items-center">
          <Sparkles size={11} className="mr-1 text-amber-500" /> Puja Rest Break
        </span>
      );
    }
    if (currentDay.dayType === 'college') {
      return (
        <span className="inline-flex items-center">
          <GraduationCap size={12} className="mr-1 text-blue-500" /> College Day • 3.5h
        </span>
      );
    }
    return 'Non-College Day • 6h';
  };

  const dayNumber = currentDay?.dayNumber || 1;

  return (
    <header className="bg-white/80 backdrop-blur-md pt-5 pb-3 px-5 transition-colors">
      <div className="max-w-md mx-auto">
        {/* Top Micro Bar: StudyOS + Offline Badge | Bell, Settings */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              StudyOS
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Offline</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-slate-700">
            <button
              type="button"
              onClick={onOpenNotifications || onToday}
              aria-label="Notifications & Reminders"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors active:scale-95"
            >
              <Bell size={20} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Settings"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors active:scale-95"
            >
              <Settings size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Day Header & Date */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2.5">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Day {dayNumber}
              </h1>
              <span className="text-base font-normal text-slate-500">
                {formattedDate}
              </span>
            </div>

            <div className="mt-1.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {getDayTypeBadgeText()}
              </span>
            </div>
          </div>

          {/* Quick Date Navigation Arrows */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={onPrevDay}
              aria-label="Previous day"
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={onToday}
              className="px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:text-blue-600 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={onNextDay}
              aria-label="Next day"
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
