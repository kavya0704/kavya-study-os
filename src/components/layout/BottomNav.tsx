import React from 'react';
import { Home, Calendar, PlayCircle, BookOpen, BarChart2 } from 'lucide-react';

export type NavTab = 'today' | 'plan' | 'timer' | 'resources' | 'progress' | 'roadmap' | 'backlog' | 'revision' | 'coach';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingReviewsCount?: number;
  backlogRemainingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'today' as NavTab, label: 'Today', icon: Home },
    { id: 'plan' as NavTab, label: 'Plan', icon: Calendar },
    { id: 'timer' as NavTab, label: 'Timer', icon: PlayCircle },
    { id: 'resources' as NavTab, label: 'Resources', icon: BookOpen },
    { id: 'progress' as NavTab, label: 'Progress', icon: BarChart2 },
  ];

  // Map legacy tabs to active visual tabs
  const getNormalizedActiveTab = (tab: NavTab): string => {
    if (tab === 'roadmap') return 'plan';
    if (tab === 'backlog') return 'progress';
    return tab;
  };

  const currentNormalized = getNormalizedActiveTab(activeTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentNormalized === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 min-h-[46px] select-none active:scale-95 ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.7}
                className={`transition-transform duration-150 ${isActive ? 'scale-105 text-blue-600' : 'text-slate-400'}`}
              />
              <span className={`text-[10px] mt-1 tracking-tight truncate ${isActive ? 'font-bold text-blue-600' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
