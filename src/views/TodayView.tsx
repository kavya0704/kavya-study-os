import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Youtube, 
  ExternalLink, 
  ChevronRight, 
  AlertCircle, 
  PartyPopper, 
  Compass, 
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Briefcase
} from 'lucide-react';
import { useTaskStore } from '../stores/useTaskStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useTimerStore } from '../stores/useTimerStore';
import { AppHeader } from '../components/layout/AppHeader';
import { ProgressRing } from '../components/common/ProgressRing';
import { NextActionHero } from '../components/task/NextActionHero';
import { Toast } from '../components/common/Toast';
import { ReflectionDrawer } from '../components/notes/ReflectionDrawer';
import { NotesSearchModal } from '../components/notes/NotesSearchModal';
import { AIDiagnosticModal } from '../components/ai/AIDiagnosticModal';
import { 
  DAYS, 
  ROADMAP_START_DATE, 
  ROADMAP_END_DATE, 
  TOTAL_STUDY_DAYS,
  RoadmapDay 
} from '../data/roadmap';
import { getLocalCalendarDate } from '../engines/dateUtils';
import { getDb } from '../services/db';
import { StudyDay, StudyTask } from '../types';

interface TodayViewProps {
  onOpenTimerModal?: (task?: StudyTask) => void;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
  onNavigateToRoadmap?: () => void;
  onOpenInternships?: () => void;
}

export type LinkLanguagePreference = 'both' | 'english' | 'hindi';

export const TodayView: React.FC<TodayViewProps> = ({
  onOpenTimerModal,
  onOpenSettings,
  onOpenNotifications,
  onOpenInternships
}) => {
  const { 
    currentDate, 
    currentDay, 
    tasks,
    loadDate, 
    toggleDayComplete
  } = useTaskStore();

  const { metrics, refreshProgress } = useProgressStore();
  const { startTimer } = useTimerStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIDiagnosticOpen, setIsAIDiagnosticOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Language preference: 'both' | 'english' | 'hindi'
  const [languagePref, setLanguagePref] = useState<LinkLanguagePreference>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('studyos_lang_pref');
      if (saved === 'english' || saved === 'hindi' || saved === 'both') {
        return saved;
      }
    }
    return 'both';
  });

  const handleLanguageChange = (pref: LinkLanguagePreference) => {
    setLanguagePref(pref);
    if (typeof window !== 'undefined') {
      localStorage.setItem('studyos_lang_pref', pref);
    }
  };

  const todayRealDate = getLocalCalendarDate();
  const activeDate = currentDate || todayRealDate;

  // Find roadmap day metadata from single source of truth
  const roadmapDayInfo: RoadmapDay | undefined = DAYS.find(d => d.date === activeDate);
  const nextDayInfo: RoadmapDay | undefined = DAYS.find(d => {
    const nextDate = new Date(`${activeDate}T00:00:00Z`);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const nextDateStr = nextDate.toISOString().split('T')[0];
    return d.date === nextDateStr;
  });

  // Calculate next study day for holidays
  const nextStudyDay: RoadmapDay | undefined = DAYS.find(d => !d.isHoliday && d.date > activeDate);

  // Calculate missed days for catch-up banner
  const [missedDaysCount, setMissedDaysCount] = useState<number>(0);
  const [earliestMissedDate, setEarliestMissedDate] = useState<string | null>(null);

  useEffect(() => {
    async function calculateCatchUp() {
      if (todayRealDate < ROADMAP_START_DATE) {
        setMissedDaysCount(0);
        return;
      }
      try {
        const db = await getDb();
        const allDays: StudyDay[] = await db.getAll('study_days');
        const pastStudyDays = allDays
          .filter(d => !d.isHoliday && d.dayNumber !== null && d.date < todayRealDate)
          .sort((a, b) => a.date.localeCompare(b.date));

        const missed = pastStudyDays.filter(d => !d.isCompleted);
        setMissedDaysCount(missed.length);
        if (missed.length > 0) {
          setEarliestMissedDate(missed[0].date);
        } else {
          setEarliestMissedDate(null);
        }
      } catch (err) {
        console.warn('Failed to calculate catch-up:', err);
      }
    }
    calculateCatchUp();
  }, [todayRealDate, currentDate, metrics.completedStudyDaysCount]);

  // Date navigation handlers
  const handleDateShift = (offsetDays: number) => {
    const cur = new Date(`${activeDate}T00:00:00Z`);
    cur.setUTCDate(cur.getUTCDate() + offsetDays);
    const newStr = cur.toISOString().split('T')[0];
    const minDate = todayRealDate < ROADMAP_START_DATE ? todayRealDate : ROADMAP_START_DATE;
    if (newStr >= minDate && newStr <= ROADMAP_END_DATE) {
      loadDate(newStr);
      refreshProgress(newStr);
    }
  };

  const handleGoToday = () => {
    loadDate(todayRealDate);
    refreshProgress(todayRealDate);
  };

  const handleToggleComplete = async () => {
    const newStatus = await toggleDayComplete(activeDate);
    await refreshProgress(activeDate);
    if (newStatus) {
      setToastMessage(`Day ${roadmapDayInfo?.day || ''} completed! Keep the momentum.`);
    } else {
      setToastMessage('Day marked as pending.');
    }
  };

  const handleStartTimer = (taskToStart: StudyTask) => {
    startTimer(taskToStart.id, taskToStart.title);
    if (onOpenTimerModal) {
      onOpenTimerModal(taskToStart);
    }
  };

  // State checks
  const isBeforeStart = activeDate < ROADMAP_START_DATE;
  const isAfterEnd = activeDate > ROADMAP_END_DATE;
  const isHoliday = Boolean(roadmapDayInfo?.isHoliday);
  const isCompleted = Boolean(currentDay?.isCompleted);

  // Countdown days before start
  const daysUntilStart = Math.ceil(
    (new Date(`${ROADMAP_START_DATE}T00:00:00Z`).getTime() - new Date(`${todayRealDate}T00:00:00Z`).getTime()) / (1000 * 60 * 60 * 24)
  );

  const completedTasksCount = isCompleted ? 1 : 0;
  const totalTasksCount = isHoliday ? 0 : 1;
  const plannedMinutes = isHoliday ? 0 : 330;

  // Active primary task representing today's study focus
  const currentTask: StudyTask | undefined = tasks[0] || (roadmapDayInfo ? {
    id: `task-${activeDate}`,
    studyDayId: `day-${activeDate}`,
    order: 1,
    title: roadmapDayInfo.topics.join(' • '),
    topic: roadmapDayInfo.topics[0] || 'AI Engineering Study',
    description: roadmapDayInfo.practiceTask,
    definitionOfDone: roadmapDayInfo.doneWhen,
    category: roadmapDayInfo.isBuildDay ? 'project' : 'python_practice',
    isRequired: true,
    plannedMinutes: 330,
    actualMinutes: 0,
    status: isCompleted ? 'completed' : 'pending',
    resourceIds: [],
    originalDate: activeDate,
    currentDate: activeDate,
    createdAt: '2026-10-21T00:00:00Z',
    updatedAt: '2026-10-21T00:00:00Z'
  } : undefined);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans select-none pb-28">
      {/* Top Header (Clean Light Theme) */}
      <AppHeader
        currentDay={currentDay}
        currentDateStr={activeDate}
        onPrevDay={() => handleDateShift(-1)}
        onNextDay={() => handleDateShift(1)}
        onToday={handleGoToday}
        streakCount={metrics.currentStreak}
        backlogProgress={{
          completed: metrics.completedStudyDaysCount,
          total: TOTAL_STUDY_DAYS
        }}
        focusedMinutesToday={metrics.focusedMinutesToday}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAIDiagnostic={() => setIsAIDiagnosticOpen(true)}
        onOpenSettings={onOpenSettings}
        onOpenNotifications={onOpenNotifications}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        {/* Catch-Up Banner (if user is behind) */}
        {missedDaysCount > 0 && !isBeforeStart && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start space-x-2.5">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-950">
                  You are {missedDaysCount} {missedDaysCount === 1 ? 'day' : 'days'} behind schedule
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Anti-guilt guarantee: take it one step at a time. Your streak is safe.
                </p>
              </div>
            </div>
            {earliestMissedDate && (
              <button
                type="button"
                onClick={() => {
                  loadDate(earliestMissedDate);
                  refreshProgress(earliestMissedDate);
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-xl shrink-0 transition-transform active:scale-95 shadow-xs"
              >
                Review Missed
              </button>
            )}
          </div>
        )}

        {/* State 1: Before Start Date */}
        {isBeforeStart ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Compass size={28} />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Kickoff Imminent
              </span>
              <h2 className="text-2xl font-black text-slate-900 pt-2">
                Starts in {daysUntilStart > 0 ? `${daysUntilStart} Day${daysUntilStart > 1 ? 's' : ''}` : 'Less than 24 hours'}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-1 leading-relaxed">
                90-day AI Engineer roadmap officially starts on <strong className="text-slate-900">October 21, 2026</strong>.
              </p>
            </div>

            {/* Kickoff Day 1 Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 uppercase">
                <span>Kickoff • Day 1 (Oct 21)</span>
                <span>5.5 Hours Target</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Software Engineering Foundation
              </h3>
              <p className="text-xs text-slate-600">
                Python Essentials, Memory Layout & Virtual Environments
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                loadDate(ROADMAP_START_DATE);
                refreshProgress(ROADMAP_START_DATE);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-transform active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>Preview Day 1 Curriculum</span>
              <ChevronRight size={15} />
            </button>

            {/* Weekly Internship Radar Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white text-left space-y-2.5 shadow-sm border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-300 uppercase">
                <span className="flex items-center space-x-1.5">
                  <Briefcase size={13} className="text-blue-400" />
                  <span>Weekly Internship Radar</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px]">
                  10 Fresh Openings
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  10 Active AI & Software Roles Open This Week
                </h4>
                <p className="text-xs text-slate-300 pt-0.5">
                  Microsoft, Google, NVIDIA, Swiggy, Razorpay & more. Pre-apply now before kickoff.
                </p>
              </div>
              {onOpenInternships && (
                <button
                  type="button"
                  onClick={onOpenInternships}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 active:scale-98"
                >
                  <span>View 10 Weekly Internships</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        ) : isAfterEnd ? (
          /* State 2: Course Complete */
          <div className="bg-white border border-emerald-200 rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <PartyPopper size={32} />
            </div>
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Mission Accomplished
              </span>
              <h2 className="text-2xl font-black text-slate-900 pt-2">Course Complete!</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                You have finished all 90 study days of the AI Engineer curriculum. Ready for production AI engineering!
              </p>
            </div>
          </div>
        ) : isHoliday ? (
          /* State 3: Festive Holiday Break */
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs max-w-2xl mx-auto">
            <div className="flex items-center space-x-2.5 text-amber-900">
              <Sparkles size={24} className="text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                  Protected Rest Holiday
                </span>
                <h2 className="text-lg font-black text-amber-950">
                  {roadmapDayInfo?.holidayName || 'Holiday Break'}
                </h2>
              </div>
            </div>

            <p className="text-xs text-amber-900 font-medium leading-relaxed bg-white/70 p-4 rounded-2xl border border-amber-200">
              No rest-of-plan change. Your streak is completely protected and zero study tasks are scheduled for today. Celebrate and recharge with family!
            </p>

            {nextStudyDay && (
              <div className="p-4 rounded-2xl bg-white border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase">
                    Next Study Day
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Day {nextStudyDay.day} • {nextStudyDay.date}
                  </div>
                  <div className="text-[11px] text-slate-600 truncate max-w-[280px]">
                    {nextStudyDay.topics.join(' • ')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    loadDate(nextStudyDay.date);
                    refreshProgress(nextStudyDay.date);
                  }}
                  className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition-colors"
                  title="View next study day"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <div className="pt-2">
              <ReflectionDrawer currentDateStr={activeDate} />
            </div>
          </div>
        ) : (
          /* State 4: Normal Study Day (Laptop Responsive 2-Column Grid) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 Cols on Laptop): Progress, Next Up Hero & Tomorrow Preview */}
            <div className="lg:col-span-5 space-y-6">
              {/* 1. Today's Progress Card */}
              <ProgressRing
                completedTasks={completedTasksCount}
                totalTasks={totalTasksCount}
                focusedMinutes={metrics.focusedMinutesToday}
                plannedMinutes={plannedMinutes}
                isRestDay={isHoliday}
              />

              {/* 2. Next Up Hero Card */}
              <NextActionHero
                task={currentTask}
                onStartTimer={handleStartTimer}
                onToggleComplete={() => handleToggleComplete()}
                isRestDay={isHoliday}
              />

              {/* Tomorrow Preview Card */}
              {nextDayInfo && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                    <span>Tomorrow Preview</span>
                    {nextDayInfo.isHoliday ? (
                      <span className="text-amber-600 font-bold">✨ Festival Break</span>
                    ) : (
                      <span className="text-blue-600 font-bold">Day {nextDayInfo.day}</span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {nextDayInfo.isHoliday
                      ? nextDayInfo.holidayName
                      : nextDayInfo.topics.join(' • ')}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {nextDayInfo.practiceTask}
                  </p>
                </div>
              )}

              {/* Weekly Internship Radar Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-2 border border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-300 uppercase">
                  <span className="flex items-center space-x-1.5">
                    <Briefcase size={12} className="text-blue-400" />
                    <span>Internship Radar</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px]">
                    10 Open
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Fresh AI/ML Openings • Week of Oct 10–17
                  </h4>
                  <p className="text-[11px] text-slate-300 pt-0.5">
                    Microsoft, Google, NVIDIA, Razorpay & more.
                  </p>
                </div>
                {onOpenInternships && (
                  <button
                    type="button"
                    onClick={onOpenInternships}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Browse 10 Internships</span>
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column (7 Cols on Laptop): Daily Focus Curriculum & Reflections */}
            <div className="lg:col-span-7 space-y-6">
              {/* 3. Daily Focus Curriculum Card */}
              <section className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Daily focus
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    Day {roadmapDayInfo?.day} of 90 • 5.5h
                  </span>
                </div>

                {/* Curriculum Breakdown Box */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                  {/* Topic and Phase header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        Phase {roadmapDayInfo?.phaseId}: {roadmapDayInfo?.phaseName}
                      </span>
                      {roadmapDayInfo?.isBuildDay && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                          🛠️ Build Project
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                      {roadmapDayInfo?.topics.join(' • ')}
                    </h3>
                  </div>

                  {/* Pacing & Target Split */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center space-x-1.5 text-blue-600 font-bold text-[10px] uppercase">
                        <Clock size={13} />
                        <span>Time Split</span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-800 mt-1">
                        {roadmapDayInfo?.timeSplit}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center space-x-1.5 text-indigo-600 font-bold text-[10px] uppercase">
                        <Layers size={13} />
                        <span>Focus Target</span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-800 mt-1">
                        {roadmapDayInfo?.hours || 5.5}h Deep Work
                      </div>
                    </div>
                  </div>

                  {/* Practice Task */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-700">
                      <BookOpen size={14} />
                      <span>Hands-on Practice Task</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {roadmapDayInfo?.practiceTask}
                    </p>
                  </div>

                  {/* Done When Criteria */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={14} />
                      <span>Definition of Done</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {roadmapDayInfo?.doneWhen}
                    </p>
                  </div>

                  {/* Video Resources with Language Preference */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Video Lecture Links
                      </span>
                      <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        {(['both', 'english', 'hindi'] as LinkLanguagePreference[]).map(lang => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleLanguageChange(lang)}
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold capitalize transition-colors ${
                              languagePref === lang
                                ? 'bg-white text-blue-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* English Link Button */}
                    {(languagePref === 'both' || languagePref === 'english') && (
                      <div>
                        {roadmapDayInfo?.englishLink ? (
                          <a
                            href={roadmapDayInfo.englishLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                          >
                            <div className="flex items-center space-x-2">
                              <Youtube size={16} className="text-red-600" />
                              <span>English Lecture / Playlist</span>
                            </div>
                            <ExternalLink size={13} className="text-red-500" />
                          </a>
                        ) : (
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                              `${roadmapDayInfo?.topics[0] || 'AI Engineering'} tutorial full course english`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <Search size={14} className="text-slate-500" />
                              <span>English Lecture: Search on YouTube</span>
                            </div>
                            <ExternalLink size={13} className="text-slate-400" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Hindi Link Button */}
                    {(languagePref === 'both' || languagePref === 'hindi') && (
                      <div>
                        {roadmapDayInfo?.hindiLink ? (
                          <a
                            href={roadmapDayInfo.hindiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                          >
                            <div className="flex items-center space-x-2">
                              <Youtube size={16} className="text-orange-600" />
                              <span>Hindi Lecture / Playlist</span>
                            </div>
                            <ExternalLink size={13} className="text-orange-500" />
                          </a>
                        ) : (
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                              `${roadmapDayInfo?.topics[0] || 'AI Engineering'} tutorial hindi`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <Search size={14} className="text-slate-500" />
                              <span>Hindi Lecture: Search on YouTube</span>
                            </div>
                            <ExternalLink size={13} className="text-slate-400" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Daily Reflection Drawer in Right Column on Laptop */}
              <section className="pt-1">
                <ReflectionDrawer currentDateStr={activeDate} />
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <NotesSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AIDiagnosticModal
        isOpen={isAIDiagnosticOpen}
        onClose={() => setIsAIDiagnosticOpen(false)}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
