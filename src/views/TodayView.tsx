import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Youtube, 
  ExternalLink, 
  Clock, 
  Calendar, 
  ChevronRight, 
  AlertCircle, 
  PartyPopper, 
  Compass, 
  Globe, 
  Search,
  BookOpen
} from 'lucide-react';
import { useTaskStore } from '../stores/useTaskStore';
import { useProgressStore } from '../stores/useProgressStore';
import { AppHeader } from '../components/layout/AppHeader';
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
import { StudyDay } from '../types';

interface TodayViewProps {
  onOpenTimerModal?: (task?: any) => void;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
  onNavigateToRoadmap?: () => void;
}

export type LinkLanguagePreference = 'both' | 'english' | 'hindi';

export const TodayView: React.FC<TodayViewProps> = ({
  onOpenTimerModal: _onOpenTimerModal,
  onOpenSettings,
  onOpenNotifications,
  onNavigateToRoadmap: _onNavigateToRoadmap
}) => {
  const { 
    currentDate, 
    currentDay, 
    loadDate, 
    toggleDayComplete
  } = useTaskStore();


  const { metrics, refreshProgress } = useProgressStore();

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
    if (newStr >= ROADMAP_START_DATE && newStr <= ROADMAP_END_DATE) {
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

  // State checks
  const isBeforeStart = activeDate < ROADMAP_START_DATE;
  const isAfterEnd = activeDate > ROADMAP_END_DATE;
  const isHoliday = Boolean(roadmapDayInfo?.isHoliday);
  const isCompleted = Boolean(currentDay?.isCompleted);

  // Countdown days before start
  const daysUntilStart = Math.ceil(
    (new Date(`${ROADMAP_START_DATE}T00:00:00Z`).getTime() - new Date(`${todayRealDate}T00:00:00Z`).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-[#0b141a] text-slate-100 flex flex-col font-sans select-none pb-28">
      {/* Top Header */}
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

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* Catch-Up Banner (if user is behind) */}
        {missedDaysCount > 0 && !isBeforeStart && (
          <div className="bg-amber-950/40 border border-amber-600/40 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-amber-200">
            <div className="flex items-start space-x-2.5">
              <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-300">
                  You are {missedDaysCount} {missedDaysCount === 1 ? 'day' : 'days'} behind schedule
                </p>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Anti-guilt guarantee: take it one step at a time.
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
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] rounded-xl shrink-0 transition-transform active:scale-95"
              >
                Review Missed
              </button>
            )}
          </div>
        )}

        {/* State 1: Before Start Date (e.g. Oct 7, 2026) */}
        {isBeforeStart ? (
          <div className="bg-[#121e26] border border-cyan-800/40 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass size={28} />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                Kickoff Imminent
              </span>
              <h2 className="text-2xl font-black text-white pt-2">
                Starts in {daysUntilStart > 0 ? `${daysUntilStart} Day${daysUntilStart > 1 ? 's' : ''}` : 'Less than 24 hours'}
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1 leading-relaxed">
                90-day AI Engineer roadmap starts tomorrow, <strong className="text-slate-200">October 8, 2026</strong>.
              </p>
            </div>

            {/* Tomorrow Preview Card */}
            <div className="p-4 rounded-2xl bg-[#17252f] border border-slate-700/60 text-left space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 uppercase">
                <span>Tomorrow • Day 1</span>
                <span>5.5 Hours</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Software Engineering Foundation
              </h3>
              <p className="text-xs text-slate-300">
                Python Essentials, Memory Layout & Virtual Environments
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                loadDate(ROADMAP_START_DATE);
                refreshProgress(ROADMAP_START_DATE);
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-transform active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>Preview Day 1 Curriculum</span>
              <ChevronRight size={15} />
            </button>
          </div>
        ) : isAfterEnd ? (
          /* State 2: Course Complete */
          <div className="bg-[#121e26] border border-emerald-500/40 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PartyPopper size={32} />
            </div>
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                Mission Accomplished
              </span>
              <h2 className="text-2xl font-black text-white pt-2">Course Complete!</h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                You have finished all 90 study days of the AI Engineer curriculum. Ready for production AI engineering!
              </p>
            </div>
          </div>
        ) : isHoliday ? (
          /* State 3: Festive Holiday Break */
          <div className="bg-[#191d17] border border-amber-500/40 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2.5 text-amber-400">
              <Sparkles size={22} />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                  Protected Rest Holiday
                </span>
                <h2 className="text-base font-black text-amber-200">
                  {roadmapDayInfo?.holidayName || 'Holiday Break'}
                </h2>
              </div>
            </div>

            <p className="text-xs text-amber-100/90 leading-relaxed bg-amber-950/40 p-3.5 rounded-2xl border border-amber-800/40">
              No rest-of-plan change. Your streak is completely protected and zero study tasks are scheduled for today. Celebrate and recharge with family!
            </p>

            {nextStudyDay && (
              <div className="p-3.5 rounded-2xl bg-[#121e26] border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Next Study Day
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    Day {nextStudyDay.day} • {nextStudyDay.date}
                  </div>
                  <div className="text-[11px] text-slate-300 truncate max-w-[220px]">
                    {nextStudyDay.topics.join(' • ')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    loadDate(nextStudyDay.date);
                    refreshProgress(nextStudyDay.date);
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl"
                  title="View next study day"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* State 4: Normal Study Day */
          <div className="space-y-4">
            {/* Primary Study Day Card */}
            <div className={`rounded-3xl border p-5 space-y-4 transition-all shadow-xl ${
              isCompleted 
                ? 'bg-[#10221c] border-emerald-500/40' 
                : 'bg-[#121e26] border-slate-800'
            }`}>
              {/* Phase & Day Banner */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wide bg-blue-950 text-blue-300 border border-blue-800/60">
                    Phase {roadmapDayInfo?.phaseId || 1}: {roadmapDayInfo?.phaseName}
                  </span>
                  {roadmapDayInfo?.isBuildDay && (
                    <span className="px-2 py-0.5 rounded-xl text-[10px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                      🛠️ Build Day
                    </span>
                  )}
                </div>
                <span className="text-xs font-black text-cyan-400">
                  Day {roadmapDayInfo?.day} of 90
                </span>
              </div>

              {/* Main Topics */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Today's Curriculum Focus
                </div>
                <h2 className="text-base font-black text-white leading-snug">
                  {roadmapDayInfo?.topics.join(' • ')}
                </h2>
              </div>

              {/* Time Split & Hours Badge */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-[#17252f] border border-slate-700/60 flex items-center space-x-2">
                  <Clock size={15} className="text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Pacing</div>
                    <div className="text-[11px] font-semibold text-slate-200">
                      {roadmapDayInfo?.timeSplit}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#17252f] border border-slate-700/60 flex items-center space-x-2">
                  <Calendar size={15} className="text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Target Time</div>
                    <div className="text-[11px] font-semibold text-slate-200">
                      {roadmapDayInfo?.hours || 5.5}h Focus Session
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice Task */}
              <div className="p-3.5 rounded-2xl bg-[#17252f] border border-slate-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300">
                  <BookOpen size={14} />
                  <span>Hands-on Practice Task</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {roadmapDayInfo?.practiceTask}
                </p>
              </div>

              {/* Done When Criteria */}
              <div className="p-3.5 rounded-2xl bg-[#17252f] border border-slate-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Definition of Done</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {roadmapDayInfo?.doneWhen}
                </p>
              </div>

              {/* Language Selector Strip */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center space-x-1">
                  <Globe size={13} className="text-cyan-400" />
                  <span>Lecture Language</span>
                </span>
                <div className="flex items-center space-x-1 bg-[#17252f] p-1 rounded-xl border border-slate-700/60">
                  {(['both', 'english', 'hindi'] as LinkLanguagePreference[]).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-colors ${
                        languagePref === lang
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Lecture Tap Buttons */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {/* English Video Button */}
                {(languagePref === 'both' || languagePref === 'english') && (
                  <div>
                    {roadmapDayInfo?.englishLink ? (
                      <a
                        href={roadmapDayInfo.englishLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-2xl bg-red-950/40 hover:bg-red-900/50 border border-red-700/60 text-red-200 font-bold text-xs flex items-center justify-between transition-transform active:scale-98"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Youtube size={18} className="text-red-400" />
                          <span>Watch English Lecture / Playlist</span>
                        </div>
                        <ExternalLink size={14} className="text-red-400" />
                      </a>
                    ) : (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          `${roadmapDayInfo?.topics[0] || 'AI Engineering'} tutorial full course english`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Search size={14} className="text-slate-400" />
                          <span>English Lecture: Search on YouTube</span>
                        </div>
                        <ExternalLink size={13} className="text-slate-400" />
                      </a>
                    )}
                  </div>
                )}

                {/* Hindi Video Button */}
                {(languagePref === 'both' || languagePref === 'hindi') && (
                  <div>
                    {roadmapDayInfo?.hindiLink ? (
                      <a
                        href={roadmapDayInfo.hindiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-2xl bg-orange-950/40 hover:bg-orange-900/50 border border-orange-700/60 text-orange-200 font-bold text-xs flex items-center justify-between transition-transform active:scale-98"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Youtube size={18} className="text-orange-400" />
                          <span>Watch Hindi Lecture / Playlist</span>
                        </div>
                        <ExternalLink size={14} className="text-orange-400" />
                      </a>
                    ) : (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          `${roadmapDayInfo?.topics[0] || 'AI Engineering'} tutorial hindi`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Search size={14} className="text-slate-400" />
                          <span>Hindi Lecture: Search on YouTube</span>
                        </div>
                        <ExternalLink size={13} className="text-slate-400" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Big "Mark Day Complete" Button */}
              <button
                type="button"
                onClick={handleToggleComplete}
                className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-transform active:scale-98 shadow-xl ${
                  isCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Day {roadmapDayInfo?.day} Completed (Tap to Undo)</span>
                  </>
                ) : (
                  <>
                    <Circle size={18} />
                    <span>Mark Day {roadmapDayInfo?.day} as Complete</span>
                  </>
                )}
              </button>
            </div>

            {/* Tomorrow Preview Card */}
            {nextDayInfo && (
              <div className="p-4 rounded-3xl bg-[#121e26] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Tomorrow: Preview</span>
                  {nextDayInfo.isHoliday ? (
                    <span className="text-amber-400">✨ Festival Break</span>
                  ) : (
                    <span className="text-cyan-400">Day {nextDayInfo.day}</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white">
                  {nextDayInfo.isHoliday
                    ? nextDayInfo.holidayName
                    : nextDayInfo.topics.join(' • ')}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {nextDayInfo.practiceTask}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Daily Reflection Notes Section */}
        <section className="pt-1">
          <ReflectionDrawer currentDateStr={activeDate} />
        </section>
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
