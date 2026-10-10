import React, { useState } from 'react';
import { 
  MapPin, 
  Banknote, 
  GraduationCap, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { InternshipOpening } from '../../data/internships';
import { useInternshipStore, ApplicationStatus } from '../../stores/useInternshipStore';

interface InternshipCardProps {
  internship: InternshipOpening;
}

const COMPANY_GRADIENTS: Record<string, string> = {
  MS: 'from-blue-600 to-indigo-600',
  GO: 'from-red-500 via-amber-500 to-blue-500',
  NV: 'from-emerald-600 to-green-700',
  AM: 'from-amber-500 to-orange-600',
  RZ: 'from-blue-500 to-cyan-600',
  SW: 'from-orange-500 to-red-500',
  FA: 'from-purple-600 to-indigo-700',
  SA: 'from-pink-600 to-rose-700',
  UN: 'from-blue-600 to-teal-600',
  HF: 'from-amber-400 to-yellow-600',
};

export const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const { 
    getStatus, 
    setStatus, 
    getRecord, 
    setNotes 
  } = useInternshipStore();

  const currentStatus = getStatus(internship.id);
  const currentRecord = getRecord(internship.id);
  
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteInput, setNoteInput] = useState(currentRecord?.notes || '');
  const [isSavedNoteToast, setIsSavedNoteToast] = useState(false);

  const gradientClass = COMPANY_GRADIENTS[internship.companyLogoText] || 'from-blue-600 to-indigo-600';

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (currentStatus === newStatus) {
      setStatus(internship.id, 'none');
    } else {
      setStatus(internship.id, newStatus);
    }
  };

  const handleSaveNotes = () => {
    setNotes(internship.id, noteInput);
    setIsSavedNoteToast(true);
    setTimeout(() => setIsSavedNoteToast(false), 2000);
  };

  const isApplied = currentStatus === 'applied' || currentStatus === 'interviewing' || currentStatus === 'offered';
  const isSaved = currentStatus === 'saved';
  const isInterview = currentStatus === 'interviewing';

  return (
    <div className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 bg-white shadow-xs hover:shadow-md flex flex-col justify-between space-y-3.5 ${
      isApplied 
        ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/20' 
        : isInterview
        ? 'border-purple-300 ring-1 ring-purple-200 bg-purple-50/20'
        : isSaved
        ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/10'
        : 'border-slate-200 hover:border-blue-200'
    }`}>
      {/* Top Row: Company Logo, Name, Platform, Featured Badge */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs tracking-wider`}>
              {internship.companyLogoText}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800">{internship.company}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {internship.sourcePlatform}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-black text-slate-900 mt-0.5 leading-snug">
                {internship.title}
              </h3>
            </div>
          </div>

          {internship.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
              Top Pick
            </span>
          )}
        </div>

        {/* Badges: Work Mode, Location, Stipend, Batch */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-medium text-slate-600">
          <span className={`px-2 py-0.5 rounded-lg flex items-center space-x-1 ${
            internship.workMode === 'Remote' 
              ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            <MapPin size={11} />
            <span>{internship.workMode} • {internship.location}</span>
          </span>

          <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center space-x-1">
            <Banknote size={11} />
            <span>{internship.stipend}</span>
          </span>

          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 flex items-center space-x-1">
            <GraduationCap size={11} />
            <span>{internship.batch}</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
          {internship.description}
        </p>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1 pt-1">
          {internship.skills.map((skill) => (
            <span 
              key={skill} 
              className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-700 text-[10px] font-bold border border-slate-200/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Area: Deadlines, Notes, Actions */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center space-x-1">
            <Calendar size={12} className="text-slate-400" />
            <span>Posted: {internship.postedDate}</span>
          </span>
          <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 text-[10px]">
            {internship.deadline}
          </span>
        </div>

        {/* Status Tracker & Apply Action */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Status Pills */}
          <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl">
            {/* Bookmark Button */}
            <button
              type="button"
              onClick={() => handleStatusChange('saved')}
              aria-label="Bookmark internship"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                isSaved 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Mark Applied Button */}
            <button
              type="button"
              onClick={() => handleStatusChange('applied')}
              aria-label="Mark as applied"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                isApplied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <CheckCircle2 size={13} />
              <span>{isApplied ? 'Applied' : 'Mark Applied'}</span>
            </button>

            {/* Interview Button */}
            <button
              type="button"
              onClick={() => handleStatusChange('interviewing')}
              aria-label="Mark as interviewing"
              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                isInterview
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Sparkles size={12} />
              <span className="hidden sm:inline">Interview</span>
            </button>
          </div>

          {/* External Apply Link */}
          <a
            href={internship.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5 shrink-0"
          >
            <span>Apply Now</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Application Note Accordion */}
        <div>
          <button
            type="button"
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center space-x-1 transition-colors"
          >
            <FileText size={11} />
            <span>{currentRecord?.notes ? 'Edit Application Note' : 'Add Note (Resume version, date, referral)'}</span>
            {isNotesOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          {isNotesOpen && (
            <div className="mt-2 space-y-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="e.g., Applied via LinkedIn with Resume v2, referred by senior"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {isSavedNoteToast ? 'Saved!' : 'Saved locally in your StudyOS'}
                </span>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
