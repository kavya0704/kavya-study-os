export type CivilDate = string; // validated YYYY-MM-DD
export type TrackId = 'aiml' | 'gsoc2027';

export type OfficialEventKey = 
  | 'organizationAnnouncement'
  | 'applicationOpen'
  | 'applicationDeadline'
  | 'resultsAnnouncement'
  | 'bondingStart'
  | 'codingStart';

export interface OfficialEvent {
  id: OfficialEventKey;
  instant: string | null; // ISO with timezone; null until announced
  status: 'unannounced' | 'user_recorded_from_official_source';
  sourceUrl: string;
  verifiedAt: string | null;
  estimateLabel: string; // display only; never a countdown input
}

export interface GsocResource {
  id: string;
  title: string;
  channelOrPublisher: string;
  url: string | null;
  type: 'video' | 'playlist' | 'docs' | 'exercise' | 'program' | 'case_study';
  language: 'English';
  durationSeconds: number | null;
  approximateDurationLabel?: string;
  verifiedAt: CivilDate;
  verification: 'title_or_page_opened' | 'needs_recheck' | 'unavailable';
  searchQuery?: string;
}

export interface GsocStep {
  id: string;
  kind: 'learn' | 'practice' | 'contribute' | 'proposal' | 'review';
  text: string;
  plannedMinutes: number;
  required: boolean;
  resourceRefs: Array<{
    resourceId: string;
    segmentLabel?: string;
    startSeconds?: number | null;
    endSeconds?: number | null;
    videoRange?: string | null;
  }>;
  doneWhen: string;
}

export interface GsocDay {
  id: string; // stable identity, e.g. gsoc-w01-a
  targetDate: CivilDate;
  weekNumber: number;
  slotLetter: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
  phaseId: string;
  title: string;
  focusTopic: string;
  practicalAction: string;
  type: 'learn' | 'practice' | 'contribute' | 'proposal' | 'review' | 'buffer' | 'rest';
  coreMinutes: number;
  steps: GsocStep[];
  organizationBranch: 'all' | 'dipy' | 'ignite' | 'matplotlib' | 'holidays' | 'opencv';
  eventDependency?: OfficialEventKey;
  optional: boolean;
  doneWhen: string;
}

export interface TaskProgress {
  dayId: string;
  completedStepIds: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'skipped_optional';
  notesMarkdown: string;
  evidenceUrls: string[];
  completedAt: string | null;
  actualTargetDateOverride?: CivilDate;
  updatedAt: string;
}

export interface OrganizationResearch {
  id: string;
  name: string;
  umbrella: string;
  status: 'exploring' | 'main' | 'backup';
  repoUrl: string;
  issuesUrl: string;
  contributingUrl: string;
  ideasUrl: string;
  stack: string[];
  historicalRequirements: string;
  prerequisites: string;
  channelName: string;
  channelUrl: string;
  codeMapNotes: string;
  notes: string;
  confirmed2027: boolean;
  confirmedSourceUrl?: string;
  confirmedCheckedDate?: CivilDate;
  fitScore?: {
    interest: number;
    runnable: number;
    skillFit: number;
    workflow: number;
    summerTime: number;
  };
}

export type ContributionState = 
  | 'researching'
  | 'reproduced'
  | 'planned'
  | 'in_progress'
  | 'draft_pr'
  | 'submitted'
  | 'changes_requested'
  | 'merged'
  | 'closed'
  | 'blocked';

export interface ContributionRecord {
  id: string;
  orgId: string;
  orgName: string;
  repoUrl: string;
  title: string;
  issueOrPrUrl: string;
  branchName: string;
  state: ContributionState;
  isPracticeRepo: boolean;
  testsRunDescription: string;
  testResult: 'passed' | 'failed' | 'not_run';
  reviewFeedback: string;
  nextAction: string;
  openedDate: string;
  updatedDate: string;
  mergedDate?: string;
  learningNotes: string;
  qualityChecklist: {
    scopeAccepted: boolean;
    reproducible: boolean;
    appropriateTest: boolean;
    cleanDiff: boolean;
    docsIncluded: boolean;
    understandable: boolean;
    reviewResponded: boolean;
  };
}

export interface ProposalDraft {
  id: string;
  title: string;
  selectedOrgId: string;
  ideaUrl: string;
  contactChannel: string;
  problemAndUsers: string;
  architectureAnalysis: string;
  proposedApproach: string;
  deliverablesMvp: string;
  deliverablesStretch: string;
  explicitExclusions: string;
  testValidationPlan: string;
  timelineWeekly: string;
  dependenciesAndRisks: string;
  pastWorkEvidence: string;
  availabilityAndExams: string;
  communicationPlan: string;
  feedbackLog: string;
  templateComplianceNotes: string;
  aiDisclosure: string;
  lastAutoSaved: string;
  isSubmittedToPlatform: boolean;
  submissionConfirmation?: {
    submittedDate: string;
    platformUrl: string;
    note?: string;
  };
  outcomeStatus?: 'awaiting_results' | 'accepted' | 'not_selected' | 'withdrawn';
}

export interface ProposalSnapshot {
  id: string;
  proposalId: string;
  title: string;
  markdownContent: string;
  createdAt: string;
  note?: string;
}

export interface GsocSettings {
  capacityMinutesWeekday: number;
  capacityMinutesWeekend: number;
  collegeWeekdays: number[]; // 1=Mon, 2=Tue, etc.
  preferredOrgId: string;
  backupOrgId?: string;
  startDate: CivilDate;
}

export interface GsocSession {
  id: string;
  dayId: string;
  stepId?: string;
  taskTitle: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  trackId: 'gsoc2027';
  date: CivilDate;
}

export interface GsocPhase {
  id: string;
  phaseNumber: number;
  title: string;
  focus: string;
  targetRangeText: string;
  startDate: CivilDate;
  endDate: CivilDate;
  evidenceToProduce: string;
}

export interface GsocWeek {
  number: number;
  phaseId: string;
  theme: string;
  dateRangeText: string;
  slots: Array<{
    slotLetter: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
    coreMinutes: number;
    learnOrFocus: string;
    practicalAction: string;
    doneWhen: string;
    resourceIds: string[];
    type: 'learn' | 'practice' | 'contribute' | 'proposal' | 'review' | 'buffer' | 'rest';
    branch?: 'all' | 'dipy' | 'ignite' | 'matplotlib' | 'holidays' | 'opencv';
    eventDependency?: OfficialEventKey;
    optional?: boolean;
  }>;
}

export interface GsocProgressMetrics {
  totalRequiredSteps: number;
  completedRequiredSteps: number;
  totalDays: number;
  completedDays: number;
  totalTrackedSeconds: number;
  currentStreak: number;
  phaseMetrics: Array<{
    phaseId: string;
    title: string;
    totalDays: number;
    completedDays: number;
    percentage: number;
  }>;
  contributionsCount: {
    practice: number;
    inProgress: number;
    draftPr: number;
    submitted: number;
    merged: number;
    closed: number;
  };
  proposalReadinessScore: number;
}
