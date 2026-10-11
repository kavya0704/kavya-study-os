import { create } from 'zustand';
import { 
  GsocDay, 
  TaskProgress, 
  OrganizationResearch, 
  ContributionRecord, 
  ProposalDraft, 
  OfficialEvent, 
  OfficialEventKey,
  GsocSettings, 
  GsocSession, 
  GsocProgressMetrics,
  CivilDate 
} from '../types/gsoc';
import { GSOC_DAYS, GSOC_ORGANIZATIONS, GSOC_OFFICIAL_EVENTS } from '../data/gsoc2027';
import { getGsocDb, initGsocDb, resetGsocDbOnly } from '../services/db/gsocDb';
import { kolkataToday, GSOC_START_DATE } from '../engines/gsocDateUtils';
import { calculateGsocMetrics } from '../engines/gsocProgress';

interface GsocStoreState {
  isLoading: boolean;
  activeDayId: string;
  activeDate: CivilDate;
  days: GsocDay[];
  progressMap: Record<string, TaskProgress>;
  dayOverrides: Record<string, CivilDate>;
  organizations: OrganizationResearch[];
  contributions: ContributionRecord[];
  proposals: ProposalDraft[];
  activeProposal: ProposalDraft | null;
  officialEvents: OfficialEvent[];
  settings: GsocSettings;
  sessions: GsocSession[];
  metrics: GsocProgressMetrics;

  // Actions
  loadAll: () => Promise<void>;
  setActiveDayId: (id: string) => void;
  setActiveDate: (date: CivilDate) => void;
  toggleStepComplete: (dayId: string, stepId: string) => Promise<void>;
  markDayComplete: (dayId: string, note?: string) => Promise<boolean>;
  saveDayNotes: (dayId: string, markdown: string) => Promise<void>;
  addEvidenceUrl: (dayId: string, url: string) => Promise<void>;
  setMainOrg: (orgId: string) => Promise<void>;
  updateOrgResearch: (org: OrganizationResearch) => Promise<void>;
  addContribution: (record: Omit<ContributionRecord, 'id' | 'openedDate' | 'updatedDate'>) => Promise<void>;
  updateContribution: (record: ContributionRecord) => Promise<void>;
  saveProposalDraft: (fields: Partial<ProposalDraft>) => Promise<void>;
  recordOfficialEvent: (id: OfficialEventKey, instant: string, sourceUrl: string) => Promise<void>;
  logStudySession: (session: Omit<GsocSession, 'id' | 'trackId'>) => Promise<void>;
  applyCatchUpOverrides: (overrides: Record<string, CivilDate>) => Promise<void>;
  resetGsocOnly: () => Promise<void>;
}

export const useGsocStore = create<GsocStoreState>((set, get) => ({
  isLoading: true,
  activeDayId: GSOC_DAYS[0].id,
  activeDate: kolkataToday(),
  days: GSOC_DAYS,
  progressMap: {},
  dayOverrides: {},
  organizations: GSOC_ORGANIZATIONS,
  contributions: [],
  proposals: [],
  activeProposal: null,
  officialEvents: GSOC_OFFICIAL_EVENTS,
  settings: {
    capacityMinutesWeekday: 90,
    capacityMinutesWeekend: 120,
    collegeWeekdays: [1, 3, 5],
    preferredOrgId: 'dipy',
    backupOrgId: 'ignite',
    startDate: GSOC_START_DATE
  },
  sessions: [],
  metrics: calculateGsocMetrics(GSOC_DAYS, {}, [], []),

  loadAll: async () => {
    set({ isLoading: true });
    try {
      await initGsocDb();
      const db = await getGsocDb();

      // Load progress
      const progressList: TaskProgress[] = await db.getAll('task_progress');
      const progressMap: Record<string, TaskProgress> = {};
      progressList.forEach(p => { progressMap[p.dayId] = p; });

      // Load overrides
      const overrideList: Array<{ dayId: string; newDate: CivilDate }> = await db.getAll('day_overrides');
      const dayOverrides: Record<string, CivilDate> = {};
      overrideList.forEach(o => { dayOverrides[o.dayId] = o.newDate; });

      // Load orgs
      const organizations: OrganizationResearch[] = await db.getAll('organizations');

      // Load contributions
      const contributions: ContributionRecord[] = await db.getAll('contributions');

      // Load proposals
      const proposals: ProposalDraft[] = await db.getAll('proposals');
      let activeProposal = proposals[0] || null;
      if (!activeProposal) {
        // Initialize default draft
        activeProposal = {
          id: 'gsoc-2027-proposal-main',
          title: 'GSoC 2027 Project Proposal Draft',
          selectedOrgId: 'dipy',
          ideaUrl: '',
          contactChannel: '',
          problemAndUsers: '',
          architectureAnalysis: '',
          proposedApproach: '',
          deliverablesMvp: '',
          deliverablesStretch: '',
          explicitExclusions: '',
          testValidationPlan: '',
          timelineWeekly: '',
          dependenciesAndRisks: '',
          pastWorkEvidence: '',
          availabilityAndExams: '',
          communicationPlan: '',
          feedbackLog: '',
          templateComplianceNotes: '',
          aiDisclosure: '',
          lastAutoSaved: new Date().toISOString(),
          isSubmittedToPlatform: false
        };
        await db.put('proposals', activeProposal);
      }

      // Load events
      const officialEvents: OfficialEvent[] = await db.getAll('official_events');

      // Load settings
      const settingsRecord = await db.get('settings', 'main_config');
      const settings: GsocSettings = settingsRecord || get().settings;

      // Load sessions
      const sessions: GsocSession[] = await db.getAll('sessions');

      // Determine active day
      const today = kolkataToday();
      let activeDay = GSOC_DAYS.find(d => {
        const actualDate = dayOverrides[d.id] || d.targetDate;
        return actualDate === today;
      });

      if (!activeDay) {
        // If before start, pick Day 1
        activeDay = GSOC_DAYS[0];
      }

      const metrics = calculateGsocMetrics(
        GSOC_DAYS,
        progressMap,
        sessions,
        contributions,
        activeProposal,
        today
      );

      set({
        isLoading: false,
        activeDayId: activeDay.id,
        activeDate: today,
        progressMap,
        dayOverrides,
        organizations: organizations.length > 0 ? organizations : GSOC_ORGANIZATIONS,
        contributions,
        proposals,
        activeProposal,
        officialEvents: officialEvents.length > 0 ? officialEvents : GSOC_OFFICIAL_EVENTS,
        settings,
        sessions,
        metrics
      });
    } catch (err) {
      console.error('Failed to load GSoC database:', err);
      set({ isLoading: false });
    }
  },

  setActiveDayId: (id: string) => {
    const day = GSOC_DAYS.find(d => d.id === id);
    if (day) {
      const actualDate = get().dayOverrides[id] || day.targetDate;
      set({ activeDayId: id, activeDate: actualDate });
    }
  },

  setActiveDate: (date: CivilDate) => {
    const day = GSOC_DAYS.find(d => {
      const actualDate = get().dayOverrides[d.id] || d.targetDate;
      return actualDate === date;
    });
    set({ activeDate: date, activeDayId: day ? day.id : get().activeDayId });
  },

  toggleStepComplete: async (dayId: string, stepId: string) => {
    const db = await getGsocDb();
    const existing = get().progressMap[dayId] || {
      dayId,
      completedStepIds: [],
      status: 'not_started',
      notesMarkdown: '',
      evidenceUrls: [],
      completedAt: null,
      updatedAt: new Date().toISOString()
    };

    const hasStep = existing.completedStepIds.includes(stepId);
    const updatedStepIds = hasStep
      ? existing.completedStepIds.filter(id => id !== stepId)
      : [...existing.completedStepIds, stepId];

    const dayObj = GSOC_DAYS.find(d => d.id === dayId);
    const totalRequired = dayObj?.steps.filter(s => s.required).length || 0;
    const completedRequired = dayObj?.steps.filter(s => s.required && updatedStepIds.includes(s.id)).length || 0;

    let nextStatus: TaskProgress['status'] = existing.status;
    if (completedRequired >= totalRequired && totalRequired > 0) {
      nextStatus = 'completed';
    } else if (updatedStepIds.length > 0) {
      nextStatus = 'in_progress';
    } else {
      nextStatus = 'not_started';
    }

    const updatedRecord: TaskProgress = {
      ...existing,
      completedStepIds: updatedStepIds,
      status: nextStatus,
      completedAt: nextStatus === 'completed' && !existing.completedAt ? new Date().toISOString() : existing.completedAt,
      updatedAt: new Date().toISOString()
    };

    await db.put('task_progress', updatedRecord);

    const nextMap = { ...get().progressMap, [dayId]: updatedRecord };
    const nextMetrics = calculateGsocMetrics(
      GSOC_DAYS,
      nextMap,
      get().sessions,
      get().contributions,
      get().activeProposal || undefined,
      kolkataToday()
    );

    set({ progressMap: nextMap, metrics: nextMetrics });
  },

  markDayComplete: async (dayId: string, note?: string) => {
    const db = await getGsocDb();
    const dayObj = GSOC_DAYS.find(d => d.id === dayId);
    if (!dayObj) return false;

    const existing = get().progressMap[dayId] || {
      dayId,
      completedStepIds: [],
      status: 'not_started',
      notesMarkdown: '',
      evidenceUrls: [],
      completedAt: null,
      updatedAt: new Date().toISOString()
    };

    const allStepIds = dayObj.steps.map(s => s.id);
    const isCompleted = existing.status !== 'completed';

    const updatedRecord: TaskProgress = {
      ...existing,
      completedStepIds: isCompleted ? allStepIds : [],
      status: isCompleted ? 'completed' : 'not_started',
      notesMarkdown: note ? `${existing.notesMarkdown}\n\n${note}`.trim() : existing.notesMarkdown,
      completedAt: isCompleted ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    await db.put('task_progress', updatedRecord);

    const nextMap = { ...get().progressMap, [dayId]: updatedRecord };
    const nextMetrics = calculateGsocMetrics(
      GSOC_DAYS,
      nextMap,
      get().sessions,
      get().contributions,
      get().activeProposal || undefined,
      kolkataToday()
    );

    set({ progressMap: nextMap, metrics: nextMetrics });
    return isCompleted;
  },

  saveDayNotes: async (dayId: string, markdown: string) => {
    const db = await getGsocDb();
    const existing = get().progressMap[dayId] || {
      dayId,
      completedStepIds: [],
      status: 'not_started',
      notesMarkdown: '',
      evidenceUrls: [],
      completedAt: null,
      updatedAt: new Date().toISOString()
    };

    const updatedRecord: TaskProgress = {
      ...existing,
      notesMarkdown: markdown,
      updatedAt: new Date().toISOString()
    };

    await db.put('task_progress', updatedRecord);
    set({ progressMap: { ...get().progressMap, [dayId]: updatedRecord } });
  },

  addEvidenceUrl: async (dayId: string, url: string) => {
    if (!url.trim()) return;
    const db = await getGsocDb();
    const existing = get().progressMap[dayId] || {
      dayId,
      completedStepIds: [],
      status: 'not_started',
      notesMarkdown: '',
      evidenceUrls: [],
      completedAt: null,
      updatedAt: new Date().toISOString()
    };

    const updatedRecord: TaskProgress = {
      ...existing,
      evidenceUrls: [...existing.evidenceUrls, url.trim()],
      updatedAt: new Date().toISOString()
    };

    await db.put('task_progress', updatedRecord);
    set({ progressMap: { ...get().progressMap, [dayId]: updatedRecord } });
  },

  setMainOrg: async (orgId: string) => {
    const db = await getGsocDb();
    const updatedOrgs = get().organizations.map(o => {
      if (o.id === orgId) return { ...o, status: 'main' as const };
      if (o.status === 'main') return { ...o, status: 'backup' as const };
      return o;
    });

    const tx = db.transaction('organizations', 'readwrite');
    for (const org of updatedOrgs) {
      await tx.store.put(org);
    }
    await tx.done;

    const nextSettings = { ...get().settings, preferredOrgId: orgId };
    await db.put('settings', { ...nextSettings, id: 'main_config' });

    set({ organizations: updatedOrgs, settings: nextSettings });
  },

  updateOrgResearch: async (org: OrganizationResearch) => {
    const db = await getGsocDb();
    await db.put('organizations', org);
    const updatedOrgs = get().organizations.map(o => (o.id === org.id ? org : o));
    set({ organizations: updatedOrgs });
  },

  addContribution: async (record) => {
    const db = await getGsocDb();
    const newRecord: ContributionRecord = {
      ...record,
      id: `contrib-${Date.now()}`,
      openedDate: kolkataToday(),
      updatedDate: kolkataToday()
    };

    await db.put('contributions', newRecord);
    const nextList = [newRecord, ...get().contributions];
    const nextMetrics = calculateGsocMetrics(
      GSOC_DAYS,
      get().progressMap,
      get().sessions,
      nextList,
      get().activeProposal || undefined,
      kolkataToday()
    );

    set({ contributions: nextList, metrics: nextMetrics });
  },

  updateContribution: async (record: ContributionRecord) => {
    const db = await getGsocDb();
    const updated: ContributionRecord = {
      ...record,
      updatedDate: kolkataToday(),
      mergedDate: record.state === 'merged' && !record.mergedDate ? kolkataToday() : record.mergedDate
    };

    await db.put('contributions', updated);
    const nextList = get().contributions.map(c => (c.id === record.id ? updated : c));
    const nextMetrics = calculateGsocMetrics(
      GSOC_DAYS,
      get().progressMap,
      get().sessions,
      nextList,
      get().activeProposal || undefined,
      kolkataToday()
    );

    set({ contributions: nextList, metrics: nextMetrics });
  },

  saveProposalDraft: async (fields: Partial<ProposalDraft>) => {
    const db = await getGsocDb();
    const current = get().activeProposal || {
      id: 'gsoc-2027-proposal-main',
      title: 'GSoC 2027 Project Proposal Draft',
      selectedOrgId: get().settings.preferredOrgId || 'dipy',
      ideaUrl: '',
      contactChannel: '',
      problemAndUsers: '',
      architectureAnalysis: '',
      proposedApproach: '',
      deliverablesMvp: '',
      deliverablesStretch: '',
      explicitExclusions: '',
      testValidationPlan: '',
      timelineWeekly: '',
      dependenciesAndRisks: '',
      pastWorkEvidence: '',
      availabilityAndExams: '',
      communicationPlan: '',
      feedbackLog: '',
      templateComplianceNotes: '',
      aiDisclosure: '',
      lastAutoSaved: new Date().toISOString(),
      isSubmittedToPlatform: false
    };

    const updated: ProposalDraft = {
      ...current,
      ...fields,
      lastAutoSaved: new Date().toISOString()
    };

    await db.put('proposals', updated);
    const nextMetrics = calculateGsocMetrics(
      GSOC_DAYS,
      get().progressMap,
      get().sessions,
      get().contributions,
      updated,
      kolkataToday()
    );

    set({ activeProposal: updated, metrics: nextMetrics });
  },

  recordOfficialEvent: async (id: OfficialEventKey, instant: string, sourceUrl: string) => {
    const db = await getGsocDb();
    const updatedEvent: OfficialEvent = {
      id,
      instant,
      status: 'user_recorded_from_official_source',
      sourceUrl,
      verifiedAt: kolkataToday(),
      estimateLabel: `Announced: ${instant}`
    };

    await db.put('official_events', updatedEvent);
    const updatedList = get().officialEvents.map(e => (e.id === id ? updatedEvent : e));
    set({ officialEvents: updatedList });
  },

  logStudySession: async (session) => {
    const db = await getGsocDb();
    const newSession: GsocSession = {
      ...session,
      id: `gsoc-sess-${Date.now()}`,
      trackId: 'gsoc2027'
    };

    await db.put('sessions', newSession);
    const nextSessions = [...get().sessions, newSession];
    const nextMetrics = calculateGsocMetrics(
      GSOC_DAYS,
      get().progressMap,
      nextSessions,
      get().contributions,
      get().activeProposal || undefined,
      kolkataToday()
    );

    set({ sessions: nextSessions, metrics: nextMetrics });
  },

  applyCatchUpOverrides: async (overrides: Record<string, CivilDate>) => {
    const db = await getGsocDb();
    const tx = db.transaction('day_overrides', 'readwrite');

    for (const [dayId, newDate] of Object.entries(overrides)) {
      await tx.store.put({ dayId, newDate });
    }
    await tx.done;

    const nextOverrides = { ...get().dayOverrides, ...overrides };
    set({ dayOverrides: nextOverrides });
  },

  resetGsocOnly: async () => {
    await resetGsocDbOnly();
    await get().loadAll();
  }
}));
