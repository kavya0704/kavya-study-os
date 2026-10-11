import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  Star, 
  Plus, 
  X, 
  Save, 
  Compass, 
  Sparkles,
  GitBranch,
  MessageSquare
} from 'lucide-react';
import { useGsocStore } from '../../stores/useGsocStore';
import { OrganizationResearch } from '../../types/gsoc';

export const GsocOrgsView: React.FC = () => {
  const { organizations, setMainOrg, updateOrgResearch } = useGsocStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotesOrgId, setEditingNotesOrgId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Add Custom Org form state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgRepo, setNewOrgRepo] = useState('');
  const [newOrgTech, setNewOrgTech] = useState('');
  const [newOrgIdeasUrl, setNewOrgIdeasUrl] = useState('');
  const [newOrgChannel, setNewOrgChannel] = useState('');
  const [newOrgNotes, setNewOrgNotes] = useState('');

  const handleOpenEditNotes = (org: OrganizationResearch) => {
    setEditingNotesOrgId(org.id);
    setTempNotes(org.notes || '');
  };

  const handleSaveNotes = async (org: OrganizationResearch) => {
    await updateOrgResearch({
      ...org,
      notes: tempNotes
    });
    setEditingNotesOrgId(null);
  };

  const handleAddCustomOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || !newOrgRepo.trim()) return;

    const newOrg: OrganizationResearch = {
      id: `custom-org-${Date.now()}`,
      name: newOrgName.trim(),
      umbrella: 'Independent',
      status: 'exploring',
      repoUrl: newOrgRepo.trim(),
      issuesUrl: `${newOrgRepo.trim()}/issues`,
      contributingUrl: `${newOrgRepo.trim()}/blob/main/CONTRIBUTING.md`,
      ideasUrl: newOrgIdeasUrl.trim() || `${newOrgRepo.trim()}/wiki`,
      stack: newOrgTech.split(',').map(s => s.trim()).filter(Boolean),
      historicalRequirements: 'Inspect contributing guidelines and historical GSoC participation.',
      prerequisites: 'Inspect contributor guidelines.',
      channelName: 'Community Chat / Discussions',
      channelUrl: newOrgChannel.trim() || newOrgRepo.trim(),
      codeMapNotes: '',
      notes: newOrgNotes.trim(),
      confirmed2027: false
    };

    await updateOrgResearch(newOrg);
    setShowAddModal(false);
    setNewOrgName('');
    setNewOrgRepo('');
    setNewOrgTech('');
    setNewOrgIdeasUrl('');
    setNewOrgChannel('');
    setNewOrgNotes('');
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-12 text-slate-900">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 flex items-center space-x-1.5">
            <Sparkles size={14} />
            <span>Target Organization Shortlist</span>
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Add Custom Org</span>
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          GSoC 2027 Open Source Organizations
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          DIPY is our primary recommended organization due to welcoming mentors, high Python/Cython fit, active neuroimaging tools, and recurring GSoC slots. You can also explore PyTorch-Ignite, Matplotlib, Holidays, or OpenCV.
        </p>
      </div>

      {/* 2. Organizations Cards List */}
      <div className="space-y-4">
        {organizations.map((org: OrganizationResearch) => {
          const isMain = org.status === 'main';
          const isBackup = org.status === 'backup';

          return (
            <div
              key={org.id}
              className={`bg-white border rounded-3xl p-5 shadow-sm transition-all space-y-4 ${
                isMain ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Building2 size={18} className={isMain ? 'text-teal-600' : 'text-slate-400'} />
                    <h3 className="text-base font-black text-slate-900">
                      {org.name}
                    </h3>

                    {isMain && (
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 flex items-center space-x-1">
                        <Star size={10} className="fill-teal-700" />
                        <span>MAIN TARGET</span>
                      </span>
                    )}

                    {isBackup && (
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        BACKUP TARGET
                      </span>
                    )}

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {org.umbrella}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl">
                    {org.historicalRequirements}
                  </p>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center space-x-2 shrink-0">
                  {!isMain && (
                    <button
                      onClick={() => setMainOrg(org.id)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold text-xs transition-colors flex items-center space-x-1"
                    >
                      <Star size={12} />
                      <span>Make Main</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEditNotes(org)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Notes
                  </button>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Tech Stack & Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {org.stack.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              {org.prerequisites && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <strong className="text-slate-800">Prerequisites:</strong> {org.prerequisites}
                </div>
              )}

              {/* External Links */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <a
                  href={org.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <GitBranch size={13} />
                  <span>GitHub Repository</span>
                  <ExternalLink size={12} />
                </a>

                {org.contributingUrl && (
                  <a
                    href={org.contributingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <span>Contributing Guide</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                {org.ideasUrl && (
                  <a
                    href={org.ideasUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors"
                  >
                    <Compass size={13} />
                    <span>Ideas List</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                {org.channelUrl && (
                  <a
                    href={org.channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition-colors"
                  >
                    <MessageSquare size={13} />
                    <span>{org.channelName || 'Community Chat'}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Personal Notes Display / Editor */}
              {editingNotesOrgId === org.id ? (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Edit Research Notes for {org.name}
                  </span>
                  <textarea
                    rows={3}
                    value={tempNotes}
                    onChange={e => setTempNotes(e.target.value)}
                    placeholder="Potential submodules, mentor names, issues to target, architecture thoughts..."
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingNotesOrgId(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveNotes(org)}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                    >
                      <Save size={13} />
                      <span>Save Notes</span>
                    </button>
                  </div>
                </div>
              ) : org.notes ? (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/50 p-3 rounded-2xl">
                  <strong className="text-slate-800 block mb-1">Your Research Notes:</strong>
                  <p className="whitespace-pre-wrap">{org.notes}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* 3. Add Custom Org Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-slate-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Add Custom Organization
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomOrg} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={e => setNewOrgName(e.target.value)}
                  placeholder="e.g. Scikit-learn, SymPy, SciPy"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  required
                  value={newOrgRepo}
                  onChange={e => setNewOrgRepo(e.target.value)}
                  placeholder="https://github.com/organization/repo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={newOrgTech}
                  onChange={e => setNewOrgTech(e.target.value)}
                  placeholder="Python, C++, PyTorch, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project Ideas URL
                </label>
                <input
                  type="url"
                  value={newOrgIdeasUrl}
                  onChange={e => setNewOrgIdeasUrl(e.target.value)}
                  placeholder="https://wiki.../GSoC2026/Ideas"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Community Chat / Mailing List URL
                </label>
                <input
                  type="url"
                  value={newOrgChannel}
                  onChange={e => setNewOrgChannel(e.target.value)}
                  placeholder="https://discord.gg/... or https://gitter.im/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newOrgNotes}
                  onChange={e => setNewOrgNotes(e.target.value)}
                  placeholder="Why this org, initial contact notes..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                >
                  Save Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
