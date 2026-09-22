# Kavya StudyOS — Phase-Wise Implementation Blueprint

**Document Version:** 1.0 (Developer-Ready Engineering Guide)  
**Product Name:** Kavya StudyOS  
**Target User:** Kavya Shaw (B.Tech CSE AI/ML, 3rd Year)  
**Target Device:** Apple iPhone 16 in Portrait Orientation (PWA)  
**Architecture Reference:** [`ARCHITECTURE.md`](file:///c:/Users/kavya/Documents/study.ai/ARCHITECTURE.md)  
**Requirements Reference:** [`PROBLEM_STATEMENT.md`](file:///c:/Users/kavya/Documents/study.ai/PROBLEM_STATEMENT.md)  
**Configured AI Key:** `gsk_your_groq_api_key_here` (Groq Cloud LPU)

---

## Executive Implementation Roadmap

This blueprint breaks down the end-to-end development of **Kavya StudyOS** into **13 sequential, verifiable phases**. Every phase includes:
- **Phase Objective & Prerequisites**
- **Specific Files to Create / Modify**
- **Detailed Step-by-Step Tasks with Checkboxes**
- **Code Implementations, Schemas, and Algorithms**
- **Verification & Testing Criteria**
- **Phase Exit Gate**

```
+-----------------------------------------------------------------------------------------------+
|                               PHASE-WISE IMPLEMENTATION TIMELINE                              |
+-----------------------------------------------------------------------------------------------+
| Phase 1:  Project Scaffolding, Mobile PWA Shell & Design System Tokens                        |
| Phase 2:  Domain Types, Immutable Seed Data (101 Days / 62 Links) & IndexedDB Layer          |
| Phase 3:  Zustand State Stores & Algorithmic Engines (Recommendation, Spaced, Reconstructor) |
| Phase 4:  Today Dashboard, Next-Action Hero Card & Interactive 5-Task Checklist               |
| Phase 5:  Strict Video Subtask Completion Gate (6 Subtasks) & Anti-Forgetting Automation       |
| Phase 6:  iOS Screen-Lock Resilient Focus Timer & Session Logger                              |
| Phase 7:  Markdown Notes Editor (>=16px), Reflection Drawer & Searchable Error Log            |
| Phase 8:  Groq AI Engine Integration (Recall Generator, Error Diagnostic, Concept Analogy)    |
| Phase 9:  Multi-View Plan Calendar (Day/Week/Month/Phase) & Safe Rescheduling Engine           |
| Phase 10: Curated Resource Directory (5 Segments, External Launchers & Broken Link Reporter)   |
| Phase 11: Progress Analytics Dashboard, 0-25 Backlog Counter & 31 December Scorecard         |
| Phase 12: Settings, Life Constraints (College/Teaching/Gym/Puja) & Backup/Restore (JSON/MD)   |
| Phase 13: Vitest Test Suite, iPhone 16 WebKit Audit, Lighthouse PWA & Production Deploy       |
+-----------------------------------------------------------------------------------------------+
```

---

## Phase 1: Project Scaffolding, Mobile PWA Shell & Design System Tokens

### 1.1 Objective
Establish the React 19 + TypeScript + Vite project foundation with strict typing, Tailwind CSS custom design tokens, iOS WebKit safe-area support, and Progressive Web App (PWA) manifest configuration.

### 1.2 Target Files
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tailwind.config.js`
- `index.html`
- `public/manifest.webmanifest`
- `src/styles/globals.css`
- `.env.local` & `.env.example`

### 1.3 Implementation Tasks
- [ ] **Task 1.1: Initialize Dependencies**
  Configure `package.json` with current stable dependencies:
  - Core: `react`, `react-dom`
  - Icons & Styling: `lucide-react`, `tailwindcss`, `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`
  - State & Storage: `zustand`, `idb`
  - Utilities: `canvas-confetti` (for milestone celebration only), `dompurify` (for markdown sanitization)
  - Dev: `typescript`, `vite`, `vite-plugin-pwa`, `vitest`, `@testing-library/react`
- [ ] **Task 1.2: Configure Vite & PWA Plugin**
  Set up `vite.config.ts` with `VitePWA`:
  ```typescript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import { VitePWA } from 'vite-plugin-pwa';

  export default defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false, // Use public/manifest.webmanifest
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
        }
      })
    ]
  });
  ```
- [ ] **Task 1.3: Configure WebKit Safe-Area Meta in `index.html`**
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="StudyOS" />
  <meta name="theme-color" content="#0a0f1d" />
  ```
- [ ] **Task 1.4: Configure Web App Manifest in `public/manifest.webmanifest`**
  Set `display: "standalone"`, `orientation: "portrait-primary"`, and dark background `#0a0f1d`.
- [ ] **Task 1.5: Configure Tailwind Design Tokens & Safe-Area Insets**
  Map `--sat`, `--sab`, `--sar`, `--sal` in `globals.css` and configure Tailwind color palette in `tailwind.config.js`:
  ```javascript
  module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          canvas: '#0a0f1d',
          surface: {
            1: '#131b2e',
            2: '#1c263f'
          },
          primary: {
            teal: '#14b8a6',
            cyan: '#0ea5e9'
          },
          secondary: {
            indigo: '#6366f1'
          },
          accent: {
            amber: '#f59e0b',
            red: '#ef4444'
          }
        }
      }
    }
  };
  ```

### 1.4 Verification & Phase Exit Gate
- Run `npm run build` with zero TypeScript errors.
- Inspect responsive preview at iPhone 16 viewport (`393 x 852 px`) with zero horizontal overflow.
- Confirm dark canvas `#0a0f1d` renders cleanly across the screen.

---

## Phase 2: Domain Types, Immutable Seed Data & IndexedDB Layer

### 2.1 Objective
Model all TypeScript domain contracts, load the complete 101-day curriculum seed and 62 canonical learning resources into static data files, and implement the local IndexedDB repository using `idb`.

### 2.2 Target Files
- `src/types/user.ts`
- `src/types/roadmap.ts`
- `src/types/timer.ts`
- `src/types/notes.ts`
- `src/types/resources.ts`
- `src/types/ai.ts`
- `src/data/seeds/phases.json` (8 Phases)
- `src/data/seeds/days.json` (101 Dated Study Days)
- `src/data/seeds/tasks.json` (~500 Tasks with 25 Backlog lessons)
- `src/data/seeds/resources.json` (62 Canonical Resources)
- `src/services/db/db.ts`
- `src/services/db/seedLoader.ts`

### 2.3 Implementation Tasks
- [ ] **Task 2.1: Implement Domain Types**
  Define strict TypeScript interfaces matching `ARCHITECTURE.md` Section 5 (`UserProfile`, `StudyDay`, `StudyTask`, `StudyTaskSubtasks`, `StudySession`, `Note`, `Resource`, `RevisionItem`, `ApplicationRecord`).
- [ ] **Task 2.2: Compile Immutable Seed Data**
  - Populate `phases.json` with all 8 phases (Dates, Outcomes, Exit Evidence).
  - Populate `days.json` with all 101 days (22 Sep – 31 Dec 2026, mapping college days, non-college days, and the 5 Puja rest days 17–21 Oct).
  - Populate `tasks.json` with ~5 tasks per active day, tagging all 25 Masai backlog lessons with `backlogVideoNumber: 1..25` and initializing `subtasks: { watchedActively: false, recreatedExample: false, wroteRecallQuestions: false, solvedVariations: false, recordedDoubtOrMistake: false, committedProof: false }`.
  - Populate `resources.json` with all 62 canonical resources (Videos, Official Docs, LeetCode, Kaggle, Job Listings).
- [ ] **Task 2.3: Implement IndexedDB Wrapper (`src/services/db/db.ts`)**
  Use `idb` to create database `kavya_studyos_db` version `1` with stores:
  `user_profile`, `study_days`, `study_tasks`, `study_sessions`, `notes`, `resources`, `revision_items`, `application_records`.
- [ ] **Task 2.4: Build Seed Loader with Idempotency Guard**
  Implement `seedLoader.ts`:
  ```typescript
  export async function checkAndSeedDatabase() {
    const db = await getDb();
    const existingProfile = await db.get('user_profile', 'profile_kavya');
    if (!existingProfile) {
      // Seed default user profile
      await db.put('user_profile', defaultProfile);
      // Seed days, tasks, resources from static JSON
      const tx = db.transaction(['study_days', 'study_tasks', 'resources'], 'readwrite');
      for (const day of seedDays) await tx.objectStore('study_days').put(day);
      for (const task of seedTasks) await tx.objectStore('study_tasks').put(task);
      for (const res of seedResources) await tx.objectStore('resources').put(res);
      await tx.done;
      console.log('Successfully seeded 101 days and 62 resources into IndexedDB');
    }
  }
  ```

### 2.4 Verification & Phase Exit Gate
- Open browser DevTools $	o$ Application $	o$ IndexedDB.
- Verify `kavya_studyos_db` contains 101 records in `study_days`, ~500 in `study_tasks`, and 62 in `resources`.
- Reload page to verify that seed loader does not duplicate records.

---

## Phase 3: Zustand State Stores & Algorithmic Engines

### 3.1 Objective
Construct reactive state stores using Zustand and implement the core computational engines: Recommendation Priority Engine, Spaced Revision Engine, Timestamp Reconstructor, and Safe Rescheduling Engine.

### 3.2 Target Files
- `src/stores/useTaskStore.ts`
- `src/stores/useTimerStore.ts`
- `src/stores/useNoteStore.ts`
- `src/stores/useProgressStore.ts`
- `src/stores/useProfileStore.ts`
- `src/engines/recommendationEngine.ts`
- `src/engines/spacedRevisionEngine.ts`
- `src/engines/timerReconstructor.ts`
- `src/engines/rescheduleEngine.ts`

### 3.3 Implementation Tasks
- [ ] **Task 3.1: Recommendation Engine (`src/engines/recommendationEngine.ts`)**
  Implement deterministic ranking:
  1. Masai live class/assignment due within 24 hours.
  2. Scheduled backlog video during the recovery sprint (28 Sep – 27 Oct).
  3. Daily coding practice / blank-editor proof.
  4. Scheduled DSA / SQL practice problem.
  5. Spaced revision review task due today.
  6. Next sequential incomplete roadmap task.
- [ ] **Task 3.2: Spaced Revision Engine (`src/engines/spacedRevisionEngine.ts`)**
  - When an eligible task completes, generate `RevisionItem` records:
    * Day +1 (+24h): 10-minute 5-question recall.
    * Day +3 (+72h): 20-minute transfer problem.
    * Day +7 (+168h): 20-minute closed-book quiz / oral explanation.
  - Automatically bump dates if due date collides with 17–21 Oct (Puja) or marked rest days.
  - Enforce a maximum cap of 2 required review tasks on any given date.
- [ ] **Task 3.3: Timer Reconstructor Engine (`src/engines/timerReconstructor.ts`)**
  Calculate true elapsed time using epoch millisecond math:
  ```typescript
  export function calculateTrueElapsed(startTimestamp: number, pausedDurationMs: number): number {
    const rawElapsed = Date.now() - startTimestamp - pausedDurationMs;
    return Math.max(0, Math.floor(rawElapsed / 1000));
  }
  ```
- [ ] **Task 3.4: Safe Rescheduling Engine (`src/engines/rescheduleEngine.ts`)**
  - Invariant 1: Reject moving a backlog video to a date that already contains one.
  - Invariant 2: Block auto-rescheduling onto protected Puja days (17–21 Oct).
  - Invariant 3: Route missed core tasks to designated buffer slots (Day 37, 28 Oct).
- [ ] **Task 3.5: State Stores Integration**
  Wire Zustand stores to call the database repositories and trigger engine updates upon state transitions.

### 3.4 Verification & Phase Exit Gate
- Unit test `recommendationEngine` with mock tasks: verify priority order.
- Unit test `spacedRevisionEngine`: verify that reviews falling on 18 Oct are shifted to 22 Oct.
- Verify timer reconstructor returns exact elapsed seconds after simulating tab sleep.

---

## Phase 4: Today Dashboard, Next-Action Hero Card & Interactive Task Checklist

### 4.1 Objective
Build the primary user-facing screen (`TodayView`): Dynamic Header, Next-Action Hero Card, 5-task daily checklist with large touch targets, micro-animations, 5-second Undo toast, and daily dual-progress rings.

### 4.2 Target Files
- `src/components/layout/AppHeader.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/common/Checkbox.tsx`
- `src/components/common/Toast.tsx`
- `src/components/common/ProgressRing.tsx`
- `src/components/task/NextActionHero.tsx`
- `src/components/task/TaskCard.tsx`
- `src/views/TodayView.tsx`

### 4.3 Implementation Tasks
- [ ] **Task 4.1: Dynamic App Header (`AppHeader.tsx`)**
  - Render greeting, current date (`Tuesday, 22 Sep 2026`), day category pill (`College Day` / `Non-College Day` / `Rest Day`).
  - Display phase/week status and total focused study minutes today.
- [ ] **Task 4.2: Next-Action Hero Card (`NextActionHero.tsx`)**
  - Highlight the single highest-priority task computed by `recommendationEngine`.
  - Prominent `Start Timer` action (triggers timer drawer) and `Mark Complete` button.
- [ ] **Task 4.3: Accessible Large Checkbox (`Checkbox.tsx`)**
  - Enforce minimum 44×44px touch bounding box.
  - Scale/fade transition (≤200ms) conforming to `prefers-reduced-motion`.
- [ ] **Task 4.4: Task Checklist Component (`TaskCard.tsx`)**
  - Render estimated vs. actual minutes, category color badge, and primary resource link.
  - Tapping opens the detailed task bottom sheet.
- [ ] **Task 4.5: Reversible 5-Second Undo Toast (`Toast.tsx`)**
  - Checking a task immediately triggers a subtle toast: *"Task completed • Undo"* that stays for 5 seconds before committing the spaced review triggers.
- [ ] **Task 4.6: Dual-Progress Ring (`ProgressRing.tsx`)**
  - Visual ring showing task completion (`completed / total required`) and time progress (`actual minutes / planned minutes`).
  - If today is a rest day, render: *"Rest Day Respected (100%)"*.

### 4.4 Verification & Phase Exit Gate
- Open the app on iPhone 16 viewport.
- Complete a task: verify checkmark animates in <200ms, progress updates instantly, and tapping "Undo" reverts the task.
- Check that interactive elements have $\ge 44	ext{px}$ touch targets.

---

## Phase 5: Strict Video Subtask Completion Gate & Spaced Revision UI

### 5.1 Objective
Implement the 6-subtask video completion modal for Masai backlog lessons, ensuring no video is marked complete without hands-on practice, recall questions, and Git commits. Connect completed tasks to automated spaced review cards.

### 5.2 Target Files
- `src/components/task/VideoSubtaskGate.tsx`
- `src/components/task/TaskDetailSheet.tsx`
- `src/components/task/SpacedReviewCard.tsx`

### 5.3 Implementation Tasks
- [ ] **Task 5.1: Video Subtask Gate Modal (`VideoSubtaskGate.tsx`)**
  When checking a task with category `masai_backlog`, pop open the 6-item gate:
  - [ ] Watched actively (paused at code demos).
  - [ ] Recreated key example from a blank file without looking.
  - [ ] Wrote 5 recall questions in task note.
  - [ ] Solved 3 original practice variations.
  - [ ] Recorded at least 1 doubt or mistake in error log.
  - [ ] Committed working code to Git with a meaningful message.
  - *Gate Enforcement:* Disable the "Complete Video Lesson" button until all 6 subtasks are ticked.
- [ ] **Task 5.2: Task Detail Sheet (`TaskDetailSheet.tsx`)**
  - Slide-up bottom sheet with full task instructions, why it matters, Definition of Done, and direct resource links split into: **Videos**, **Notes & Docs**, and **Practice**.
  - Includes proof field: GitHub repository / commit URL.
- [ ] **Task 5.3: Spaced Revision Review Cards (`SpacedReviewCard.tsx`)**
  - Display Day+1, Day+3, and Day+7 items due today.
  - Provide grading buttons: `Strong` (marks done), `Needs Review` (adds targeted drill), `Blocked` (logs to error log).

### 5.4 Verification & Phase Exit Gate
- Attempt to complete Masai Backlog Video #1 with only 4 subtasks checked $	o$ verify completion is blocked.
- Check all 6 subtasks $	o$ verify parent task marks complete and Day+1 review is scheduled for tomorrow.

---

## Phase 6: iOS Screen-Lock Resilient Focus Timer & Session Logger

### 6.1 Objective
Build a high-precision study timer supporting count-up stopwatch, 25/5 and 50/10 focus intervals, and manual time logging. Reconstruct exact elapsed time across iOS background tab suspension and screen locks.

### 6.2 Target Files
- `src/components/timer/TimerDisplay.tsx`
- `src/components/timer/TimerControls.tsx`
- `src/components/timer/ManualSessionModal.tsx`
- `src/views/TimerView.tsx`

### 6.3 Implementation Tasks
- [ ] **Task 6.1: High-Performance Timer Display (`TimerDisplay.tsx`)**
  - Format `HH:MM:SS` in clean tabular monospaced digits.
  - Subtle breathing glow during active recording.
- [ ] **Task 6.2: Timer Controls & Interval Modes (`TimerControls.tsx`)**
  - Support: **Count-Up Stopwatch**, **25/5 Pomodoro**, **50/10 Deep Work**.
  - One-tap Start, Pause, Resume, and Finish buttons.
  - Subtle audio chime / Web Vibration API haptic on interval completion.
- [ ] **Task 6.3: iOS Lock-Screen & Visibility Reconciler**
  Listen to `document.addEventListener('visibilitychange', ...)`:
  ```typescript
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && useTimerStore.getState().isRunning) {
      useTimerStore.getState().reconcileElapsedTime();
    }
  });
  ```
- [ ] **Task 6.4: Manual Session Entry Modal (`ManualSessionModal.tsx`)**
  - Allow logging offline study (e.g., college library sessions) with date, duration, task selection, and category.
- [ ] **Task 6.5: Session Persistence & Audit History**
  - Save completed session to `study_sessions` store in IndexedDB.
  - Display recent session logs with edit capability.

### 6.4 Verification & Phase Exit Gate
- Start timer $	o$ switch browser tab or lock screen for 5 minutes $	o$ reopen app.
- Confirm displayed elapsed time matches clock duration accurately ($\pm 1	ext{ second}$).

---

## Phase 7: Markdown Notes Editor, Reflection Drawer & Searchable Error Log

### 7.1 Objective
Implement an inline distraction-free markdown notes editor with minimum 16px font size to prevent mobile browser auto-zooming, a structured `#error_log` diagnostic drawer, and daily 4-prompt reflection.

### 7.2 Target Files
- `src/components/notes/MarkdownEditor.tsx`
- `src/components/notes/ReflectionDrawer.tsx`
- `src/components/notes/ErrorLogCard.tsx`
- `src/components/notes/NotesSearchModal.tsx`

### 7.3 Implementation Tasks
- [ ] **Task 7.1: Mobile-Optimized Markdown Editor (`MarkdownEditor.tsx`)**
  - Minimum font size `16px` on textarea (`font-size: 16px !important;`).
  - Debounced auto-save (500ms) with `Saving...` $	o$ `Saved` indicator.
  - Formatting bar for code blocks, lists, and bold text.
- [ ] **Task 7.2: Daily Reflection Drawer (`ReflectionDrawer.tsx`)**
  - Collapsible drawer on Today dashboard with 4 structured prompts:
    1. *What did I understand?*
    2. *Where did I get stuck?*
    3. *What should I revise?*
    4. *What is the first task tomorrow?*
- [ ] **Task 7.3: Structured Error Log Drawer (`ErrorLogCard.tsx`)**
  - Specialized note type tagged `#error_log`.
  - Fields: **Symptom**, **Root Cause**, **Code Fix Snippet**, **Interview Lesson**.
- [ ] **Task 7.4: Global Notes Search (`NotesSearchModal.tsx`)**
  - Full-text search across all notes by keyword, tag, topic, or date.

### 7.4 Verification & Phase Exit Gate
- Type notes in the editor $	o$ reload the browser $	o$ confirm text persists with zero loss.
- Verify tapping into the text editor on an iPhone screen does NOT trigger unwanted viewport zooming.

---

## Phase 8: Groq AI Engine Integration (Recall Generator & Error Diagnostician)

### 8.1 Objective
Integrate the Groq Cloud LPU™ inference client using the provided API key (`gsk_your_groq_api_key_here`) to enable sub-500ms recall question generation, error log diagnostics, and Hinglish concept analogies.

### 8.2 Target Files
- `src/services/ai/groqClient.ts`
- `src/services/ai/prompts.ts`
- `src/components/ai/AIRecallButton.tsx`
- `src/components/ai/AIDiagnosticModal.tsx`
- `src/components/ai/AIAnalogySheet.tsx`

### 8.3 Implementation Tasks
- [ ] **Task 8.1: Implement Groq Client Service (`src/services/ai/groqClient.ts`)**
  Connect to `https://api.groq.com/openai/v1/chat/completions` with bearer token authentication.
  Supported models: `llama-3.3-70b-versatile` (deep reasoning) and `llama-3.1-8b-instant` (sub-second generation).
- [ ] **Task 8.2: Implement Specialized System Prompts (`src/services/ai/prompts.ts`)**
  - `RECALL_PROMPT`: Generate 5 closed-book conceptual recall questions from today's task notes.
  - `ERROR_DIAGNOSTIC_PROMPT`: Analyze stack trace and output symptom, root cause, and fix.
  - `CONCEPT_ANALOGY_PROMPT`: Explain complex ML topics in Hinglish/English with real-world analogies.
- [ ] **Task 8.3: Build AI Recall Generator Button (`AIRecallButton.tsx`)**
  - One-tap button inside task detail sheet: *"Generate 5 Recall Questions"*.
  - Streams or displays generated questions directly into the task's notes area for Day+1 review.
- [ ] **Task 8.4: Build AI Error Diagnostic Modal (`AIDiagnosticModal.tsx`)**
  - Paste an error traceback $	o$ tap *"Diagnose Bug"* $	o$ auto-fills structured `#error_log` card.
- [ ] **Task 8.5: Enforce Anti-Guilt & Privacy Guardrails**
  - AI calls trigger ONLY on explicit user tap (zero background telemetry).
  - System prompts strictly forbid shaming language or impossible catch-up schedules.

### 8.4 Verification & Phase Exit Gate
- Tap "Generate 5 Recall Questions" on a Scikit-Learn task $	o$ verify response generates within 1 second via Groq API.
- Test error diagnostic with a sample `ColumnTransformer` KeyError $	o$ verify clean code snippet is returned.

---

## Phase 9: Multi-View Plan Calendar & Safe Rescheduling Engine

### 9.1 Objective
Build the interactive roadmap planner supporting Day, Week, Month, and 8-Phase roadmap views. Implement safe rescheduling that respects buffer days and prevents overloading.

### 9.2 Target Files
- `src/components/plan/DayView.tsx`
- `src/components/plan/WeekView.tsx`
- `src/components/plan/MonthCalendar.tsx`
- `src/components/plan/PhaseRoadmapView.tsx`
- `src/components/plan/SafeRescheduleModal.tsx`
- `src/views/PlanView.tsx`

### 9.3 Implementation Tasks
- [ ] **Task 9.1: Multi-View Segmented Navigation**
  Tabs to switch between **Day**, **Week**, **Month**, and **Roadmap** views.
- [ ] **Task 9.2: Month Calendar Grid (`MonthCalendar.tsx`)**
  - Visual status indicators: Completed (teal), Partially completed (blue), Future planned (neutral), Planned rest day (warm amber `Rest`), Missed tasks (muted outline).
  - High-visibility accent ring on today's date.
- [ ] **Task 9.3: Phase Roadmap Explorer (`PhaseRoadmapView.tsx`)**
  - Visual timeline of the 8 phases from 22 Sep to 31 Dec 2026.
  - Shows phase exit criteria and milestone completion status.
- [ ] **Task 9.4: Safe Rescheduling Modal (`SafeRescheduleModal.tsx`)**
  - Allows shifting tasks forward.
  - Displays safety warnings: *"Cannot place 2 backlog videos on one day"*, *"17–21 Oct is protected festival rest"*.
  - Suggests moving core tasks to the nearest buffer day (e.g., 28 October).

### 9.4 Verification & Phase Exit Gate
- Attempt to reschedule a backlog video to a day already holding a video $	o$ verify warning prevents action.
- Verify 17–21 October renders in warm amber labeled `Rest` with zero study tasks.

---

## Phase 10: Curated Resource Directory (5 Segments & External Launchers)

### 10.1 Objective
Render the preloaded 62 canonical learning resources categorized into 5 dedicated segments, with direct deep-links opening externally in native apps/Safari, language badges, and broken link reporting.

### 10.2 Target Files
- `src/components/resources/ResourceCard.tsx`
- `src/components/resources/ResourceSegments.tsx`
- `src/components/resources/BrokenLinkModal.tsx`
- `src/views/ResourcesView.tsx`

### 10.3 Implementation Tasks
- [ ] **Task 10.1: Segmented Resource Browser (`ResourceSegments.tsx`)**
  Top segment selector:
  1. **Videos** (CodeWithHarry, CampusX, Corey Schafer, StatQuest, 3Blue1Brown, freeCodeCamp)
  2. **Notes & Official Docs** (Scikit-Learn guides, Pro Git, Google ML Crash Course)
  3. **Practice** (LeetCode 75, Programming Skills, Kaggle Learn)
  4. **Jobs & Applications** (Microsoft, NVIDIA, Foundit, LinkedIn, Internshala, Wellfound, Naukri, Unstop)
  5. **My Saved Links** (User custom bookmarks)
- [ ] **Task 10.2: Resource Card Component (`ResourceCard.tsx`)**
  - Render title, channel/provider, topic, language tag (Hindi/Hinglish vs. English), primary vs backup badge.
  - Direct external launcher opening with `target="_blank" rel="noopener noreferrer"`.
  - YouTube links configured to open directly in YouTube/Safari without forced autoplay.
- [ ] **Task 10.3: Broken Link Reporting (`BrokenLinkModal.tsx`)**
  - Displays `"Link last verified: 21 September 2026"`.
  - Allows user to report broken links and provide alternative custom URLs.

### 10.4 Verification & Phase Exit Gate
- Click YouTube resource $	o$ verify it launches externally without trapping the user inside an iframe.
- Search resources by keyword "pipeline" $	o$ verify instant filtering across Scikit-learn docs and videos.

---

## Phase 11: Progress Analytics Dashboard, 0–25 Backlog Counter & 31 Dec Scorecard

### 11.1 Objective
Build the comprehensive progress analytics screen: 7-day focused minutes bar chart, calendar heatmap, strict 0–25 Masai backlog counter, and the interactive 31 December Readiness Scorecard.

### 11.2 Target Files
- `src/components/progress/WeeklyMinutesChart.tsx`
- `src/components/progress/CalendarHeatmap.tsx`
- `src/components/progress/BacklogCounterCard.tsx`
- `src/components/progress/ReadinessScorecard.tsx`
- `src/views/ProgressView.tsx`

### 11.3 Implementation Tasks
- [ ] **Task 11.1: 7-Day Focused Minutes Bar Chart (`WeeklyMinutesChart.tsx`)**
  - SVG/Canvas responsive bar chart showing focused study time per day.
  - Accessible text summary table below chart for screen readers.
- [ ] **Task 11.2: Calendar Heatmap (`CalendarHeatmap.tsx`)**
  - Heatmap showing consistency.
  - Planned rest days (Puja) are rendered in warm amber and strictly excluded from missed-day statistics.
- [ ] **Task 11.3: Masai Backlog Counter Card (`BacklogCounterCard.tsx`)**
  - Displays progress from `0/25` to `25/25` completed videos.
  - Counts only distinct completed backlog lesson numbers (1 to 25).
  - Reopening and re-completing a task never double-counts.
- [ ] **Task 11.4: 31 December Readiness Scorecard (`ReadinessScorecard.tsx`)**
  - Interactive evaluation checklist with all 12 readiness dimensions:
    Masai Backlog, Daily Practice, Python, Data/Pandas, SQL, ML Pipelines, One-Hot Encoding, Git, Portfolio Projects, DSA, Mock Interviews, Applications.
  - Options: `Ready` vs `Repair`.

### 11.4 Verification & Phase Exit Gate
- Check off backlog video #1 $	o$ verify backlog counter updates from 0/25 to 1/25.
- Uncheck video #1 $	o$ verify counter decrements cleanly back to 0/25.
- Verify 7-day chart updates immediately upon completing a study timer session.

---

## Phase 12: Settings, Life Constraints & Data Backup/Restore

### 12.1 Objective
Build the user settings view for configuring weekly college days, teaching blocks, gym routine, notification preferences, Groq API key overrides, and one-tap JSON/Markdown backup and restoration.

### 12.2 Target Files
- `src/components/settings/CollegeScheduleConfig.tsx`
- `src/components/settings/LifeBlocksConfig.tsx`
- `src/components/settings/AISettingsConfig.tsx`
- `src/components/settings/BackupRestoreCard.tsx`
- `src/services/export/jsonExporter.ts`
- `src/services/export/markdownExporter.ts`
- `src/views/SettingsView.tsx`

### 12.3 Implementation Tasks
- [ ] **Task 12.1: College & Life Constraints Configuration**
  - Day selector for 3 weekly college days (default: Mon, Wed, Fri).
  - Time pickers for 1.5-hour teaching block and morning gym block.
  - Festival dates selector (defaults to 17–21 Oct 2026).
- [ ] **Task 12.2: Groq AI Settings (`AISettingsConfig.tsx`)**
  - View configured API key (masked) with ability to input custom key.
  - Model selection toggle (`llama-3.3-70b-versatile` vs `llama-3.1-8b-instant`).
- [ ] **Task 12.3: One-Tap JSON Full Database Exporter (`jsonExporter.ts`)**
  - Serializes all IndexedDB stores (`user_profile`, `study_days`, `study_tasks`, `study_sessions`, `notes`, `resources`, `revision_items`, `application_records`) into a timestamped JSON file (`kavya_studyos_backup_YYYYMMDD.json`).
- [ ] **Task 12.4: Consolidated Markdown Exporter (`markdownExporter.ts`)**
  - Compiles all study notes, reflections, and error logs into a structured Markdown document.
- [ ] **Task 12.5: JSON Backup Importer with Validation**
  - Validates imported JSON against TypeScript schema before writing to IndexedDB.
- [ ] **Task 12.6: Local Data Reset with Double-Confirmation Modal**
  - Allows resetting to original seed state with explicit confirmation.

### 12.4 Verification & Phase Exit Gate
- Change college days to Tue/Thu/Sat $	o$ verify Today dashboard adapts day category pills.
- Export JSON $	o$ clear browser storage $	o$ import JSON $	o$ verify 100% data recovery.

---

## Phase 13: Vitest Test Suite, iPhone 16 WebKit Audit, Lighthouse & Production Deploy

### 13.1 Objective
Execute automated tests, conduct the iPhone 16 portrait viewport audit, run Lighthouse PWA verification, and deploy the production build to static hosting.

### 13.2 Target Files
- `tests/unit/recommendationEngine.test.ts`
- `tests/unit/spacedRevisionEngine.test.ts`
- `tests/unit/timerReconstructor.test.ts`
- `tests/unit/rescheduleEngine.test.ts`
- `tests/component/VideoSubtaskGate.test.tsx`
- `tests/component/Checkbox.test.tsx`

### 13.3 Implementation Tasks
- [ ] **Task 13.1: Run Vitest Unit & Component Test Suite**
  ```bash
  npm run test
  ```
  Ensure 100% pass rate across engine algorithms and subtask gates.
- [ ] **Task 13.2: iPhone 16 WebKit Viewport & Safe-Area Audit**
  - Verify container padding matches `max(16px, env(safe-area-inset-top))` and `calc(12px + env(safe-area-inset-bottom))`.
  - Ensure bottom tab navigation sits cleanly above the iOS home indicator bar.
  - Verify all touch targets exceed 44×44 CSS pixels.
- [ ] **Task 13.3: Offline & Service Worker Verification**
  - Set browser network to "Offline".
  - Navigate through Today, Plan, Timer, Notes, and Resources.
  - Verify zero network errors and full app shell caching.
- [ ] **Task 13.4: Production Build & Deployment**
  - Run `npm run build`.
  - Deploy static `/dist` directory to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

### 13.4 Verification & Phase Exit Gate
- Lighthouse PWA score = 100%.
- App installs to iPhone Home Screen and opens in fullscreen standalone mode.
- Groq AI recall questions and error diagnostics generate reliably.

---

## Master Implementation Verification Matrix

| Phase | Core Deliverable | Acceptance Benchmark | Status |
| :---: | :--- | :--- | :---: |
| **Phase 1** | Scaffolding & Mobile PWA Shell | Valid manifest, safe-area layout, dark theme `#0a0f1d` | [ ] Pending |
| **Phase 2** | Seed Data & IndexedDB Layer | 101 days, 500 tasks, 62 resources preloaded locally | [ ] Pending |
| **Phase 3** | State Stores & Business Engines | Recommendation priority & spaced revision tests pass | [ ] Pending |
| **Phase 4** | Today Dashboard & Checklist | Sub-200ms check animation, 5s undo toast, hero card | [ ] Pending |
| **Phase 5** | Video Subtask Gate & Spaced UI | Backlog video locked until all 6 subtasks checked | [ ] Pending |
| **Phase 6** | Screen-Lock Resilient Timer | Zero clock drift across iOS sleep/lock cycles | [ ] Pending |
| **Phase 7** | Notes Editor & Error Log | $\ge 16	ext{px}$ font, 500ms debounced autosave, `#error_log` | [ ] Pending |
| **Phase 8** | Groq AI Engine Integration | Llama-3.3/3.1 sub-second recall quiz & error diagnosis | [ ] Pending |
| **Phase 9** | Plan Calendar & Safe Reschedule | Buffer routing, no double backlog videos, Puja rest | [ ] Pending |
| **Phase 10**| Curated Resource Directory | 5 segments, YouTube external launch, broken link tool | [ ] Pending |
| **Phase 11**| Progress Analytics & Scorecard | 7-day chart, 0-25 backlog counter, 12-item scorecard | [ ] Pending |
| **Phase 12**| Settings & Data Portability | College/life blocks config, 1-tap JSON/MD backup | [ ] Pending |
| **Phase 13**| Testing, Audit & PWA Deploy | 100% PWA score, Vitest pass, iOS standalone deploy | [ ] Pending |

---
*End of Phase-Wise Implementation Blueprint.*
