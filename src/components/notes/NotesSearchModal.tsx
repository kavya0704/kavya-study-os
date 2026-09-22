import { useState, useEffect } from 'react';
import { Search, X, FileText, AlertTriangle, Compass, Calendar } from 'lucide-react';
import { Note } from '../../types';
import { useNoteStore } from '../../stores/useNoteStore';

interface NotesSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote?: (note: Note) => void;
}

export const NotesSearchModal: React.FC<NotesSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNote
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'error_log' | 'daily_reflection' | 'task_note'>('all');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const { allNotes, loadAllNotes } = useNoteStore();

  useEffect(() => {
    if (isOpen) {
      loadAllNotes();
    }
  }, [isOpen, loadAllNotes]);

  useEffect(() => {
    let list = allNotes;
    if (filterType !== 'all') {
      list = list.filter(n => n.type === filterType);
    }
    if (query.trim()) {
      const lower = query.toLowerCase().trim();
      list = list.filter(n =>
        n.title.toLowerCase().includes(lower) ||
        n.bodyMarkdown.toLowerCase().includes(lower) ||
        n.tags.some(t => t.toLowerCase().includes(lower))
      );
    }
    setFilteredNotes(list);
  }, [query, filterType, allNotes]);

  if (!isOpen) return null;

  const getTypeBadge = (type: Note['type']) => {
    switch (type) {
      case 'error_log':
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            <AlertTriangle size={10} className="mr-1" /> Error Log
          </span>
        );
      case 'daily_reflection':
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <Compass size={10} className="mr-1" /> Reflection
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <FileText size={10} className="mr-1 text-blue-600" /> Study Note
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Search size={16} className="text-blue-600" />
              <span>Global Notes & Error Search</span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts, bugs, tags (#error_log), or dates..."
              style={{ fontSize: '16px' }}
              className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300'
              }`}
            >
              All ({allNotes.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('error_log')}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === 'error_log'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300'
              }`}
            >
              Bugs ({allNotes.filter(n => n.type === 'error_log').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('daily_reflection')}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === 'daily_reflection'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300'
              }`}
            >
              Reflections ({allNotes.filter(n => n.type === 'daily_reflection').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('task_note')}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterType === 'task_note'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300'
              }`}
            >
              Study Notes ({allNotes.filter(n => n.type === 'task_note' || n.type === 'topic_note').length})
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-600 font-medium text-xs">
              No matching notes or diagnostic records found.
            </div>
          ) : (
            filteredNotes.map((note: Note) => {
              const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    if (onSelectNote) onSelectNote(note);
                  }}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer space-y-1.5 group shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    {getTypeBadge(note.type)}
                    <span className="text-[10px] text-slate-600 flex items-center font-medium">
                      <Calendar size={10} className="mr-1" /> {formattedDate}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate">
                    {note.title}
                  </h4>

                  <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed font-medium">
                    {note.bodyMarkdown.replace(/#+\s+/g, '').replace(/```[\s\S]*?```/g, '[Code]').slice(0, 140)}
                  </p>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex items-center space-x-1 pt-0.5">
                      {note.tags.map((t: string) => (
                        <span key={t} className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
