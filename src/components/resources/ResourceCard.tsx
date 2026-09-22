import React from 'react';
import { 
  ExternalLink, 
  Star, 
  AlertTriangle, 
  Video, 
  FileText, 
  Code2, 
  Briefcase, 
  Wrench, 
  CheckCircle2 
} from 'lucide-react';
import { Resource } from '../../types';

interface ResourceCardProps {
  resource: Resource;
  onToggleFavorite: (id: string) => void;
  onReportBroken: (resource: Resource) => void;
  onLaunch?: (id: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onToggleFavorite,
  onReportBroken,
  onLaunch
}) => {
  const isVideo = resource.type === 'video';

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'video':
        return <Video size={13} className="text-rose-600" />;
      case 'documentation':
        return <FileText size={13} className="text-blue-600" />;
      case 'practice':
        return <Code2 size={13} className="text-emerald-600" />;
      case 'career':
        return <Briefcase size={13} className="text-purple-600" />;
      default:
        return <Wrench size={13} className="text-slate-600" />;
    }
  };

  const getLanguageBadge = () => {
    switch (resource.language) {
      case 'Hindi':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-50 text-orange-800 border border-orange-200">
            Hindi
          </span>
        );
      case 'Hinglish':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-50 text-amber-800 border border-amber-200">
            Hinglish
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
            English
          </span>
        );
    }
  };

  const handleLinkClick = () => {
    if (onLaunch) {
      onLaunch(resource.id);
    }
  };

  return (
    <div className="p-4 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl space-y-2.5 transition-all shadow-xs group">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 border border-slate-200 text-slate-800">
            {getTypeIcon()}
            <span className="capitalize text-slate-900">{resource.type}</span>
          </span>
          {getLanguageBadge()}
          {resource.isPrimary && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
              Primary
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {/* Flag Broken Link */}
          <button
            type="button"
            onClick={() => onReportBroken(resource)}
            title="Report broken or changed link"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
          >
            <AlertTriangle size={14} />
          </button>

          {/* Star Favorite */}
          <button
            type="button"
            onClick={() => onToggleFavorite(resource.id)}
            title={resource.isFavourite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg transition-colors ${
              resource.isFavourite
                ? 'text-amber-500 bg-amber-50'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
            }`}
          >
            <Star size={15} fill={resource.isFavourite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Title & Provider */}
      <div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-start justify-between gap-1"
        >
          <span className="leading-snug text-sm">{resource.title}</span>
          <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
        </a>
        <div className="flex items-center space-x-2 text-xs text-slate-700 font-bold mt-1">
          <span className="text-slate-900 font-black">{resource.provider}</span>
          <span>•</span>
          <span className="truncate text-slate-600">{resource.topic}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="flex items-center space-x-1 text-slate-700 font-bold">
          <CheckCircle2 size={13} className="text-blue-600" />
          <span>Verified {resource.lastVerifiedDate || '21 Sep 2026'}</span>
        </span>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1"
        >
          <span>{isVideo ? 'Open Video' : 'Open Resource'}</span>
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
};
