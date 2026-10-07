import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  Youtube,
  ExternalLink,
  FileText,
  Save,
  Search
} from 'lucide-react';
import { StudyDay, StudyTask } from '../../types';
import { getDb, updateDayNotes, updateDayChecklist } from '../../services/db';
import { getTodayDateString, ROADMAP_START, ROADMAP_END } from '../../engines';
import { DAYS, RoadmapDay } from '../../data/roadmap';
import { useTaskStore } from '../../stores/useTaskStore';
import { useProgressStore } from '../../stores/useProgressStore';

interface DayPlanViewProps {
  currentDate?: string;
  selectedDate?: string;
  currentDay?: StudyDay | null;
  tasks?: StudyTask[];
  onDateChange?: (newDate: string) => void;
  onSelectDate?: (newDate: string) => void;
  onStartTimer?: (task: any) => void;
  onOpenTaskDetails?: (task: any) => void;
  onOpenReschedule?: (task: any) => void;
  onToggleTask?: (taskId: string) => void;
}

export const DayPlanView: React.FC<DayPlanViewProps> = ({
  currentDate,
  selectedDate,
  onDateChange,
  onSelectDate
}) => {
  const activeDate = selectedDate || currentDate || getTodayDateString();
  const handleDateShift = onSelectDate || onDateChange || (() => {});

  const { toggleDayComplete } = useTaskStore();
  const { refreshProgress } = useProgressStore();

  const [dayRecord, setDayRecord] = useState<StudyDay | null>(null);
  const [dayNotes, setDayNotes] = useState<string>('');
  const [isSavedNotes, setIsSavedNotes] = useState<boolean>(false);

  const roadmapItem: RoadmapDay | undefined = DAYS.find(d => d.date === activeDate);

  useEffect(() => {
    async function loadDay() {
      try {
        const db = await getDb();
        const dRec: StudyDay | undefined = await db.getFromIndex('study_days', 'by_date', activeDate);
        if (dRec) {
          setDayRecord(dRec);
          setDayNotes(dRec.notes || '');
        } else if (roadmapItem) {
          // Fallback to static roadmap item
          setDayRecord({
            id: `day-${roadmapItem.date}`,
            date: roadmapItem.date,
            dayNumber: roadmapItem.day,
            weekNumber: 1,
            phaseId: roadmapItem.phaseId,
            phaseName: roadmapItem.phaseName,
            topics: roadmapItem.topics,
            isBuildDay: roadmapItem.isBuildDay,
            englishLink: roadmapItem.englishLink,
            hindiLink: roadmapItem.hindiLink,
            timeSplit: roadmapItem.timeSplit,
            practiceTask: roadmapItem.practiceTask,
            doneWhen: roadmapItem.doneWhen,
            hours: roadmapItem.hours,
            isHoliday: roadmapItem.isHoliday,
            holidayName: roadmapItem.holidayName,
            plannedMinutes: Math.round(roadmapItem.hours * 60),
            isProtectedRestDay: roadmapItem.isHoliday,
            isCompleted: false,
            checklist: {
              topicsCovered: false,
              practiceTaskDone: false,
              doneWhenSatisfied: false
            }
          });
          setDayNotes('');
        }
      } catch (err) {
        console.error('Failed to load day plan:', err);
      }
    }
    loadDay();
  }, [activeDate, roadmapItem]);

  const parsedDate = new Date(`${activeDate}T00:00:00Z`);
  const formattedDate = parsedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isHoliday = Boolean(dayRecord?.isHoliday || roadmapItem?.isHoliday);
  const isCompleted = Boolean(dayRecord?.isCompleted);

  const handlePrev = () => {
    const d = new Date(`${activeDate}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    const s = d.toISOString().split('T')[0];
    if (s >= ROADMAP_START) handleDateShift(s);
  };

  const handleNext = () => {
    const d = new Date(`${activeDate}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    const s = d.toISOString().split('T')[0];
    if (s <= ROADMAP_END) handleDateShift(s);
  };

  const handleToggleChecklist = async (key: 'topicsCovered' | 'practiceTaskDone' | 'doneWhenSatisfied') => {
    if (!dayRecord) return;
    const currentVal = dayRecord.checklist?.[key] || false;
    const newVal = !currentVal;
    
    await updateDayChecklist(activeDate, key, newVal);
    setDayRecord(prev => {
      if (!prev) return null;
      return {
        ...prev,
        checklist: {
          topicsCovered: prev.checklist?.topicsCovered || false,
          practiceTaskDone: prev.checklist?.practiceTaskDone || false,
          doneWhenSatisfied: prev.checklist?.doneWhenSatisfied || false,
          [key]: newVal
        }
      };
    });
  };

  const handleSaveNotes = async () => {
    await updateDayNotes(activeDate, dayNotes);
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  const handleToggleDayComplete = async () => {
    const newStatus = await toggleDayComplete(activeDate);
    setDayRecord(prev => prev ? { ...prev, isCompleted: newStatus } : null);
    await refreshProgress(activeDate);
  };

  return (
    <div className="space-y-3.5 animate-in fade-in pb-12 text-slate-100">
      {/* Date Navigation Strip */}
      <div className="flex items-center justify-between bg-[#121e26] border border-slate-800 p-3.5 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous day"
          disabled={activeDate <= ROADMAP_START}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-wider text-blue-400">
            {isHoliday 
              ? 'Festival Rest' 
              : dayRecord?.dayNumber ? `Day ${dayRecord.dayNumber} of 90` : 'Curriculum Day'}
          </div>
          <h2 className="text-sm font-black text-white mt-0.5">{formattedDate}</h2>
          <div className="flex items-center justify-center space-x-1.5 mt-1">
            {isHoliday ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-800">
                ✨ {dayRecord?.holidayName || roadmapItem?.holidayName || 'Festival Break'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950/60 text-blue-300 border border-blue-800">
                Phase {dayRecord?.phaseId || roadmapItem?.phaseId}: {dayRecord?.phaseName || roadmapItem?.phaseName}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next day"
          disabled={activeDate >= ROADMAP_END}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30 active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Holiday Alert */}
      {isHoliday ? (
        <div className="bg-[#1a1c17] border border-amber-500/40 rounded-2xl p-4 text-amber-300 space-y-2 shadow-sm">
          <div className="flex items-center space-x-2 font-black text-xs text-amber-400">
            <Sparkles size={16} />
            <span>{dayRecord?.holidayName || 'Protected Festival Break'}</span>
          </div>
          <p className="text-xs text-amber-200/90 font-medium leading-relaxed">
            Zero study tasks scheduled for today. Spend quality time celebrating with family. Your study streak remains fully protected.
          </p>
        </div>
      ) : (
        <>
          {/* Day Curriculum & Video Links */}
          <div className="bg-[#121e26] border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                Topics Scheduled
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {dayRecord?.topics.join(' • ') || roadmapItem?.topics.join(' • ')}
              </h3>
            </div>

            {/* Links section */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Learning Resources
              </div>

              {roadmapItem?.englishLink ? (
                <a
                  href={roadmapItem.englishLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-700/60 text-red-200 font-bold text-xs flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Youtube size={16} className="text-red-400" />
                    <span>Watch English Lecture</span>
                  </div>
                  <ExternalLink size={13} className="text-red-400" />
                </a>
              ) : (
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `${dayRecord?.topics[0] || 'AI Engineering'} tutorial full course english`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Search size={14} className="text-slate-400" />
                    <span>English Lecture: Search on YouTube</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400" />
                </a>
              )}

              {roadmapItem?.hindiLink ? (
                <a
                  href={roadmapItem.hindiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/50 border border-orange-700/60 text-orange-200 font-bold text-xs flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Youtube size={16} className="text-orange-400" />
                    <span>Watch Hindi Lecture</span>
                  </div>
                  <ExternalLink size={13} className="text-orange-400" />
                </a>
              ) : (
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `${dayRecord?.topics[0] || 'AI Engineering'} tutorial hindi`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Search size={14} className="text-slate-400" />
                    <span>Hindi Lecture: Search on YouTube</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Interactive Daily Checklist */}
          <div className="bg-[#121e26] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-cyan-400" />
              <span>Day Completion Checklist</span>
            </h3>

            <div className="space-y-2">
              {/* Check 1: Topics covered */}
              <div 
                onClick={() => handleToggleChecklist('topicsCovered')}
                className="flex items-start space-x-3 p-2.5 rounded-xl bg-[#17252f] border border-slate-700/60 cursor-pointer hover:border-cyan-500/60 transition-colors"
              >
                <div className="mt-0.5 text-cyan-400">
                  {dayRecord?.checklist?.topicsCovered ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Understand Core Theory</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Watched concepts on {dayRecord?.topics.join(' • ')}
                  </div>
                </div>
              </div>

              {/* Check 2: Practice task */}
              <div 
                onClick={() => handleToggleChecklist('practiceTaskDone')}
                className="flex items-start space-x-3 p-2.5 rounded-xl bg-[#17252f] border border-slate-700/60 cursor-pointer hover:border-cyan-500/60 transition-colors"
              >
                <div className="mt-0.5 text-cyan-400">
                  {dayRecord?.checklist?.practiceTaskDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Hands-on Practice Task</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {dayRecord?.practiceTask || roadmapItem?.practiceTask}
                  </div>
                </div>
              </div>

              {/* Check 3: Definition of done */}
              <div 
                onClick={() => handleToggleChecklist('doneWhenSatisfied')}
                className="flex items-start space-x-3 p-2.5 rounded-xl bg-[#17252f] border border-slate-700/60 cursor-pointer hover:border-cyan-500/60 transition-colors"
              >
                <div className="mt-0.5 text-cyan-400">
                  {dayRecord?.checklist?.doneWhenSatisfied ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Exit Criteria / Proof</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {dayRecord?.doneWhen || roadmapItem?.doneWhen}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Field */}
          <div className="bg-[#121e26] border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <FileText size={14} className="text-indigo-400" />
                <span>Day Study Notes & Takeaways</span>
              </h3>
              {isSavedNotes && (
                <span className="text-[10px] text-emerald-400 font-bold">Saved!</span>
              )}
            </div>

            <textarea
              value={dayNotes}
              onChange={(e) => setDayNotes(e.target.value)}
              placeholder="Record takeaways, formulas, bug fixes, or links for this day..."
              rows={3}
              className="w-full bg-[#17252f] border border-slate-700/60 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />

            <button
              type="button"
              onClick={handleSaveNotes}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Save size={13} />
              <span>Save Notes</span>
            </button>
          </div>

          {/* Big "Mark Day Complete" Button */}
          <button
            type="button"
            onClick={handleToggleDayComplete}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-transform active:scale-98 shadow-xl ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={18} />
                <span>Day {dayRecord?.dayNumber || roadmapItem?.day} Completed (Tap to Undo)</span>
              </>
            ) : (
              <>
                <Circle size={18} />
                <span>Mark Day {dayRecord?.dayNumber || roadmapItem?.day} Complete</span>
              </>
            )}
          </button>
        </>
      )}

      {/* Schedule Anchor Blocks */}
      <div className="bg-[#121e26] border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-sm text-slate-300">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Daily Routine Anchor Blocks
        </h3>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#17252f] border border-slate-800">
            <div className="flex items-center space-x-2">
              <Dumbbell size={15} className="text-orange-400 shrink-0" />
              <span className="font-bold text-white">Morning Fitness Block</span>
            </div>
            <span className="text-xs font-bold text-slate-400">06:30 – 07:45</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#17252f] border border-slate-800">
            <div className="flex items-center space-x-2">
              <GraduationCap size={15} className="text-blue-400 shrink-0" />
              <span className="font-bold text-white">Curriculum Deep Focus</span>
            </div>
            <span className="text-xs font-bold text-slate-400">5.5 Hours Target</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#17252f] border border-slate-800">
            <div className="flex items-center space-x-2">
              <Briefcase size={15} className="text-purple-400 shrink-0" />
              <span className="font-bold text-white">Teaching Commitment</span>
            </div>
            <span className="text-xs font-bold text-slate-400">16:30 – 18:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
