import { StudyTask } from '../types';

export function getNextRecommendedAction(tasks: StudyTask[]): StudyTask | undefined {
  if (!tasks || tasks.length === 0) return undefined;

  // Filter incomplete tasks
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  if (pendingTasks.length === 0) {
    return tasks[0]; // All done, return first as reference
  }

  // Sorting priority weights (lower number = higher priority)
  const getPriorityScore = (t: StudyTask): number => {
    // 1. Current Masai live class or assignment due within 24 hours
    if (t.category === 'masai_live') return 10;

    // 2. Scheduled Masai backlog video during recovery sprint
    if (t.category === 'masai_backlog') return 20;

    // 3. Daily coding proof / blank editor practice
    if (t.category === 'python_practice' && t.title.toLowerCase().includes('coding proof')) return 30;

    // 4. DSA or SQL practice
    if (t.category === 'dsa_sql') return 40;

    // 5. Due spaced recall / review task
    if (t.category === 'recall') return 50;

    // 6. Other required tasks
    if (t.isRequired) return 60 + t.order;

    // 7. Optional tasks
    return 100 + t.order;
  };

  const sorted = [...pendingTasks].sort((a, b) => getPriorityScore(a) - getPriorityScore(b));
  return sorted[0];
}
