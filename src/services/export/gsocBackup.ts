import { getGsocDb } from '../db/gsocDb';
import { ProposalDraft } from '../../types/gsoc';
import { GSOC_CONFIG } from '../../data/gsoc2027';

export interface GsocBackupEnvelope {
  app: 'Kavya StudyOS';
  trackId: 'gsoc2027';
  schemaVersion: 1;
  curriculumVersion: string;
  exportTimestamp: string;
  data: {
    taskProgress: any[];
    dayOverrides: any[];
    sessions: any[];
    notes: any[];
    organizations: any[];
    contributions: any[];
    proposals: any[];
    proposalVersions: any[];
    settings: any;
  };
}

/**
 * Exports all GSoC 2027 state into a validated JSON envelope.
 */
export async function exportGsocBackup(): Promise<string> {
  const db = await getGsocDb();

  const taskProgress = await db.getAll('task_progress');
  const dayOverrides = await db.getAll('day_overrides');
  const sessions = await db.getAll('sessions');
  const notes = await db.getAll('notes');
  const organizations = await db.getAll('organizations');
  const contributions = await db.getAll('contributions');
  const proposals = await db.getAll('proposals');
  const proposalVersions = await db.getAll('proposal_versions');
  const settings = await db.get('settings', 'main_config');

  const envelope: GsocBackupEnvelope = {
    app: 'Kavya StudyOS',
    trackId: 'gsoc2027',
    schemaVersion: 1,
    curriculumVersion: GSOC_CONFIG.curriculumVersion,
    exportTimestamp: new Date().toISOString(),
    data: {
      taskProgress,
      dayOverrides,
      sessions,
      notes,
      organizations,
      contributions,
      proposals,
      proposalVersions,
      settings
    }
  };

  return JSON.stringify(envelope, null, 2);
}

/**
 * Validates and imports a GSoC 2027 JSON backup envelope.
 */
export async function importGsocBackup(jsonString: string): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = JSON.parse(jsonString) as GsocBackupEnvelope;

    // Validate headers
    if (parsed.app !== 'Kavya StudyOS') {
      return { success: false, error: 'Invalid backup file: not a Kavya StudyOS backup.' };
    }
    if (parsed.trackId !== 'gsoc2027') {
      return { success: false, error: 'Cannot import this file: backup belongs to another track (not GSoC 2027).' };
    }
    if (parsed.schemaVersion !== 1) {
      return { success: false, error: `Unsupported schema version: ${parsed.schemaVersion}` };
    }
    if (!parsed.data || typeof parsed.data !== 'object') {
      return { success: false, error: 'Backup envelope is missing valid data payload.' };
    }

    const db = await getGsocDb();

    // Use atomic transaction across object stores
    const tx = db.transaction([
      'task_progress', 
      'day_overrides', 
      'sessions', 
      'notes', 
      'organizations', 
      'contributions', 
      'proposals', 
      'proposal_versions', 
      'settings'
    ], 'readwrite');

    // 1. Task progress
    if (Array.isArray(parsed.data.taskProgress)) {
      for (const item of parsed.data.taskProgress) {
        if (item && item.dayId) await tx.objectStore('task_progress').put(item);
      }
    }

    // 2. Day overrides
    if (Array.isArray(parsed.data.dayOverrides)) {
      for (const item of parsed.data.dayOverrides) {
        if (item && item.dayId) await tx.objectStore('day_overrides').put(item);
      }
    }

    // 3. Sessions
    if (Array.isArray(parsed.data.sessions)) {
      for (const item of parsed.data.sessions) {
        if (item && item.id) await tx.objectStore('sessions').put(item);
      }
    }

    // 4. Notes
    if (Array.isArray(parsed.data.notes)) {
      for (const item of parsed.data.notes) {
        if (item && item.id) await tx.objectStore('notes').put(item);
      }
    }

    // 5. Organizations
    if (Array.isArray(parsed.data.organizations)) {
      for (const item of parsed.data.organizations) {
        if (item && item.id) await tx.objectStore('organizations').put(item);
      }
    }

    // 6. Contributions
    if (Array.isArray(parsed.data.contributions)) {
      for (const item of parsed.data.contributions) {
        if (item && item.id) await tx.objectStore('contributions').put(item);
      }
    }

    // 7. Proposals
    if (Array.isArray(parsed.data.proposals)) {
      for (const item of parsed.data.proposals) {
        if (item && item.id) await tx.objectStore('proposals').put(item);
      }
    }

    // 8. Proposal Versions
    if (Array.isArray(parsed.data.proposalVersions)) {
      for (const item of parsed.data.proposalVersions) {
        if (item && item.id) await tx.objectStore('proposal_versions').put(item);
      }
    }

    // 9. Settings
    if (parsed.data.settings && typeof parsed.data.settings === 'object') {
      await tx.objectStore('settings').put(parsed.data.settings);
    }

    await tx.done;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to parse or restore backup JSON.' };
  }
}

/**
 * Generates clean formatted Markdown for a proposal draft.
 */
export function exportProposalToMarkdown(draft: ProposalDraft): string {
  return `# ${draft.title || 'GSoC 2027 Project Proposal'}

- **Organization / Umbrella:** ${draft.selectedOrgId || 'Unspecified'}
- **Idea URL:** ${draft.ideaUrl || 'N/A'}
- **Public Communication Channel:** ${draft.contactChannel || 'N/A'}
- **Last Updated:** ${draft.lastAutoSaved || 'N/A'}

---

## 1. Problem & Affected Users
${draft.problemAndUsers || '*Not yet drafted*'}

## 2. Architecture & Codebase Analysis
${draft.architectureAnalysis || '*Not yet drafted*'}

## 3. Proposed Technical Approach & Alternatives
${draft.proposedApproach || '*Not yet drafted*'}

## 4. Deliverables & Scope
### Minimum Viable Product (MVP)
${draft.deliverablesMvp || '*Not yet drafted*'}

### Stretch Goals
${draft.deliverablesStretch || '*Not yet drafted*'}

### Explicit Exclusions
${draft.explicitExclusions || '*Not yet drafted*'}

## 5. Testing & Validation Plan
${draft.testValidationPlan || '*Not yet drafted*'}

## 6. Weekly Deliverables & Milestones
${draft.timelineWeekly || '*Not yet drafted*'}

## 7. Dependencies, Risks & Fallbacks
${draft.dependenciesAndRisks || '*Not yet drafted*'}

## 8. Prior Contributions & Technical Evidence
${draft.pastWorkEvidence || '*Not yet drafted*'}

## 9. Availability, College & Time Commitments
${draft.availabilityAndExams || '*Not yet drafted*'}

## 10. Communication & Community Feedback Log
${draft.communicationPlan || '*Not yet drafted*'}

### Feedback Received
${draft.feedbackLog || '*No feedback logged*'}

## 11. Template Compliance & AI Disclosure
${draft.templateComplianceNotes || '*Template requirements checked.*'}

### AI Assistance Disclosure
${draft.aiDisclosure || 'This proposal was researched and written by the author. AI assistance was used strictly in compliance with the mentoring organization policy.'}
`;
}

/**
 * Initiates client-side file download of the proposal markdown.
 */
export function downloadProposalMarkdown(draft: ProposalDraft, filename = 'gsoc-2027-proposal.md'): void {
  const content = exportProposalToMarkdown(draft);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
