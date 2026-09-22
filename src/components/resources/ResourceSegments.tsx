import React from 'react';
import { 
  Video, 
  FileText, 
  Code2, 
  Briefcase, 
  Bookmark, 
  Layers 
} from 'lucide-react';

export type ResourceSegmentType = 'all' | 'video' | 'documentation' | 'practice' | 'career' | 'saved';

interface ResourceSegmentsProps {
  selectedSegment: ResourceSegmentType;
  onSelectSegment: (segment: ResourceSegmentType) => void;
  counts: {
    all: number;
    video: number;
    documentation: number;
    practice: number;
    career: number;
    saved: number;
  };
}

export const ResourceSegments: React.FC<ResourceSegmentsProps> = ({
  selectedSegment,
  onSelectSegment,
  counts
}) => {
  const segments = [
    { id: 'all' as ResourceSegmentType, label: 'All', icon: Layers, count: counts.all },
    { id: 'video' as ResourceSegmentType, label: 'Videos', icon: Video, count: counts.video },
    { id: 'documentation' as ResourceSegmentType, label: 'Docs', icon: FileText, count: counts.documentation },
    { id: 'practice' as ResourceSegmentType, label: 'Practice', icon: Code2, count: counts.practice },
    { id: 'career' as ResourceSegmentType, label: 'Jobs', icon: Briefcase, count: counts.career },
    { id: 'saved' as ResourceSegmentType, label: 'Saved', icon: Bookmark, count: counts.saved }
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
      {segments.map((seg) => {
        const Icon = seg.icon;
        const isActive = selectedSegment === seg.id;

        return (
          <button
            key={seg.id}
            type="button"
            onClick={() => onSelectSegment(seg.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs font-black'
                : 'bg-white border border-slate-200 text-slate-800 hover:text-black hover:bg-slate-50'
            }`}
          >
            <Icon size={13} className={isActive ? 'text-white' : 'text-slate-600'} />
            <span>{seg.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-900'
            }`}>
              {seg.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
