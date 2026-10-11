import { 
  GsocDay, 
  TaskProgress, 
  GsocSession, 
  ContributionRecord, 
  ProposalDraft, 
  GsocProgressMetrics,
  CivilDate
} from '../types/gsoc';
import { GSOC_PHASES } from '../data/gsoc2027';
import { kolkataToday } from './gsocDateUtils';

export function calculateGsocMetrics(
  days: GsocDay[],
  progressMap: Record<string, TaskProgress>,
  sessions: GsocSession[],
  contributions: ContributionRecord[],
  proposalDraft?: ProposalDraft,
  todayStr: CivilDate = kolkataToday()
): GsocProgressMetrics {
  let totalRequiredSteps = 0;
  let completedRequiredSteps = 0;
  let completedDays = 0;

  days.forEach(day => {
    const dayProgress = progressMap[day.id];
    const completedStepIds = dayProgress?.completedStepIds || [];

    day.steps.forEach(step => {
      if (step.required) {
        totalRequiredSteps++;
        if (completedStepIds.includes(step.id)) {
          completedRequiredSteps++;
        }
      }
    });

    if (dayProgress?.status === 'completed') {
      completedDays++;
    }
  });

  // Calculate total tracked study seconds
  const totalTrackedSeconds = sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);

  // Phase breakdown
  const phaseMetrics = GSOC_PHASES.map(phase => {
    const phaseDays = days.filter(d => d.phaseId === phase.id);
    const completedInPhase = phaseDays.filter(d => progressMap[d.id]?.status === 'completed').length;
    const totalInPhase = phaseDays.length;
    const percentage = totalInPhase > 0 ? Math.round((completedInPhase / totalInPhase) * 100) : 0;

    return {
      phaseId: phase.id,
      title: phase.title,
      totalDays: totalInPhase,
      completedDays: completedInPhase,
      percentage
    };
  });

  // Streak calculation (consecutive past scheduled days with completion up to today)
  let currentStreak = 0;
  const pastDays = days
    .filter(d => d.targetDate <= todayStr && d.type !== 'rest')
    .sort((a, b) => b.targetDate.localeCompare(a.targetDate)); // most recent first

  for (const day of pastDays) {
    const p = progressMap[day.id];
    if (p?.status === 'completed') {
      currentStreak++;
    } else if (day.targetDate < todayStr) {
      // Break streak only if a day prior to today was skipped and not completed
      break;
    }
  }

  // Contributions count
  const contributionsCount = {
    practice: contributions.filter(c => c.isPracticeRepo).length,
    inProgress: contributions.filter(c => c.state === 'in_progress').length,
    draftPr: contributions.filter(c => c.state === 'draft_pr').length,
    submitted: contributions.filter(c => c.state === 'submitted').length,
    merged: contributions.filter(c => c.state === 'merged').length,
    closed: contributions.filter(c => c.state === 'closed').length
  };

  // Proposal readiness score: count completed fields among the 12 core sections
  let filledProposalSections = 0;
  const proposalFields: Array<keyof ProposalDraft> = [
    'problemAndUsers',
    'architectureAnalysis',
    'proposedApproach',
    'deliverablesMvp',
    'testValidationPlan',
    'timelineWeekly',
    'dependenciesAndRisks',
    'pastWorkEvidence',
    'availabilityAndExams',
    'communicationPlan',
    'feedbackLog',
    'templateComplianceNotes'
  ];

  if (proposalDraft) {
    proposalFields.forEach(field => {
      const val = proposalDraft[field];
      if (typeof val === 'string' && val.trim().length > 30) {
        filledProposalSections++;
      }
    });
  }

  const proposalReadinessScore = Math.round((filledProposalSections / proposalFields.length) * 100);

  return {
    totalRequiredSteps,
    completedRequiredSteps,
    totalDays: days.length,
    completedDays,
    totalTrackedSeconds,
    currentStreak,
    phaseMetrics,
    contributionsCount,
    proposalReadinessScore
  };
}
