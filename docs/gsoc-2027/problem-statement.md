# Kavya StudyOS — GSoC 2027 Preparation Hub

**Developer handoff for Antigravity · Research checked 11 October 2026**  
**Owner:** Kavya Shaw · B.Tech CSE, AI/ML specialization · Graduation: 2028  
**Existing application:** https://kavya-study-os.vercel.app/  
**Preparation begins:** 21 October 2026 · **Timezone:** Asia/Kolkata  
**Deliverable requested now:** this implementation specification. Implement the section later inside the existing app; do not build a separate replacement website.

## 1. Copy this instruction into Antigravity first

You are a senior engineer working in my existing Kavya StudyOS repository. Read this entire file before editing. Add a separate, fully functional **GSoC 2027** preparation hub with the curriculum, verified resource links, organization research, daily checklists, timer, notes, contribution tracker, proposal workspace, calendar and progress described below.

Inspect the current checkout before making changes and report the stack, navigation, database and proposed file changes. Preserve the existing AI/ML roadmap, its progress, Masai coursework, notes, settings, timer and other features. This request is additive and overrides the earlier instruction to reset the AI/ML roadmap. Do not replace the existing root `PROBLEM_STATEMENT.md`; keep this specification under `docs/gsoc-2027/problem-statement.md` when integrating it.

Use the current visual system, fonts, spacing, components and mobile navigation. Keep the product name **Kavya StudyOS**. The new section should feel native to the app on an iPhone 16. Use the existing installed stack and remain static-deployable on Vercel. No required login, backend, paid service or GitHub token.

Implement in small steps, report changes, test persistence and date logic, run the production build, and provide a local preview. Do not push or deploy until I approve the finished changes. Ask only for information that actually blocks implementation, with all questions in one message.

## 2. The problem this section solves

Kavya knows some Python and AI/ML concepts, but wants to learn Git, GitHub and open-source contribution properly from the beginning. Generic GSoC videos leave too many decisions unresolved: which repository to choose, what to do each day, when to stop watching tutorials, how to respond to reviews, and how to write a proposal that matches a real project's needs.

The hub must turn preparation into small, evidence-backed actions. Every planned day must say what to learn, what to practice, what resource to open, and what proves the work is finished. Progress should reflect work done and understanding gained. Opening a video, making a fork or submitting a proposal must never be shown as selection or successful completion of GSoC.

The practical goal is to become a useful contributor in one community and submit a technically credible, mentor-informed proposal when the official 2027 application window opens. Selection depends on the organization, project fit, proposal quality, available slots and the program's rules. No dashboard score or roadmap can guarantee acceptance.

### Personal constraints

- College three days per week, teaching about 1.5 hours daily, morning gym, and ongoing Masai/IIT Patna AI/ML coursework.
- Earlier availability was about 5.5 total study hours/day. GSoC time comes **from that total**, rather than adding another 5.5 hours.
- Suggested GSoC allocation: 60–90 minutes on college days; 120–150 minutes on other days. The detailed calendar uses a 90-minute core block and a 30-minute weekly review. Add an optional 30–60 minute coding extension when time permits.
- Actual college weekdays, exams and leave dates are not known. Make them editable. Do not invent dates for Durga Puja, Diwali or college exams. Before 21 October, show a start countdown and optional setup only.
- Reuse Python/NumPy/testing learned in the AI/ML track. Allow a task to reference shared knowledge, but do not automatically mark either track complete or double-count the same study session.

## 3. Verified program facts and date policy

As checked on **11 October 2026**, the official timeline page still identifies its dated schedule as **2026**. A confirmed 2027 timeline and accepted 2027 organization list were not found. Keep every official 2027 date `null` until a primary source publishes it.

GSoC is an online, stipend-supported open-source contributor program, **not employment or a Google internship**. Under the current FAQ, applicants must be 18+ at registration and satisfy the other eligibility requirements. Projects currently have approximately 90, 175 or 350 hours of scope. The current FAQ permits up to three proposals, with at most one accepted. Recheck the 2027 rules before applying. [Official FAQ][o02]

Use the official timeline's general sequence only for planning: organization applications early in the year, organization announcements around February, contributor proposals around March/April, then results, bonding and coding around May/June. These are planning windows, not confirmed 2027 deadlines. Do not copy 2026 dates forward by one year. [Official timeline][o03]

The dated curriculum below runs **21 October 2026–31 May 2027: 223 calendar targets in 32 weekly blocks**. The final block has six days. This is a preparation horizon, not an assertion that coding begins on 31 May. Once coding-start is announced, end the preparation view at that event and retain unfinished preparation as optional work. If the official start is later, repeat the maintenance cycle described in Section 10.

### Two separate kinds of date

| Date kind | Storage | Display | Can catch-up move it? |
| --- | --- | --- | --- |
| Personal study target | `YYYY-MM-DD`, interpreted as an Asia/Kolkata civil date | “Preparation target” | Yes, with a preview |
| Official event | ISO timestamp with explicit offset, source URL and checked date | “Official”, shown in IST and original timezone | No |
| Estimated window | Month/range text, exact date `null` | “Estimate · awaiting announcement” | No countdown |

Initialize `organizationAnnouncement`, `applicationOpen`, `applicationDeadline`, `resultsAnnouncement`, `bondingStart` and `codingStart` to `null`. Do not display a fabricated countdown, a “2027 accepted org” badge or a confirmed stipend amount.

Include a **Check official updates** button that opens [the timeline][o03]. A local settings form can record an announced date, source URL and `verifiedAt`; saving does not claim Google has verified the user's input. No scraping or background polling is needed for the first implementation.

## 4. Existing project inspection and integration plan

Inspection snapshot: repository `kavya0704/kavya-study-os`, local commit **43f077f**. This is a focused integration inspection, not a claim to have audited every source line. Antigravity must inspect the latest checkout because it may differ.

| Area | Observed implementation | Implication |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite 6 | Add typed React views; no framework migration |
| Styling/icons | Tailwind 3, Lucide, existing common components | Reuse visual tokens and tap components |
| State | Zustand stores | Add a GSoC store; keep AI/ML stores intact |
| Storage | `idb`, IndexedDB `kavya_studyos_db`, version 1 | Prefer an isolated GSoC database to avoid destructive upgrades |
| Navigation | `src/App.tsx` uses `activeTab`; five visible bottom tabs: Today, Plan, Timer, Resources, Progress | Keep five tabs; add GSoC entry inside Plan and a Today shortcut |
| Curriculum | `src/data/seeds/{days,tasks,phases,resources}.json`; snapshot still describes 101 days | Do not edit/delete these for this request |
| Dates | `src/engines/dateUtils.ts` clamps “today” to the old roadmap's September–December range | GSoC must use an unclamped date helper |
| Timer | `src/stores/useTimerStore.ts`, `src/types/timer.ts`; task-linked session API | Extend with a backward-compatible track discriminator |
| Backup | Existing JSON export targets the original database and version 1 | Add a separate GSoC export/import contract |
| PWA | Manifest and Vite PWA setup already present | Retain offline shell and safe-area behavior |
| Theme | Inspected components use light slate/blue classes; older brief described a dark theme | Match the current checkout's actual theme. Do not introduce a redesign |

### Add these files or equivalent small modules

| Proposed file | Responsibility |
| --- | --- |
| `docs/gsoc-2027/problem-statement.md` | This developer specification |
| `src/data/gsoc2027.ts` | Single canonical source: configuration, phases, weeks/days, resources, organizations, milestone templates |
| `src/types/gsoc.ts` | Track, task, organization, contribution, proposal and progress types |
| `src/services/db/gsocDb.ts` | Isolated versioned GSoC database and transactions |
| `src/services/export/gsocBackup.ts` | Validated JSON backup/restore; Markdown proposal/journal export |
| `src/stores/useGsocStore.ts` | Loading, task progress, settings, notes, contributions, proposal drafts |
| `src/engines/gsocDateUtils.ts` | IST dates, generated weekly calendar, countdowns and official-event conversion |
| `src/engines/gsocProgress.ts` | Task completion, milestones, study time and meaningful contribution metrics |
| `src/engines/gsocReschedule.ts` | Preview-based catch-up, capacity limits, fixed-deadline protection |
| `src/views/GsocView.tsx` | Section container and internal navigation |
| `src/components/gsoc/*` | Today card, roadmap, day detail, resource library, org cards, contribution board, proposal editor, progress and settings |
| Focused tests for dates/storage/timer | Verify the risks listed in Section 14 |

### Modify only for integration

- `src/App.tsx`: render/lazy-load GSoC; handle its deep link; connect the shared timer's track-aware target.
- `src/components/layout/BottomNav.tsx`: add `gsoc` to the navigation union and normalize its active highlight to Plan; retain the five visible buttons.
- `src/views/PlanView.tsx`: add a clear “AI/ML plan / GSoC 2027” track entry or selector. Switching must not change the other track's selected date/progress.
- `src/views/TodayView.tsx`: compact “GSoC 2027 · next action” shortcut, using independent state. Avoid adding all GSoC tasks to the AI/ML list.
- `src/types/timer.ts`, `src/stores/useTimerStore.ts`, and timer callers only as needed: add optional `trackId` with default legacy behavior; route GSoC sessions to its database.
- `src/views/SettingsView.tsx`: add GSoC-only backup/reset controls and capacity settings, or link to the section's own settings sheet.

**Files to delete: none. Existing databases/keys to clear: none.** Never call `localStorage.clear()`, delete the original database, reseed the AI/ML roadmap or use the old whole-app reset when the user chooses “Reset GSoC”.

## 5. Organization shortlist and how to choose

These are open-source communities/projects, not a list of companies offering Google jobs. The historical ideas pages below are **2026 research references**. None is marked as a confirmed 2027 participant.

My recommendation for Kavya: explore **DIPY** and **PyTorch-Ignite** after the foundation block, then choose one main project by the end of November. DIPY is attractive if scientific imaging and NumPy are interesting; Ignite is attractive if training loops and PyTorch are becoming comfortable. **Matplotlib** and **Open World Holidays** are alternatives. Treat **OpenCV** as a stretch choice until the relevant C++/build prerequisites are met.

These recommendations are an inference from your Python/AI interests and each project's published requirements, not a claim about acceptance odds or mentor availability.

| Project and historical umbrella | Why consider it | Prerequisites and first useful experiment | Historical requirement or caveat | Verified entry links |
| --- | --- | --- | --- | --- |
| **DIPY — PSF 2026** | NumPy, scientific computing, imaging, testing and benchmarks connect to AI/ML | Run a small documented example; trace its inputs/outputs; execute a focused test. Learn required imaging concepts before attempting algorithm work | 2026 guidance expects Python/NumPy data analysis. It suggests a small enhancement, bug fix or documentation improvement before applying | [Repository][r01] · [Contributing][r02] · [Issues][r03] · [2026 ideas][r04] |
| **PyTorch-Ignite — NumFOCUS 2026** | Deep learning training/evaluation utilities; close fit with a PyTorch learning track | Run the official getting-started example on CPU or a small synthetic dataset; explain Engine, Events, metric and trainer/evaluator | **2026 ideas page required at least three accepted PRs.** Recheck 2027 instructions. This is not a universal GSoC rule. A large LLM/GPU project is not a beginner prerequisite | [Repository][r05] · [Contributing][r06] · [Issues][r07] · [Tutorial][r08] · [2026 idea][r09] |
| **Matplotlib — NumFOCUS 2026** | Python/NumPy plotting; useful examples, documentation, testing and reproducibility skills | Create one plot with labelled axes; locate the example's source and test/development workflow | Core/backend or GUI work can have substantial prerequisites. Read the actual idea before selecting a project | [Repository][r10] · [Contribute][r11] · [Issues][r12] · [2026 ideas][r13] |
| **Open World Holidays / `vacanza/holidays` — PSF 2026** | Pure Python, calendar logic and tests; practical connection to StudyOS scheduling | Install it, compute a small calendar, inspect a relevant country/entity class and its tests | Less directly AI-focused. Holiday/date changes require trustworthy sources and repository rules; never guess a holiday rule | [Repository][r14] · [Contribute][r15] · [Issues][r16] · [2026 ideas][r17] |
| **OpenCV — its own historical GSoC community** | Computer vision, image processing and model integration | Run a Python image-processing example and examine the exact idea's required languages/build system | 2026 page says work is C++ unless noted otherwise. Do not assume Python usage alone prepares you for an OpenCV core proposal | [Repository][r18] · [Contribute][r19] · [2026 ideas][r20] |

Historical umbrella directories: [PSF's 2026 ideas][o10] and [NumFOCUS's 2026 ideas][o11]. A subproject under an umbrella is not necessarily a separately listed mentoring organization. Use the actual 2027 organization and submission instructions when announced.

### Run a practical selection test

During Weeks 5–6, evaluate two candidates in depth, with a maximum of one lightweight backup. For each:

1. Read README, license, code of conduct, CONTRIBUTING, development setup, current issues and two recently reviewed PRs.
2. Run one example and one relevant test. Record OS, Python version, install commands, commit SHA and any reproducible failures.
3. Find a small, unclaimed task you can explain. Confirm it is still open and that the maintainers welcome the change. A label is an invitation to investigate, not a reserved assignment.
4. Write a short code map: entry point → core function/class → test → documentation.
5. Check the project's public communication channel and response/review patterns. Record your observations with dates; do not invent a “responsive mentor” score.
6. Score project fit using the table below, then select one main repository. Keep the backup on a light watch list instead of doing three codebases every day.

| Criterion | Weight | Evidence required |
| --- | --- | --- |
| Interest in the actual users/problem | 25% | Explain who benefits and how |
| Can run and understand a small part | 25% | Working example and test log |
| Skill/prerequisite fit | 20% | Compare actual idea requirements to demonstrated skills |
| Contribution workflow and guidance | 20% | CONTRIBUTING, relevant issues and observed review process |
| Feasible summer scope/time | 10% | Honest availability and small/medium/large scope comparison |

This score compares **fit**, never selection probability. In February, verify whether the main project participates in 2027. If not, activate the prepared backup and reuse transferable Git/testing skills. Update the plan explicitly, preserving all contribution history.

## 6. What past contributors and maintainers actually teach us

### Case A — Shilpi Prasad, DIPY 2023

In her own DIPY post, Shilpi described moving from Python/ML into a new scientific domain, using the documentation, submitting a feature PR and revising it through review. She wrote that time was limited, so she concentrated on understanding the topic and improving the proposal rather than generating many PRs. Her post links the actual implementation PR. [First-person account][c01] · [PR #2749][c02]

**Apply this lesson:** keep a code map and explain a real change; give reviews time; request proposal feedback early. Her individual result does not establish a universal PR count or shortcut.

### Case B — Tomás Guija Valiente, DIPY 2026

His introduction describes a 90-hour similarity-metrics project and bonding work involving mentor conversations, the development workflow and a more concrete implementation plan. His background was already specialized in mathematics/computer science and medical-imaging AI. [First-person account][c03]

**Apply this lesson:** scope can be focused; clarify it with mentors. Do not compare your current beginner stage to an experienced researcher's technical preparation. Choose a tractable idea and show evidence that you can execute it.

### Maintainer evidence — quality and project-specific rules

Wagtail's published contributor guide explicitly favors understanding, communication and a few strategic, high-quality contributions over quantity. Ignite's 2026 guide separately states its three-accepted-PR prerequisite. Together, these demonstrate why this hub needs both a quality checklist and a per-organization requirements record. [Wagtail guide][c04] · [Ignite requirement][r09]

These are researched examples, not personal GSoC experience claimed by the author of this plan. The roadmap recommendations are our synthesis; the factual experiences remain attributed to their authors.

## 7. English resource library — curated starting set

All listed YouTube URLs were opened successfully through their pages or official source links during this research. Most returned title/metadata rather than a playable video. **Playback, regional availability, captions and every minute of content were not tested.** Do not label them “guaranteed working”. Resource pages can change after 11 October 2026.

Several foundational courses are older because Git, Python and testing concepts remain useful. Pair them with current official docs for authentication, dependency versions and repository commands. For GSoC rules/dates, use official written guidance even when a video gives a different answer.

Video runtime and assigned study time are different fields. Only use a runtime exposed by a primary source. “About 1 hour” is approximate. Store unknown exact seconds as `null`, and display “Duration not available”. Do not invent runtimes, timestamps, engagement numbers or playlist indices.

### YouTube courses and playlists

| ID | Resource, educator and language | Use in this plan | Runtime verification |
| --- | --- | --- | --- |
| V01 | [So you want to be a Google Summer of Code Contributor?][v01] — official GSoC-linked video; English | Orientation and application concepts. Older video; current FAQ overrides old rules | Exact runtime not exposed: `null` |
| V02 | [Git & GitHub Crash Course 2025][v02] — Traversy Media; English | Main Git course: working tree, stage, commits, branches, remotes, conflicts and collaboration. Watch only the named section assigned | Exact runtime not exposed: `null` |
| V03 | [Git and GitHub for Beginners — Crash Course][v03] — freeCodeCamp / Gwen Faraday; English | Alternative explanation if V02 is unclear. Do not watch both courses end-to-end | Exact runtime not exposed: `null` |
| V04 | [Complete Guide to Open Source — How to Contribute][v04] — freeCodeCamp / Eddie Jaoude; English | Issues, PRs, project etiquette and contribution workflow | 41:52 listed in freeCodeCamp's resource guide; `durationSeconds: 2512` |
| V05 | [Command Line Basics for Beginners — Full Course][v05] — freeCodeCamp / Scrimba; English; 2026 | Terminal, folders, paths, navigating and reading files | Publisher calls it about 1 hour; exact seconds `null` |
| V06 | [Python Full Course for free][v06] — Bro Code; English; 2024 | Selective Python revision. Functions, collections, OOP, exceptions and files; skip GUI/game detours | Exact runtime not exposed: `null` |
| V07 | [Python Tutorials playlist][v07] — Corey Schafer; English | Optional deeper explanation of one weak Python topic; use named lessons | Total and playlist ordering not verified: `null` |
| V08 | [Pytest Tutorial — How to Test Python Code][v08] — freeCodeCamp / Farhan Ali; English | Tests, fixtures, parametrization and mocks. Skip the AI-testing add-on unless relevant and permitted | Publisher calls it about 2 hours; exact seconds `null` |
| V09 | [Unit Testing with the unittest Module][v09] — Corey Schafer; English | Optional when the chosen repository uses unittest | Exact runtime not exposed: `null` |
| V10 | [Python NumPy Tutorial for Beginners][v10] — freeCodeCamp / Keith Galli; English | Arrays, shapes, indexing, broadcasting, copies and numerical assertions | Publisher calls it about 1 hour; exact seconds `null` |
| V11 | [Complete Python Pandas Data Science Tutorial][v11] — Keith Galli; English | Optional tabular-data practice if the selected project needs pandas | Exact runtime not exposed: `null` |
| V12 | [Matplotlib: Creating and Customizing Our First Plots][v12] — Corey Schafer; English | Main plotting introduction and a reproducible example | Exact runtime not exposed: `null` |
| V13 | [Matplotlib Tutorials playlist][v13] — Corey Schafer; English | Optional selected plot type for the Matplotlib branch | Total/ordering not verified; use titled parts, not invented ranges |
| V14 | [PyTorch for Deep Learning & Machine Learning — Full Course][v14] — freeCodeCamp / Daniel Bourke; English | Only for Ignite/ML project needs: tensors, autograd, training/evaluation, data loaders. Work alongside [the author's free notebooks][d10] | Author calls it a 26-hour course; exact seconds `null` |
| V15 | [Machine Learning for Everybody — Full Course][v15] — freeCodeCamp / Kylie Ying; English | Optional review of splits, metrics and classification/regression when these are weak | Exact runtime not exposed: `null` |
| V16 | [GitHub Actions Certification — Full Course][v16] — freeCodeCamp / Andrew Brown; English; 2024 | Selected workflows/jobs/runners/CI lessons. No certification exam needed | Publisher calls it about 3 hours; exact seconds `null` |

### Study rules for these resources

- Normal day: at most 25–30 minutes of learning input, about 45–50 minutes of practice, 10–15 minutes of recall/notes. Repository work gradually replaces video time.
- Watch → close the tutorial → perform the action from memory → compare → record the error. A watched checkbox and a practiced checkbox are separate.
- The daily appendix names the section to use. A 26-hour course is not a one-day assignment. Stop at the day's learning objective.
- For playlists V07/V13, store `lessonTitle` and `videoRange: null` until the live order is verified. Single-video links and named topics avoid guessing “videos 5–12”.
- Broken or removed resource: keep the title, show “Unavailable / recheck”, and provide `https://www.youtube.com/results?search_query=` plus `encodeURIComponent(title + ' ' + channel + ' English')`. This is a search fallback, not a verified tutorial.

### Official documentation and interactive practice

| ID | Verified resource | Use |
| --- | --- | --- |
| D01 | [GitHub Hello World][d01] | Repo → branch → commit → PR → merge practice |
| D02 | [GitHub's open-source contribution walkthrough][d02] | Real contribution workflow and review |
| D03 | [Pro Git, free official book][d03] | Branches, remotes, conflicts, undoing and reference |
| D04 | [Connecting to GitHub with SSH][d04] | Current authentication guidance; never commit private keys |
| D05 | [First Contributions practice repository][d05] | One beginner workflow exercise; classify it as practice, not a target-org contribution |
| D06 | [GitHub Open Source Guide][d06] | Reading projects, useful changes and etiquette |
| D07 | [Python tutorial][d07] · [virtual environments][d08] | Follow the selected project's supported Python version rather than assuming the latest |
| D09 | [pytest getting started][d09] | Exact test commands and current API |
| D10 | [Learn PyTorch notebooks/course material][d10] | Optional Ignite prerequisite path |
| D11 | [NumPy absolute basics][d11] | Array reasoning and current docs |
| D12 | [GitHub Actions quickstart][d12] | One small test workflow in your practice repository |
| R08 | [Ignite getting started][r08] | Project-specific training/evaluation example; same canonical resource as the organization card |
| R11 | [Matplotlib developer guide][r11] | Project setup, documentation and tests; reuse the existing resource ID |
| R15 | [holidays contribution guide][r15] | Project-specific tests and source requirements; reuse the existing resource ID |

### Official GSoC links, always visible in the hub

| ID | Link | Purpose |
| --- | --- | --- |
| O01 | [GSoC home][o01] | Official entry point and eventual registration |
| O02 | [FAQ][o02] | Current eligibility, project sizes and program explanation |
| O03 | [Timeline][o03] | Confirmed event dates; keep 2027 fields empty until announced |
| O04 | [Program rules][o04] | Recheck the edition that applies when registering |
| O05 | [Contributor guide][o05] | Preparation, community, proposals, mentors and evaluations |
| O06 | [Choosing an organization][o06] | Match interests and ability to project needs |
| O07 | [Making first contact][o07] | Appropriate community introduction |
| O08 | [Writing a proposal][o08] | Structure and project-specific expectations |
| O09 | [Communication best practices][o09] | Clear questions and regular progress updates |
| O10 | [PSF 2026 ideas][o10] | Historical Python subproject exploration |
| O11 | [NumFOCUS 2026 ideas][o11] | Historical scientific/PyTorch projects |
| O12 | [AI guidance][o12] | Organization policies apply; proposal/code must be understood and comply |
| O13 | [Being turned down][o13] | Productive continuation if not selected |

## 8. Curriculum phases and concrete milestones

| Phase | Personal date targets | Focus | Evidence to produce |
| --- | --- | --- | --- |
| P1 — Git and collaboration | 21 Oct–3 Nov 2026 | Git/GitHub from zero, CLI, branches, remotes, conflicts, PR etiquette | Practice repo, conflict resolved, PR workflow repeated independently |
| P2 — Python contribution foundations | 4–17 Nov | Python/OOP revision, venv, tests, debugging, NumPy and docs | Small tested package; explain a regression test and an array example |
| P3 — Choose a community | 18 Nov–1 Dec | Two candidate trials, setup, code map, issue triage, main/backup decision | One running main repo, selected issue, requirements record |
| P4 — Become useful | 2 Dec–2 Feb 2027 | Scoped changes, regression tests, review, CI, domain learning | Evidence ledger of real useful changes and review responses; organization-specific prerequisites tracked |
| P5 — Find and scope an idea | 3 Feb–2 Mar | Technical exploration; verify official organization list when available | Current idea/mentor channel, working spike, project boundaries and risks |
| P6 — Prepare and submit | 3 Mar–6 Apr | Original proposal, feedback, milestones, availability, official submission | Reviewed draft and eventual actual submission confirmation; date bound to official window |
| P7 — Review and readiness | 7 Apr–4 May | Continue contributions, explain design, answer questions; results when announced | Mock explanation, maintained branch, honest outcome status |
| P8 — Bonding/start readiness | 5–31 May | If selected: align scope, setup, communication and first milestone. If not: continue the contribution plan | Mentor-agreed first work items or an open-source continuation plan |

All dates above are **your targets**. P5–P8 change order/dates to follow official events when announced. Proposal submission must be possible only as a user-recorded action after the official window opens; a study task must not automatically submit anything.

### Weekly operating rhythm

Each weekly block starts on Wednesday because the requested start date is Wednesday 21 October. These are movable tasks, not prescribed times of day.

| Slot | Default action after the foundation period | Core time |
| --- | --- | --- |
| A / Wednesday | Understand the issue/idea and read source | 90 min |
| B / Thursday | Reproduce behavior or write a failing test | 90 min |
| C / Friday | Implement one small coherent change | 90 min |
| D / Saturday | Tests, edge cases, documentation and optional extension | 90 min + optional 30–60 |
| E / Sunday | Inspect diff; prepare/update draft PR or proposal | 90 min + optional 30–60 |
| F / Monday | Address actual feedback; if none, work locally without pinging repeatedly | 90 min |
| G / Tuesday | Recall, contribution ledger, plan next week, catch-up buffer | 30 min |

Never impose a “one PR every week” submission quota. A difficult task can span weeks. Maintainer review/merging is outside your control. Use the next day's local action when blocked, and allow a meaningful issue reproduction or test investigation to be logged even without a merge.

### Learning boundaries — what to do and what to avoid

**Do:** Python, Git, terminal navigation, venv/dependencies, reading source, tests, debugging, documentation, reproducible examples, small PRs, review responses, clear technical English, and the chosen project's domain. Learn CI once you can run tests locally. Learn packaging conventions from that repo's actual `pyproject.toml` and development instructions.

**Avoid:** waiting to master all DSA before contributing; simultaneously learning unrelated C++, Kubernetes and LLM agents; collecting many forks or cosmetic PRs; changing formatting throughout a repository; sending unsolicited mentor DMs; asking “please assign me anything” before reading; copying old proposals; pretending that tests passed; or pushing AI-generated work you cannot explain. Do not force another full Python course when a short skill check proves the topic is already comfortable.

Keep DSA practice modest and relevant: dictionaries/sets, loops, array reasoning, complexity and algorithms used by the project. An open-source contribution is evaluated in its own context; there is no universal LeetCode threshold for GSoC.

## 9. Contribution workflow and communication templates

### First useful contribution, step by step

1. Use the package/product first. Read its contribution rules and current issue discussion.
2. Find a small, legitimate problem: incorrect example, missing test, reproducible bug, well-scoped enhancement, or a documentation gap confirmed by use. Documentation matters; do not manufacture low-value changes to inflate counts.
3. Search existing issues/PRs. If someone is already implementing it, collaborate or choose another task.
4. In the prescribed public channel, say what you tried and propose a bounded change. Wait for approval if the project's rules require it.
5. Fork and clone; add upstream; create a topic branch from the repository's documented default branch.
6. Install the supported environment; reproduce the issue; add a test that fails for the right reason; implement the smallest fix; rerun that test and relevant checks.
7. Review the diff for unrelated files, temporary data and secrets. Add docs/changelog only if required by that project.
8. Open a draft PR if feedback would help. Include problem, approach, tests actually run, issue link, limitations and screenshots only where useful.
9. Respond to review calmly. Ask when unclear; make corrections; update tests; summarize what changed. Do not mark conversations resolved until addressed.
10. Record the URL/status and lessons. Submitted, merged and closed are distinct outcomes. A closed PR still has learning value.

### Commands to learn — use only in a practice fork initially

```bash
git --version
git config --global user.name "Kavya Shaw"
git config --global user.email "YOUR_GITHUB_VERIFIED_EMAIL"
git clone YOUR_FORK_URL
git remote -v
git remote add upstream UPSTREAM_REPOSITORY_URL
git fetch upstream
git switch -c fix/short-description upstream/DEFAULT_BRANCH
git status
git diff
git add path/to/changed-file
git diff --staged
git commit -m "Fix concise description of the problem"
git push -u origin fix/short-description
```

`YOUR_FORK_URL`, `UPSTREAM_REPOSITORY_URL` and `DEFAULT_BRANCH` are explicit placeholders, not commands to paste unchanged. Follow the chosen repository's branch naming and commit conventions. Learn `restore`, `revert`, `stash`, merge and rebase in a disposable practice repository first. Never rewrite a shared branch blindly; do not use force-push on an upstream default branch.

### Introduction draft — personalize before posting yourself

> Hi, I'm Kavya, a B.Tech CSE student focused on AI/ML. I've followed the setup guide and run [example/test]. I'm exploring [specific component] because [reason]. I read issue [link] and reproduced [behavior] with [version/environment]. Would a small change covering [scope] be useful? I'll follow the contribution guidelines and include tests.

### Useful question format

> Goal: [what I am trying to do]. Environment: [OS, Python, commit]. Steps tried: [short list]. Expected: [result]. Actual: [result/error]. Relevant code/test: [link]. My current hypothesis: [reason]. Is [specific assumption] correct?

### Weekly update format

> This week: [implemented/investigated]. Evidence: [PR/test/code links]. Blocker: [specific issue and what I tried]. Next: [one concrete action]. Availability changes: [if relevant].

These are draft templates only. The app must never post, email or DM automatically. Contact mentors through the project's stated channel, not scraped personal addresses. Use the project's follow-up expectations; as a planning default, wait several working days before one polite follow-up, and continue local work in the meantime.

## 10. Proposal preparation and the decision period

Begin project research before the application window, but write the final proposal for the **actual 2027 idea and organization template**. Historical ideas are exploration material, not guaranteed projects that can be resubmitted unchanged.

### Proposal workspace sections

Create fields with autosave, word-count guidance only if the organization specifies it, and a Markdown export:

1. Title, selected organization/subproject, idea URL and contact channel.
2. Problem, users and why the project needs the change.
3. Current code architecture and relevant modules/functions.
4. Proposed approach, alternatives and why this approach fits the codebase.
5. Deliverables and explicit exclusions; divide MVP from optional stretch work.
6. Test/validation plan, reproducibility, performance only where relevant, and definition of success.
7. Timeline matched to actual project size and duration, with weekly deliverables and at least 15–20% planning buffer. Buffer recommendation is our planning guidance, not a Google requirement.
8. Dependencies, risks and fallback scope.
9. Relevant work: genuine PRs, reviews, reproductions, prototype links and what you personally did.
10. Availability: college, teaching, exams, travel and other commitments; honest weekly hours and timezone.
11. Communication plan, questions needing mentor input and post-program maintenance intentions.
12. Organization-specific template, AI policy, prerequisite checks and feedback log.

Use the [official proposal guide][o08] and your chosen organization's current template. This structure is an editable planning aid, not an AI-written proposal to submit as original work. Some organizations restrict AI assistance. Follow their policy and disclose help where required. [Official AI guidance][o12]

### Personal readiness checks

- I can explain the problem and source code without reading a generated script.
- I have run the project and at least one relevant test.
- My prototype/spike demonstrates the risky part or clearly records why it remains unresolved.
- My deliverables fit the chosen hours and my real summer availability.
- I have invited feedback through the prescribed channel and recorded any feedback received. A mentor is not obliged to review a draft or endorse me.
- I have checked the actual 2027 eligibility, template, organization-specific prerequisites and AI policy.
- I can follow the real official submission instructions. Uploading an attachment to this planner is not applying to GSoC.

### Submission procedure when the official window opens

Open [the official GSoC site][o01], use the current registration flow, read the rules, select the correct accepted organization, and submit through the official platform. Follow its current format/attachment requirements. Aim to finish several days before the real deadline to allow for upload/login problems. Set the app's personal reminder relative to the confirmed deadline, not an invented March date.

Record submission confirmation manually with date, organization, project and optional evidence. Never record `submitted` just because the draft is complete. Do not infer `selected` from mentor encouragement, a merged PR or proposal review.

### After submission

Continue focused contributions; prepare to explain the design, tests and trade-offs if the organization requests a discussion. Respect maintainer workloads. The app must support `awaiting_results`, `accepted`, `not_selected` and `withdrawn`, entered by the user with optional source/evidence.

If accepted, follow official bonding/start dates and agree on scope, meetings and evaluation expectations. If not selected, use [the continuation guidance][o13], ask for feedback appropriately and keep contributing to work you care about. Completed preparation and code evidence remain valuable; do not erase them or show failure warnings.

If coding begins after this calendar horizon, repeat a seven-day maintenance cycle: inspect open reviews → resolve a scoped issue → focused tests → documentation → demo → update/communication → light review. Once officially selected and coding starts, move to a mentor-agreed project plan rather than keeping this generic preparation calendar as the authority.

## 11. Required screens and phone behavior

Keep one **GSoC 2027** hub, with compact internal navigation: Today, Roadmap, Learn, Organizations, Contributions, Proposal, Calendar, Progress. Use a two-row chip grid or an accessible menu on narrow screens. Keep the app's existing bottom navigation usable; do not squeeze eight new items into it.

### Today

- Show actual IST date, preparation phase, next task and estimated minutes.
- Before 21 October: “Your GSoC preparation starts on 21 October · starts in N days”, optional setup resources.
- On/after start: a practical list of 3–5 steps with independent checkboxes, resource buttons, “Practice”, “Done when” and notes.
- “Start focus”, “Log time”, “Open resource”, “Save evidence” and “View tomorrow” are large buttons.
- Display current main organization and next **confirmed** deadline if known. Otherwise: “2027 dates awaiting announcement”.
- Separate planned minutes from actual study minutes. A completed checklist is not proof of spent time.
- Missing yesterday's task: offer “Resume earliest incomplete task” and “Review catch-up plan”. Do not shame the user or silently move official deadlines.

### Roadmap and day detail

- Eight expandable phase cards, target date range, progress and outcome checklist.
- Each day has date, title, phase, type (`learn`, `practice`, `contribute`, `proposal`, `review`, `buffer`, `rest`), learning input, practical task, completion criterion, resources, notes and evidence.
- The 223 dated rows in the appendix are editable targets. Preserve stable IDs when dates are moved.
- “Mark complete” records an actual timestamp. It should prompt for incomplete required steps and allow an explicit override with a note, rather than faking work.
- Reviews/buffers/rest are visually distinct. User-entered leave removes study obligations without erasing the tasks.
- Support a searchable date picker; never clamp to the AI/ML roadmap's end date.

### Learn/resource library

- English YouTube courses/playlists, official docs, interactive exercises, program guidance and contributor case studies in separate filters.
- Show title, educator/source, type, language, verified date, recommended segment, duration if known, “Open”, bookmark, personal notes and “Report broken link”.
- Resource status: `verified_metadata`, `needs_recheck`, `unavailable`, not “watched” as a substitute for learning.
- Open external links safely with `target="_blank" rel="noopener noreferrer"`. Default to links instead of loading many embeds; no autoplay.
- A day can attach multiple resources by ID. No duplicated hardcoded URLs scattered through components.

### Organizations

- Cards for the five projects in Section 5; clearly display historical 2026 status and unknown 2027 status.
- Fields: main/backup/exploring, repo, issue list, contributing guide, current ideas URL, umbrella, stack, prerequisite checklist, communication channel, research notes and observations.
- Add custom organization manually. Require a source and checked date for a `confirmed_2027` status.
- Show project-specific requirements: e.g. Ignite's historical three accepted PRs; update only after reviewing the new guide.
- Do not embed named mentors as promised availability. The official channel is the contact source.

### Contributions

- Board/list states: researching, reproduced, planned, in_progress, draft_pr, submitted, changes_requested, merged, closed, blocked.
- Record organization/repo, issue/PR URL, branch, task, tests actually run, test result, review feedback, next action, dates and learning notes.
- Distinguish practice-repository PRs from external target-project PRs.
- Quality checklist: scope accepted where required, reproducible problem, appropriate test, clean diff, docs as needed, understandable implementation, review response.
- No PR-count leaderboard or acceptance probability. Count merges descriptively and allow organization-specific prerequisites without claiming a universal quota.
- Manual status only initially; no GitHub API token or automatic submission. Provide an “Open GitHub” button.

### Proposal

- Use Section 10's fields with autosave, preview, version snapshots and Markdown/text export.
- Link each claim of past work to real evidence. Keep feedback/questions separate from final prose.
- Show current organization template/source, size, availability, MVP, stretch scope, risk log and deadline status.
- Submission tracker records user's actual action on the official platform. The app never claims to submit or get approval.

### Calendar and catch-up

- IST calendar with learning targets, actual session dates, personal leave and confirmed official events.
- Personal targets can shift; confirmed application/coding deadlines cannot.
- Preview changes before confirming: original/new dates, available capacity, blocked deadlines and tasks that no longer fit. If not enough time remains, suggest reducing optional lessons/scope, not cramming multiple days into one.
- Preserve completed IDs, actual completion timestamps, notes, partial checklists and historical session dates.
- “Skipped optional topic” differs from “completed”. Holiday/rest dates do not break a scheduled-task streak.
- If the user restarts after 21 October, show missed target dates and allow a deliberate restart/shift. Do not invent earlier study activity.

### Progress and settings

- Completed required preparation tasks / assigned required tasks; per-phase completion; actual tracked hours; weekly activity; milestones and blockers.
- Separate dimensions: learning, project setup, contributions, proposal readiness. Checklists are self-reported readiness, not an acceptance score.
- Streak counts days with actual work on scheduled active days; exclude planned rest/leave. Do not hardcode a streak or count today as missed before it ends.
- Capacity, college weekdays, holidays/exams, preferred resource, start-date changes, organization choices and official-date records are editable.
- “Export GSoC JSON”, “Import GSoC JSON”, “Export notes/proposal” and “Reset only GSoC progress” with confirmation and export offer.
- Explain local persistence simply: “Saved on this device. Export a backup before switching devices.” Do not imply cloud sync exists.

### Visual/accessibility requirements

Match the existing app: quiet cards, readable hierarchy, familiar checkboxes and restrained accent use. No new font or obligatory animation. Use at least 44×44 px tap targets, safe-area padding, bottom-nav clearance, visible focus states and readable contrast. Respect reduced motion; keyboard access and screen-reader labels for timers/progress/checklists. Avoid page-wide horizontal overflow at 320, 390 and 430 px widths. Wide data tables become stacked cards in the app.

## 12. Data, state and persistence contract

Keep canonical content in **one data file**, `src/data/gsoc2027.ts`. Export `GSOC_CONFIG`, `GSOC_PHASES`, `GSOC_WEEKS`, `GSOC_DAYS`, `GSOC_RESOURCES`, `GSOC_ORGANIZATIONS` and milestone templates from it. Helpers/types may live separately. Every screen reads these exports, never its own copy of the curriculum.

Use a new database such as **`kavya_studyos_gsoc_2027_v1`** with explicit `schemaVersion: 1` and `curriculumVersion: '2027-prep-2026-10-11'`. Keep this separate from the existing AI/ML database. Immutable canonical data is not overwritten by imports; progress/settings/evidence are mutable.

```ts
type CivilDate = string; // validated YYYY-MM-DD
type TrackId = 'aiml' | 'gsoc2027';
type OfficialEventKey = 'organizationAnnouncement' | 'applicationOpen'
  | 'applicationDeadline' | 'resultsAnnouncement' | 'bondingStart' | 'codingStart';

interface OfficialEvent {
  id: OfficialEventKey;
  instant: string | null; // ISO with timezone; null until announced
  status: 'unannounced' | 'user_recorded_from_official_source';
  sourceUrl: string;
  verifiedAt: string | null;
  estimateLabel: string; // display only; never a countdown input
}

interface GsocResource {
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

interface GsocStep {
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
    videoRange?: string | null; // only if independently verified
  }>;
  doneWhen: string;
}

interface GsocDay {
  id: string; // stable, e.g. gsoc-w01-a; never use rescheduled date as identity
  targetDate: CivilDate;
  weekNumber: number;
  phaseId: string;
  title: string;
  type: 'learn' | 'practice' | 'contribute' | 'proposal' | 'review' | 'buffer' | 'rest';
  steps: GsocStep[];
  organizationBranch: 'all' | 'dipy' | 'ignite' | 'matplotlib' | 'holidays' | 'opencv';
  eventDependency?: OfficialEventKey;
  optional: boolean;
  doneWhen: string;
}

interface TaskProgress {
  dayId: string;
  completedStepIds: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'skipped_optional';
  notesMarkdown: string;
  evidenceUrls: string[];
  completedAt: string | null;
  actualTargetDateOverride?: CivilDate;
  updatedAt: string;
}
```

Add typed `OrganizationResearch`, `ContributionRecord`, `ProposalDraft`, `ProposalSnapshot`, `GsocSettings`, `StudySession` and `BackupEnvelope`. Record organization-specific requirement text, historical year, source, checked date and user completion evidence separately from a general readiness checklist.

Suggested object stores: `settings`, `task_progress`, `day_overrides`, `sessions`, `notes`, `organizations`, `contributions`, `proposals`, `proposal_versions`, `official_events`. Use stable IDs and indexes as needed; initialization must be idempotent. Defaults must not overwrite existing choices on refresh.

### Shared focus timer

Keep only one active timer across both tracks. Add an optional track target with backward-compatible defaults. Original AI/ML sessions continue to use the original store; GSoC sessions use the new store and IDs. Existing callers must compile unchanged or be adapted together.

Persist active timer timestamps, pauses and track context so iPhone background/reload behavior can reconstruct elapsed time. Starting another timer offers stop/save or cancel. Never double-log a session when the app resumes. Store actual timestamps in ISO UTC; derive the displayed calendar date in IST. A session crossing midnight can be split at the IST boundary, using deterministic segment IDs so repeated reconciliation cannot duplicate time.

The GSoC view totals only GSoC sessions. If a future combined-hours view exists, add each unique session once. Reuse concepts across tracks without duplicating logged hours.

### Import/export/reset

The envelope must identify `app: 'Kavya StudyOS'`, `trackId: 'gsoc2027'`, schema/curriculum version and export timestamp. Validate schema, stable IDs, arrays, dates, nonnegative durations, contribution states and URL protocols before any writes. Unknown future schema versions fail gracefully; a legacy AI/ML backup must not be imported into GSoC.

Import shows a preview and asks merge or replace **GSoC data only**. Use a transaction so failed imports leave prior data intact. Give conflicting records a clear choice; do not silently drop notes or progress. Export excludes credentials/tokens. GSoC reset confirms scope, offers an export and never touches original AI/ML stores. Sanitize Markdown with the existing DOMPurify approach, validate external links and never render imported raw HTML unsafely.

## 13. Calendar generation — never hand-type dates

Build the canonical daily targets from the weekly curriculum in the appendix. No exact 2027 official dates are generated from this function.

```ts
const DAY_MS = 86_400_000;

export function addCivilDays(date: string, amount: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match || !Number.isInteger(amount)) throw new Error('Invalid civil date/offset');
  const [, y, m, d] = match;
  const base = Date.UTC(Number(y), Number(m) - 1, Number(d));
  if (new Date(base).toISOString().slice(0, 10) !== date) throw new Error('Invalid civil date');
  return new Date(base + amount * DAY_MS).toISOString().slice(0, 10);
}

export function kolkataToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const value = (type: string) => parts.find(part => part.type === type)!.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

// Offset slots are A=0 ... G=6. Week 32 has A ... F only.
export function generateTargets(weeks: Array<{ number: number; slots: unknown[] }>) {
  return weeks.flatMap(week => week.slots.map((slot, offset) => ({
    slot,
    id: `gsoc-w${String(week.number).padStart(2, '0')}-${'abcdefg'[offset]}`,
    targetDate: addCivilDays('2026-10-21', (week.number - 1) * 7 + offset)
  })));
}
```

The appendix's dates were generated with equivalent civil-date arithmetic and checked for continuity, weekly boundaries and total count. Antigravity must also validate contiguous week numbers, at most seven slots, all step/resource IDs and the expected final target.

User-configured leave/capacity applies as a separate overlay. Move unfinished flexible work with a preview; never move confirmed events or relabel actual past sessions. Personal deadlines and official deadlines must be visibly distinct. No `new Date().toISOString().slice(0,10)` for today's IST date, and no reuse of the old clamped `getTodayDateString()`.

## 14. Implementation sequence and acceptance tests

### Small implementation steps

1. Inspect the latest repository, instructions and current behavior. Report additive file changes and preserve a clean baseline.
2. Create typed canonical content/resources/organizations and the generated date schedule. Validate resource IDs and all dates before building the UI.
3. Add isolated GSoC persistence, scoped export/import and safe reset. Test it independently of AI/ML storage.
4. Add the hub entry and deep link. Reuse common UI and maintain five bottom tabs.
5. Build Today/Roadmap/day detail/Learn first; then Organizations/Contributions/Proposal/Calendar/Progress.
6. Integrate track-aware timer, notes and capacity/catch-up. Verify date logic and iPhone lifecycle behavior.
7. Run build and local dev server, check the cases below, fix errors, and provide preview/screenshots with a file summary. Deployment remains a separate approval step.

### Minimum acceptance matrix

| Case | Expected result |
| --- | --- |
| 11 Oct 2026 in IST | Start countdown: 10 days; no invented completed work |
| 20 Oct | Starts tomorrow; optional setup |
| 21 Oct | W1/A, orientation + Git setup |
| 27 Oct | W1/G, light review |
| 28 Oct | W2/A, branches/conflicts block begins |
| 1 Jan 2027 | Correct GSoC target; not clamped to 31 Dec 2026 |
| 31 May 2027 | W32/F, final preparation-horizon target; not automatically “coding started” |
| 1 Jun with coding date unknown | Show maintenance/next official-update action; retain unfinished tasks |
| `2026-10-20T18:29:59Z` | IST today = 20 Oct |
| `2026-10-20T18:30:00Z` | IST today = 21 Oct |
| Official event timestamps empty | “Awaiting announcement”; no exact deadline countdown |
| User records official deadline | IST and original timezone visible; catch-up cannot move it |
| No 2027 org confirmation | All shortlist cards remain historical/research status |
| Task completed, then reload | Checkboxes, notes, evidence and completion timestamp retained |
| Main org changed | Contribution history retained; unrelated branch lessons become optional, not deleted |
| Practice PR saved | Excluded from target-organization merged-PR requirement |
| Ignored/closed PR | Accurate status; no fake merge or accepted-proposal badge |
| Corrupt or wrong-track import | Error before writes; all prior data intact |
| Valid GSoC import/export | Round-trip notes, progress, evidence, settings and proposal snapshots |
| Reset GSoC only | Original AI/ML progress/database unchanged |
| GSoC timer started while AI/ML timer active | Stop/save or cancel choice; only one active timer |
| Timer across screen lock/reload/IST midnight | Pause-aware time reconstructed; no duplicate session |
| New GSoC note | Does not accidentally attach to an original AI/ML task ID |
| Broken/unknown link | Clear unavailable state and search fallback; no fabricated URL |
| 320/390/430 px screens, large text | No page overflow; usable tap targets/safe areas |
| Offline reopen | Cached hub, notes and progress work; external links indicate internet needed |
| `#/gsoc/today` reload | Opens hub without changing AI/ML selected date or progress |
| Build and navigation | No broken imports, console errors or regression in existing tabs |

### Verification report required from Antigravity

Report commands actually run and their results, files changed/deleted, screenshot/device checks, remaining limitations, source of any updated 2027 date, and confirmation that original AI/ML data was preserved. Do not report “tests passed” for tests not executed.

Current document preparation does not implement or test the new website. The commands below are future implementation checks:

```bash
npm ci
npm run build
npm run dev -- --host 0.0.0.0
```

Run the project-appropriate tests after adding the focused test harness if none exists. The inspected package currently has no `test` script; do not claim `npm test` exists without adding it. No source edits, database reset, git push or deployment are part of generating this handoff.

When the completed changes are approved, use the project's existing Git/Vercel workflow or, from its root, the Vercel CLI command `npx vercel --prod`. This is a future deployment instruction, not authorization to execute it now.

## 15. How Kavya should begin on 21 October

Open the new GSoC Today page. Read the short orientation, install/check Git, make one practice repository and write five lines explaining Git versus GitHub. Spend most of the block performing the actions. Do not try to select a proposal topic or learn a large new AI stack on the first day.

By early November, repeat a branch/PR/conflict workflow without a video. By late November, run and understand a small part of one candidate codebase. During December and January, prioritize useful work and reviews in that community. During the official application season, turn demonstrated understanding into a scoped proposal and submit it through the official platform.

The complete daily action calendar and clickable link definitions follow. Dates here are personal targets; adapt them openly around college/exams and real official events.

<!-- DAILY_CALENDAR_START -->

## 16. Full daily calendar: 21 October 2026–31 May 2027

Each row is one personal calendar target. Core time is 90 minutes except the seventh weekly slot, which is a 30-minute review/buffer. The final week has six rows. These are not 223 mandatory study days: use editable leave/rest/capacity overlays. Video learning uses only the named topic, capped at the day's learning budget; the remainder is practice, recall and notes.

**Daily checklist template:** open/read the assigned segment (about 25 min) → perform the practical action (about 50 min) → close references and explain/record evidence (about 15 min). Contribution/proposal days normally use 10 min source reading, 65 min work and 15 min evidence/notes. Review rows use about 10 min recall, 10 min ledger/update and 10 min planning. Optional extension is 30–60 min of focused code, never another full course.

**Selected-organization binding:** after Week 6, append the selected project's repository, current contributing guide, issue/PR and relevant docs to every contribution day. Cross-project links in a row are comparison choices: study only the branch selected in settings. Do not require an Ignite learner to study every DIPY imaging topic, or a holidays learner to complete all PyTorch lessons.

**Event-dependent rows:** registration, submission, results, bonding and coding actions are conditional on the actual official event and your actual status. If the event is not available, use the local research/review task instead. Once official dates arrive, re-anchor these rows explicitly and highlight deadline conflicts. A fixed personal date in this table is never proof the event has happened.

### Week 01 · P1 · Orientation and Git from zero

**Targets:** 2026-10-21–2026-10-27 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-10-21 · A · 90 min | What GSoC and Git actually are | Read the FAQ and orientation. Install/check Git; create a practice folder and GitHub account/profile if needed. | Git version recorded; five lines distinguish Git, GitHub and GSoC. | [V01][v01] · [O02][o02] · [D01][d01] |
| 2026-10-22 · B · 90 min | CLI and file navigation | Learn paths, pwd, ls, cd, mkdir and reading files. Build a small project folder using the terminal. | Recreate the folder tree without looking at the video. | [V05][v05] |
| 2026-10-23 · C · 90 min | Working tree, staging and commits | Use the Git course's initialization/status/add/commit section; make three purposeful local commits. | Explain which changes are unstaged, staged and committed. | [V02][v02] · [D03][d03] |
| 2026-10-24 · D · 90 min | GitHub remote and authentication | Use the remotes section and current SSH docs; push the practice repository, excluding private keys and environment files. | Remote is correct and the pushed files match your local commit. | [V02][v02] · [D04][d04] |
| 2026-10-25 · E · 90 min | Read history and diff | Change one function or text file; inspect diff, stage only the intended change and read the commit history. | Explain one diff and locate the commit that introduced it. | [V02][v02] · [D03][d03] |
| 2026-10-26 · F · 90 min | Branch and pull request basics | Complete the GitHub Hello World exercise; open and merge a practice PR in your own repository. | Describe branch, PR, review and merge; save the practice PR link. | [D01][d01] · [V02][v02] |
| 2026-10-27 · G · 30 min | Light recall and buffer | From memory, explain the six previous actions. Fix one unclear step; choose next week's study slots. | Short recall note and a realistic next-week schedule saved. | [D03][d03] |

### Week 02 · P1 · Collaboration, conflicts and one practice contribution

**Targets:** 2026-10-28–2026-11-03 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-10-28 · A · 90 min | Branches and deliberate conflict | Follow the branching/conflict section. Make conflicting edits on two branches in a disposable repo and resolve them. | Merged result contains the intended lines; explain the conflict markers. | [V02][v02] · [D03][d03] |
| 2026-10-29 · B · 90 min | Fork versus clone; origin versus upstream | Read the GitHub contribution walkthrough. Fork the practice project and inspect both remotes. | Draw or write the local/fork/upstream relationship correctly. | [D02][d02] · [V04][v04] |
| 2026-10-30 · C · 90 min | Keep a fork current | Fetch upstream, inspect what changed and update your practice branch with the documented merge workflow. | Explain fetch versus pull and show the resulting history. | [D03][d03] · [V02][v02] |
| 2026-10-31 · D · 90 min | Undo safely | Practice restore, revert and stash on disposable changes. Read reset/rebase conceptually before trying them locally. | Recover a deliberate mistake without rewriting a shared branch. | [D03][d03] · [V02][v02] |
| 2026-11-01 · E · 90 min | One guided external practice PR | Follow First Contributions if still appropriate; make its requested training change and submit once. | Save the PR as practice, regardless of when it is reviewed. | [D05][d05] · [D02][d02] |
| 2026-11-02 · F · 90 min | Read contribution rules and PR etiquette | Read an actual project's README, CONTRIBUTING and code of conduct; compare one reviewed PR to your practice PR. | Write a useful PR description and three review-etiquette rules. | [D06][d06] · [V04][v04] |
| 2026-11-03 · G · 30 min | Independent workflow skill check | Repeat branch, edit, test/check, commit and PR steps without a tutorial. Revisit only the failing step. | An honest checklist identifies what you can do independently. | [D02][d02] · [D03][d03] |

### Week 03 · P2 · Python revision for contributing

**Targets:** 2026-11-04–2026-11-10 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-11-04 · A · 90 min | Functions and a small module | Revise functions/arguments only as needed; write a small utility module rather than replaying the whole Python course. | Call three functions from a second file and explain return values. | [V06][v06] · [D07][d07] |
| 2026-11-05 · B · 90 min | Collections and relevant complexity | Revise lists, dicts and sets; implement duplicate detection and a small frequency counter. | Correct results on empty/repeated input; explain the data-structure choice. | [V06][v06] · [D07][d07] |
| 2026-11-06 · C · 90 min | OOP and reading an interface | Revise classes, instances and composition; write a small class with clear methods and a docstring. | Explain class versus instance and test one behavior manually. | [V06][v06] · [V07][v07] |
| 2026-11-07 · D · 90 min | Virtual environment and package layout | Create a venv, install a dependency and inspect a real pyproject.toml. Record reproducible setup commands. | A clean environment can run the utility module; venv is ignored by Git. | [D08][d08] · [D07][d07] |
| 2026-11-08 · E · 90 min | First pytest tests | Use pytest's first-test section. Test normal inputs, empty inputs and one invalid input in the utility. | Tests run locally; intentionally breaking the function makes a relevant test fail. | [V08][v08] · [D09][d09] |
| 2026-11-09 · F · 90 min | Tracebacks and regression-test reasoning | Introduce a small bug, read the traceback and use a debugger or print investigation; fix it with a regression test. | Explain why the failing test reproduces the bug and why the fix is correct. | [V08][v08] · [D09][d09] |
| 2026-11-10 · G · 30 min | Light Python recall | Close tutorials and solve two earlier logic questions; review the utility package's setup and tests. | One weak concept identified; utility repository and test log saved. | [D07][d07] · [D09][d09] |

### Week 04 · P2 · Tests, arrays and scientific examples

**Targets:** 2026-11-11–2026-11-17 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-11-11 · A · 90 min | Fixtures and parametrized tests | Use pytest fixture/parametrization sections; remove repeated setup and test several boundary cases. | Explain fixture lifetime at the level used and read test failures correctly. | [V08][v08] · [D09][d09] |
| 2026-11-12 · B · 90 min | Files, exceptions and useful documentation | Read/write a small JSON or CSV fixture; handle a missing file intentionally; write usage/setup documentation. | A new user can follow the README and see the same output. | [V06][v06] · [D07][d07] |
| 2026-11-13 · C · 90 min | NumPy arrays and indexing | Use the NumPy array/shape/indexing sections; compare lists and arrays using small examples. | Show shape, dtype, slice and copy behavior with assertions. | [V10][v10] · [D11][d11] |
| 2026-11-14 · D · 90 min | Numerical tests and a small plot | Practice broadcasting and a numerical assertion; make one labelled plot. Use pandas only if needed. | One plot is reproducible and the array test passes with sensible tolerance. | [V10][v10] · [V12][v12] · [D11][d11] |
| 2026-11-15 · E · 90 min | Read a real test and source file | Pick DIPY or Ignite preliminarily; locate a function, its docstring and a nearby test without changing upstream code. | Save a one-page source-to-test map and unfamiliar terms. | [R01][r01] · [R05][r05] |
| 2026-11-16 · F · 90 min | Tiny project demonstration | Package the utility, array example, tests and README. Demonstrate it from a clean local checkout. | Setup, example and focused tests run; explain them in two minutes. | [D08][d08] · [D09][d09] |
| 2026-11-17 · G · 30 min | Foundation gate and buffer | Check Git, environments, tracebacks and tests. Keep missing topics as a small remedial list for the next week. | Ready-for-repo checklist is honest; no automatic mastery claim. | [D02][d02] · [D09][d09] |

### Week 05 · P3 · Candidate trials: DIPY and Ignite

**Targets:** 2026-11-18–2026-11-24 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-11-18 · A · 90 min | DIPY users and contribution rules | Read DIPY's overview, contribution guide and historical ideas; choose a simple example, not a large algorithm. | Explain the example's user/problem and record prerequisites. | [R01][r01] · [R02][r02] · [R04][r04] |
| 2026-11-19 · B · 90 min | DIPY local example | Follow the current documented setup and run one small example using manageable data. Log setup errors precisely. | Example output or a reproducible blocker with commands/version/commit. | [R01][r01] · [R02][r02] |
| 2026-11-20 · C · 90 min | DIPY focused test and issue scan | Run a relevant test; read three current issues and two reviewed PRs. Do not claim an issue without context. | Source/test map and one bounded potential task saved. | [R03][r03] · [R02][r02] |
| 2026-11-21 · D · 90 min | Ignite concepts and prerequisites | Read the getting-started guide; revise only the necessary tensor/training-loop concepts from the PyTorch course. | Explain tensor, trainer, evaluator, Engine and Events at a basic level. | [R08][r08] · [V14][v14] · [D10][d10] |
| 2026-11-22 · E · 90 min | Ignite CPU or small-data example | Run a minimal documented example using supported versions; reduce data size rather than buying GPU time. | Working example or an explicit dependency/skill blocker with evidence. | [R08][r08] · [R06][r06] |
| 2026-11-23 · F · 90 min | Ignite requirements and issue scan | Read the historical three-accepted-PR requirement, current contribution guide, issues and recent reviews. | Record what is historical and what must be rechecked for 2027. | [R09][r09] · [R06][r06] · [R07][r07] |
| 2026-11-24 · G · 30 min | Compare two practical trials | Score interest, setup, skills, workflow and available time using Section 5. Capture actual observations. | Comparison saved; no invented mentor-response or acceptance score. | [O06][o06] |

### Week 06 · P3 · Select a main community and a small task

**Targets:** 2026-11-25–2026-12-01 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-11-25 · A · 90 min | Backup trial: Matplotlib or holidays | Try only one backup: a simple plot/test workflow or holiday calendar/test. Read its contribution instructions. | One backup's setup and prerequisite notes saved. | [R11][r11] · [R15][r15] · [V12][v12] |
| 2026-11-26 · B · 90 min | Choose the main repository | Choose DIPY, Ignite or the better-fitting backup based on demonstrated fit. Store one main and one backup. | Selection reason, skill gaps and realistic weekly capacity recorded. | [O06][o06] · [R04][r04] · [R09][r09] |
| 2026-11-27 · C · 90 min | Join the prescribed public channel | Read recent discussion, find the stated newcomer channel and prepare a specific introduction. Post yourself if appropriate. | Channel/link and a concise introduction or draft recorded. | [O07][o07] · [O09][o09] |
| 2026-11-28 · D · 90 min | Issue triage and duplication check | Inspect a small unclaimed issue; search existing PRs and reproduce it. Confirm expected behavior before implementing. | Issue URL, expected/actual result and existing-work check recorded. | [D02][d02] · [D06][d06] |
| 2026-11-29 · E · 90 min | Agree on a bounded scope | Ask one precise question or describe a small approach in the required channel. If blocked, continue a local reproduction. | Public discussion/draft and proposed scope saved; no assumption of assignment. | [O07][o07] · [O09][o09] |
| 2026-11-30 · F · 90 min | Create a development branch and test plan | Create a branch in your fork; identify exactly what files/tests/docs would change for the selected task. | Branch, source map, test command and next action saved. | [D02][d02] · [D03][d03] |
| 2026-12-01 · G · 30 min | Weekly review and requirements record | Review the main-project choice, setup and issue. Schedule next week around actual college/coursework. | Main-project checklist and one realistic contribution target. | [O06][o06] · [O09][o09] |

### Week 07 · P4 · First useful change in the main project

**Targets:** 2026-12-02–2026-12-08 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-12-02 · A · 90 min | Read the affected behavior | Trace the selected issue's function/class through callers, docs and tests; inspect relevant prior reviews. | Explain the intended behavior and the narrow change boundary. | [D06][d06] |
| 2026-12-03 · B · 90 min | Write a reproduction or failing test | Build the smallest input that demonstrates the problem; add a test where the project expects it. | Failure occurs for the intended reason, or investigation explains why not. | [D09][d09] |
| 2026-12-04 · C · 90 min | Implement the smallest fix | Change one coherent behavior. Use the repository's style; avoid unrelated formatting or refactors. | The focused reproduction/test now behaves correctly. | [D02][d02] |
| 2026-12-05 · D · 90 min | Test boundaries and documentation | Run relevant tests, inspect edge cases and add documentation/changelog only if the project requires it. | Actual commands/results and limitations recorded. | [D09][d09] |
| 2026-12-06 · E · 90 min | Prepare a draft PR | Review the diff; write problem, approach and validation. Open a draft only if the change is coherent and welcome. | PR URL or locally ready draft plus a complete description saved. | [D02][d02] |
| 2026-12-07 · F · 90 min | Feedback or local verification | Address any real review comments. If none, check another edge case locally and avoid repeated status pings. | One verified improvement or precise next-action note. | [O09][o09] |
| 2026-12-08 · G · 30 min | Weekly evidence review | Recall the code change, update contribution status honestly, and note what review taught you. | Evidence ledger distinguishes draft/submitted/merged states. | [O09][o09] |

### Week 08 · P4 · Review response and contribution completion

**Targets:** 2026-12-09–2026-12-15 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-12-09 · A · 90 min | Read feedback carefully | Summarize each review comment and its underlying concern; ask a specific clarification where necessary. | Actionable review checklist with links or local-review observations. | [O09][o09] |
| 2026-12-10 · B · 90 min | Reproduce the review concern | Write a test/example for the disputed or overlooked case before editing more code. | Concern reproduced or accurately explained with evidence. | [D09][d09] |
| 2026-12-11 · C · 90 min | Revise implementation | Make the requested focused correction; follow the maintainer's workflow for commits and history. | Corrected behavior and clean diff. | [D02][d02] · [D03][d03] |
| 2026-12-12 · D · 90 min | Run required checks | Run focused tests and agreed lint/docs checks; log environment-specific limitations rather than claiming full success. | Updated validation log and no unexplained new failures. | [D09][d09] |
| 2026-12-13 · E · 90 min | Update PR description | Summarize what changed since review. Link tests and answer the actual questions in the prescribed channel. | Reviewer can inspect each addressed point clearly. | [O09][o09] |
| 2026-12-14 · F · 90 min | Pending-review fallback | If review remains pending, investigate a second small issue locally. If merged/closed, record the real status. | Useful local work or accurate outcome; no forced weekly PR quota. | [D06][d06] |
| 2026-12-15 · G · 30 min | Lessons and catch-up | Review source/test relationships from memory and choose next week's highest-value action. | One technical lesson and one communication lesson saved. | [O09][o09] |

### Week 09 · P4 · A second scoped bug or test improvement

**Targets:** 2026-12-16–2026-12-22 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-12-16 · A · 90 min | Select a meaningful next problem | Choose a second bounded task based on project needs and what you now understand; check existing work. | Issue/problem plus a justified scope, not a cosmetic count target. | [D06][d06] |
| 2026-12-17 · B · 90 min | Minimal reproduction | Create a small reproducible example with version, input, expected and actual results. | Another person can reproduce the behavior from your notes. | [D02][d02] |
| 2026-12-18 · C · 90 min | Regression test | Add the relevant regression test; ensure it fails for the bug rather than setup or random data. | A clear failure signal tied to the problem. | [D09][d09] |
| 2026-12-19 · D · 90 min | Fix and edge cases | Implement the small change and test nearby inputs, errors and existing behavior. | Focused tests pass and edge cases are explained. | [D09][d09] |
| 2026-12-20 · E · 90 min | Documentation and review | Update necessary usage notes; inspect the diff and request review through the project's normal process. | Ready draft/PR or explicit remaining blocker with evidence. | [D02][d02] · [O09][o09] |
| 2026-12-21 · F · 90 min | Review follow-through | Respond to actual feedback or improve local reproduction while waiting. | No unanswered actionable comment you could resolve in the block. | [O09][o09] |
| 2026-12-22 · G · 30 min | Weekly skill consolidation | Explain both investigated changes and revisit one weak Python/Git concept only if needed. | Short independent explanation and honest contribution states. | [D03][d03] · [D09][d09] |

### Week 10 · P4 · CI and reproducible development

**Targets:** 2026-12-23–2026-12-29 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-12-23 · A · 90 min | Inspect the project's actual CI | Read workflow files and their test jobs; identify what is relevant to your contribution. | Explain trigger, job, runner and command without copying blindly. | [V16][v16] · [D12][d12] |
| 2026-12-24 · B · 90 min | Practice one GitHub Actions workflow | In your practice repo only, add a minimal Python test workflow using current official action examples. | A test runs on a practice push/PR and its logs are readable. | [D12][d12] · [V16][v16] |
| 2026-12-25 · C · 90 min | Understand a CI failure | Deliberately break the practice test, inspect the failing step, fix it and compare to target-project logs. | Explain application failure versus environment/setup failure. | [D12][d12] · [D09][d09] |
| 2026-12-26 · D · 90 min | Reproduce locally | Run the relevant checks from the target project's contributing guide in your supported environment. | Commands and actual pass/fail results saved. | [D09][d09] |
| 2026-12-27 · E · 90 min | Clean setup documentation | Check your setup notes from a fresh environment; propose an upstream improvement only if it is actually useful. | Reproducible setup instructions and a bounded justified change if needed. | [D08][d08] · [D06][d06] |
| 2026-12-28 · F · 90 min | Open reviews and follow-up | Finish outstanding review fixes or investigate a relevant CI/test concern locally. | Next contribution action is tied to a real project need. | [O09][o09] |
| 2026-12-29 · G · 30 min | Light review and holiday flexibility | Review the CI concepts; use a leave/capacity override if needed. Do not assign festival dates by guess. | Updated calendar and one-page CI summary. | [D12][d12] |

### Week 11 · P4 · Codebase map and year-end evidence

**Targets:** 2026-12-30–2027-01-05 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2026-12-30 · A · 90 min | Public API and internal modules | Map one component's public entry points to implementation and tests in the main project. | A navigable source map with real file/function references. | [D06][d06] |
| 2026-12-31 · B · 90 min | Trace an end-to-end example | Run a tiny example and trace inputs through the component to outputs. | Explain shape/state transformations and where failures would appear. | [D09][d09] |
| 2027-01-01 · C · 90 min | Light new-year buffer | Keep this a low-pressure review: check open reviews, back up notes and verify the next study target. | Backup saved and one clear next action; leave allowed. | [O09][o09] |
| 2027-01-02 · D · 90 min | Small focused improvement | Continue the open issue, test or docs improvement that fits your code map. | Coherent local change and relevant test evidence. | [D02][d02] |
| 2027-01-03 · E · 90 min | Evidence ledger audit | Check all contribution URLs/statuses, exact work you did and review lessons; separate practice and project work. | No exaggerated claim or invented merged PR in the ledger. | [O09][o09] |
| 2027-01-04 · F · 90 min | Check official updates | Open the timeline and project channels. Record any newly announced 2027 information with a primary-source link. | Facts are dated and sourced; unknown events remain unknown. | [O03][o03] |
| 2027-01-05 · G · 30 min | Review and next-month focus | Set January goals around one useful component and your actual course/college workload. | Small achievable plan with buffer, not a PR-count leaderboard. | [O06][o06] |

### Week 12 · P4 · Deepen the chosen project's domain

**Targets:** 2027-01-06–2027-01-12 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-01-06 · A · 90 min | Choose one domain gap | Identify one topic needed by current work: DIPY image/array conventions, Ignite training events, plotting or calendar rules. | A gap tied to actual code, with the correct branch resource chosen. | [R02][r02] · [R08][r08] · [R11][r11] · [R15][r15] |
| 2027-01-07 · B · 90 min | Project-specific learning | Study the chosen project's relevant docs/example only. For Ignite, use selected PyTorch tensors/autograd lessons if necessary. | Explain one new concept and its role in the current task. | [R08][r08] · [V14][v14] · [D10][d10] |
| 2027-01-08 · C · 90 min | Build a tiny domain example | Write a standalone demonstration using small synthetic inputs; no large dataset or paid compute required. | Working example with stated assumptions and output. | [D11][d11] · [D09][d09] |
| 2027-01-09 · D · 90 min | Test domain assumptions | Check boundary values, shapes, device/state or date conventions that apply to the example. | Tests/assertions show at least one meaningful failure mode. | [D09][d09] |
| 2027-01-10 · E · 90 min | Connect example to real source | Locate the project API/module implementing the behavior and a relevant test or review. | Example-to-source map and one useful question. | [D06][d06] |
| 2027-01-11 · F · 90 min | Apply the learning | Improve an open contribution or write a scoped local test based on the new understanding. | Visible improvement in a real task, not just watched video time. | [D02][d02] |
| 2027-01-12 · G · 30 min | Recall and requirements check | Recall the domain concept, review organization-specific prerequisites and update your skill-gap list. | Evidence-based gap list and next contribution action. | [R04][r04] · [R09][r09] |

### Week 13 · P4 · Small design discussion and third change if required

**Targets:** 2027-01-13–2027-01-19 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-01-13 · A · 90 min | Understand an enhancement request | Read a relevant small enhancement and its discussion; distinguish user need from implementation preference. | Problem, users and constraints summarized accurately. | [D06][d06] |
| 2027-01-14 · B · 90 min | Write a short design note | Describe two approaches, public API impact, test strategy and trade-offs before broad code changes. | One-page design draft with an intentionally bounded scope. | [O09][o09] |
| 2027-01-15 · C · 90 min | Discuss through the normal channel | Ask about the scoped approach if required. If waiting, prototype locally without claiming approval. | Discussion link or local draft and unresolved assumptions recorded. | [O07][o07] · [O09][o09] |
| 2027-01-16 · D · 90 min | Implement a narrow prototype | Code the smallest risky part with supported dependencies and small inputs. | Prototype demonstrates a technical assumption or identifies a specific blocker. | [D09][d09] |
| 2027-01-17 · E · 90 min | Test and document the prototype | Add checks and usage notes; inspect actual behavior instead of polishing a demo only. | Repeatable experiment and actual results. | [D09][d09] |
| 2027-01-18 · F · 90 min | Review contribution prerequisites | If Ignite remains main, check actual accepted-PR count against its current requirement; prioritize quality and review follow-through. | Requirement status is accurate; no synthetic PR splitting to inflate count. | [R09][r09] |
| 2027-01-19 · G · 30 min | Weekly review | Review the design trade-offs and select one realistic improvement for the next week. | Can explain the design without reading a generated script. | [O09][o09] |

### Week 14 · P4 · Validation, robustness and review backlog

**Targets:** 2027-01-20–2027-01-26 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-01-20 · A · 90 min | Inventory open work | List open reviews, unfinished tests and known assumptions in the main project. | Prioritized backlog with one next action per item. | [O09][o09] |
| 2027-01-21 · B · 90 min | Edge-case testing | Write a useful boundary case for an active change, using stable and appropriately small fixtures. | A meaningful regression signal, not a test mirroring implementation. | [D09][d09] |
| 2027-01-22 · C · 90 min | Numerical or state correctness | For scientific/ML work inspect dtype, tolerance, shape, seed, train/eval state; for other work inspect its actual invariants. | Relevant correctness assumptions documented and checked. | [D11][d11] · [D09][d09] |
| 2027-01-23 · D · 90 min | Compatibility and docs | Inspect supported Python/dependency versions and document any practical compatibility limitation. | No false claim that every version/platform was tested. | [D08][d08] |
| 2027-01-24 · E · 90 min | Submit/update coherent work | Finalize one ready contribution or update an existing review; include actual validation evidence. | Clean diff and useful PR update, or explicit blocker. | [D02][d02] |
| 2027-01-25 · F · 90 min | Answer review questions | Explain your implementation and tests; make focused corrections rather than starting a large unrelated task. | Review action list updated honestly. | [O09][o09] |
| 2027-01-26 · G · 30 min | Recall and buffer | Revisit one tricky code path from memory; use remaining time to catch up or take a planned rest. | Recall note and next-week priority saved. | [D09][d09] |

### Week 15 · P4 · Move from contributions to project research

**Targets:** 2027-01-27–2027-02-02 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-01-27 · A · 90 min | List project needs | Read issues, roadmap and historical ideas in the main project; list needs you actually understand. | Three possible problem areas with source links, not promises of 2027 ideas. | [R04][r04] · [R09][r09] · [R13][r13] · [R17][r17] |
| 2027-01-28 · B · 90 min | Read two historical examples | Read the attributed DIPY contributor accounts; extract preparation lessons without copying their proposals or career claims. | Two lessons and one difference from your own skill/availability level. | [C01][c01] · [C03][c03] |
| 2027-01-29 · C · 90 min | Assess scope against your time | Compare small/medium/large project hours to college, teaching and exam commitments; record summer uncertainties. | Honest preliminary capacity and a tractable scope preference. | [O02][o02] · [O08][o08] |
| 2027-01-30 · D · 90 min | Investigate one likely technical area | Trace the relevant module and run a small example/test connected to one problem area. | A technical research note grounded in source code. | [D09][d09] |
| 2027-01-31 · E · 90 min | Maintain current contributions | Finish reviews or a scoped fix; do not disappear from the community while writing plans. | Contribution ledger and next action are current. | [O09][o09] |
| 2027-02-01 · F · 90 min | Check 2027 announcements | Review the official timeline, organization news and project channel; store confirmed facts only. | Updated source/checked date or explicit unannounced status. | [O03][o03] · [O10][o10] · [O11][o11] |
| 2027-02-02 · G · 30 min | January review | Audit what you can explain, run and maintain; choose February's one main research direction. | Project-readiness checklist without any selection-probability score. | [O06][o06] |

### Week 16 · P5 · Technical spike and measurable scope

**Targets:** 2027-02-03–2027-02-09 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-02-03 · A · 90 min | Select one research question | Choose the riskiest unanswered question in a possible project direction; avoid treating historical ideas as confirmed. | One concrete question and experiment boundary. | [O08][o08] |
| 2027-02-04 · B · 90 min | Baseline experiment | Run current behavior with a small reproducible input and record output/time only where performance matters. | Baseline commands, environment and observations saved. | [D09][d09] |
| 2027-02-05 · C · 90 min | Prototype the risky part | Implement only enough to test the hypothesis, in a clearly experimental branch. | Working spike or a precise documented limitation. | [D09][d09] |
| 2027-02-06 · D · 90 min | Compare alternatives | Test a second reasonable approach or explain why it is unsuitable; avoid optimizing before correctness. | Evidence-backed trade-off note. | [O08][o08] |
| 2027-02-07 · E · 90 min | Define success | Write observable acceptance criteria and what testing/evaluation would show project completion. | Measurable deliverables and exclusions. | [O08][o08] |
| 2027-02-08 · F · 90 min | Invite focused technical feedback | Share a concise question or spike through the project's prescribed channel if useful; record feedback actually received. | Specific feedback/questions and an honest next step. | [O09][o09] |
| 2027-02-09 · G · 30 min | Light review and buffer | Review the experiment, clean notes and schedule the next block around actual capacity. | One-page spike summary with links and assumptions. | [O08][o08] |

### Week 17 · P5 · Architecture, tests and prerequisite closure

**Targets:** 2027-02-10–2027-02-16 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-02-10 · A · 90 min | Map the target component | Update the code map for the possible project: entry point, interfaces, tests, docs and dependencies. | Named real files/APIs with a clear relationship. | [D06][d06] |
| 2027-02-11 · B · 90 min | Close one prerequisite gap | Study a narrow weak concept needed by that component. Choose current docs and a relevant resource; no new unrelated stack. | Explain the concept through a tiny example. | [D09][d09] · [D10][d10] · [D11][d11] |
| 2027-02-12 · C · 90 min | Testing strategy | List unit/integration/behavior checks that fit the proposed change and repository conventions. | Test plan verifies outcomes and realistic failure cases. | [D09][d09] |
| 2027-02-13 · D · 90 min | Prototype reproducibility | Run your spike from a clean supported environment and fix undocumented setup assumptions. | Someone else could repeat the experiment from your notes. | [D08][d08] |
| 2027-02-14 · E · 90 min | Review open contributions | Respond to pending actionable reviews and verify organization-specific prerequisites from current sources. | Accurate status/evidence; waiting for review is not marked as your failure. | [R09][r09] · [O09][o09] |
| 2027-02-15 · F · 90 min | Draft a project questions list | Write targeted questions about scope, design, dependencies and priorities for a future mentor discussion. | Concise questions answerable from your research context. | [O07][o07] · [O09][o09] |
| 2027-02-16 · G · 30 min | Weekly recall | Explain current architecture and the experiment in three minutes; update your technical gap list. | Independent explanation and a manageable next-week plan. | [O08][o08] |

### Week 18 · P5 · Official organization list checkpoint

**Targets:** 2027-02-17–2027-02-23 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-02-17 · A · 90 min | Check announcements, without assuming a date | Open the official timeline and home. If the 2027 list is published, record the main project's participation and umbrella. | Confirmed source/date or unknown status, never a copied 2026 badge. | [O01][o01] · [O03][o03] |
| 2027-02-18 · B · 90 min | Recheck project instructions | Read current application/ideas/prerequisite/template/AI instructions from the participating project if available. | Current requirements record and unresolved questions. | [O12][o12] · [R04][r04] · [R09][r09] |
| 2027-02-19 · C · 90 min | Participation decision | If the main project is not participating, activate the studied backup explicitly; if the list is unknown, continue main-project work. | Decision with evidence; all old contributions retained. | [O06][o06] · [O10][o10] · [O11][o11] |
| 2027-02-20 · D · 90 min | Understand a real idea | Read an available current idea and relevant source; otherwise continue the local technical spike as provisional research. | Problem, required skills and open assumptions summarized. | [O08][o08] |
| 2027-02-21 · E · 90 min | Prepare an informed discussion | Share the small prototype/question through the prescribed channel; do not ask for a guaranteed slot. | Technical discussion/draft and follow-up action saved. | [O07][o07] · [O09][o09] |
| 2027-02-22 · F · 90 min | Keep contributing | Complete a review fix or small local improvement while waiting for project guidance. | Actual contribution action logged with accurate status. | [D02][d02] |
| 2027-02-23 · G · 30 min | Checkpoint review | Review official versus personal dates and whether the chosen idea remains a good fit. | Updated fit decision and next-week objectives. | [O03][o03] · [O06][o06] |

### Week 19 · P5 · Select the idea and write a scope note

**Targets:** 2027-02-24–2027-03-02 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-02-24 · A · 90 min | Shortlist actual ideas | Compare one or two current published ideas using interest, code understanding, prerequisites and time. If unavailable, mark provisional. | A reasoned idea choice, not several unrelated proposals. | [O06][o06] · [O08][o08] |
| 2027-02-25 · B · 90 min | Current implementation and gap | Describe current behavior and why it falls short for real users; cite actual code/docs/issues. | Problem statement grounded in project needs. | [O08][o08] |
| 2027-02-26 · C · 90 min | MVP and exclusions | Write the minimum useful result, optional stretch goals and explicitly excluded work. | Bounded deliverables that fit a realistic project size. | [O08][o08] |
| 2027-02-27 · D · 90 min | Approach and alternatives | Use the spike to describe implementation approach and relevant design trade-offs. | A technical explanation you can defend without copying a template answer. | [O08][o08] |
| 2027-02-28 · E · 90 min | Clarify with the community | Ask targeted questions about scope/priority. Apply feedback actually received; do not imply endorsement. | Assumptions and confirmed guidance are separate. | [O09][o09] |
| 2027-03-01 · F · 90 min | Risks and fallback scope | Identify dependency, algorithm, data, review and availability risks; define smaller fallback deliverables. | Risks have concrete mitigations or an explicit unresolved state. | [O08][o08] |
| 2027-03-02 · G · 30 min | Scope review | Review idea/template fit and check official timeline updates. Carry missing facts forward openly. | Ready to draft or a clear list of blockers. | [O03][o03] · [O08][o08] |

### Week 20 · P6 · Proposal draft one

**Targets:** 2027-03-03–2027-03-09 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-03-03 · A · 90 min | Follow the actual organization template | Open the current template/instructions and create an original draft with accurate identity and links. | Template/AI-policy checklist and current-source date recorded. | [O08][o08] · [O12][o12] |
| 2027-03-04 · B · 90 min | Write problem and users | Explain the need, affected users, current behavior and expected benefit in your own words. | Clear project-specific motivation without hype or copied claims. | [O08][o08] |
| 2027-03-05 · C · 90 min | Write technical approach | Describe modules/interfaces, the risky part and alternatives using your source map and experiment. | Proposal is technically inspectable and based on real research. | [O08][o08] |
| 2027-03-06 · D · 90 min | Write testing and success criteria | Add correctness checks, integration, docs and evaluation relevant to the idea. | Each required deliverable has a plausible verification method. | [O08][o08] · [D09][d09] |
| 2027-03-07 · E · 90 min | Plan weekly deliverables | Estimate effort against project size and availability; leave planning buffer and divide MVP from stretch work. | A realistic schedule with dependencies and buffer. | [O08][o08] |
| 2027-03-08 · F · 90 min | Write availability and evidence | Disclose college/teaching/exam constraints and link genuine work with your exact role. | No inflated hours, authorship, merges or mentor relationship. | [O08][o08] |
| 2027-03-09 · G · 30 min | Draft-one review | Read the whole draft aloud; identify missing assumptions and the best specific feedback question. | Complete first draft or clearly recorded missing sections. | [O08][o08] |

### Week 21 · P6 · Proposal feedback and refinement

**Targets:** 2027-03-10–2027-03-16 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-03-10 · A · 90 min | Request review correctly | Use the project's stated early-review process if available; send a concise project-specific request yourself. | Feedback request/draft and date saved; no expectation of guaranteed review. | [O08][o08] · [O09][o09] |
| 2027-03-11 · B · 90 min | Strengthen the risky implementation | Improve the spike or test the largest remaining assumption while waiting for feedback. | Better technical evidence or a precise limitation. | [D09][d09] |
| 2027-03-12 · C · 90 min | Scope and schedule check | Compare MVP, workload, exams and project-size requirements; cut optional work before compressing required work. | Honest effort estimate and feasible commitments. | [O02][o02] · [O08][o08] |
| 2027-03-13 · D · 90 min | Address actual feedback | Revise only what the feedback supports, recording why each change was made. | Feedback log maps comments to proposal changes. | [O09][o09] |
| 2027-03-14 · E · 90 min | Readability and evidence audit | Check links, terminology, tests and factual claims; remove vague promises and unsupported statements. | A reviewer can inspect all cited evidence. | [O08][o08] |
| 2027-03-15 · F · 90 min | Check official application status | Open the official timeline; record actual open/deadline timestamps if announced. Do not assume this calendar date is opening day. | Exact fields are sourced or remain null. | [O03][o03] · [O01][o01] |
| 2027-03-16 · G · 30 min | Light review | Explain the proposal in three minutes and list the two unresolved technical questions. | Clear independent explanation and next revision priorities. | [O08][o08] |

### Week 22 · P6 · Application-window preparation, event-dependent

**Targets:** 2027-03-17–2027-03-23 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-03-17 · A · 90 min | Official registration readiness | If applications are actually open, follow the official registration flow and current rules. Otherwise continue the draft locally. | Actual action/status recorded; no planner checkbox substitutes for registration. | [O01][o01] · [O04][o04] |
| 2027-03-18 · B · 90 min | Eligibility and project prerequisites | Recheck current eligibility, accepted organization, project-specific requirements and permitted AI assistance. | Requirements are sourced and any gap is explicitly recorded. | [O02][o02] · [O12][o12] · [R09][r09] |
| 2027-03-19 · C · 90 min | Finalize technical detail | Clarify unresolved implementation assumptions using code/tests and relevant community feedback. | Proposal separates tested evidence from intended future work. | [O08][o08] |
| 2027-03-20 · D · 90 min | Timeline and fallback plan | Review deliverables, dependencies, buffer and exam dates against the confirmed program schedule when available. | No official date is replaced by a personal target. | [O03][o03] · [O08][o08] |
| 2027-03-21 · E · 90 min | Prepare submission format | Follow the current organization's and platform's file/format instructions; preview exported draft and links. | Readable current-format proposal with correct organization/template. | [O08][o08] · [O01][o01] |
| 2027-03-22 · F · 90 min | Feedback or submission preparation | Address final feedback; if ready and the window is open, prepare to submit through the official site well before its deadline. | Actual state is draft/ready/submitted, not auto-accepted. | [O01][o01] · [O09][o09] |
| 2027-03-23 · G · 30 min | Window/deadline review | Review remaining real deadline time; set a personal reminder relative to that confirmed timestamp. | No fabricated countdown if the official deadline is unknown. | [O03][o03] |

### Week 23 · P6 · Final proposal and actual submission

**Targets:** 2027-03-24–2027-03-30 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-03-24 · A · 90 min | Last factual audit | Check identity, project, current ideas/template, evidence links, authorship and declared availability. | Every important claim is accurate and inspectable. | [O08][o08] · [O12][o12] |
| 2027-03-25 · B · 90 min | Technical consistency | Cross-check the proposal against source/API behavior and prototype/test results. | No contradiction between intended design and existing code. | [O08][o08] · [D09][d09] |
| 2027-03-26 · C · 90 min | Final review changes | Resolve received actionable feedback; avoid a last-minute unreviewed scope expansion. | Final change log and clearly bounded MVP. | [O09][o09] |
| 2027-03-27 · D · 90 min | Submit if the real window is open | Submit only on the official GSoC platform, following its current instructions. If already submitted, verify status; if closed, log the true outcome. | Manual confirmation/evidence from the actual platform or honest unsubmitted status. | [O01][o01] · [O03][o03] |
| 2027-03-28 · E · 90 min | Verify submission and continue work | Check uploaded version/confirmation when possible. Resume a scoped contribution rather than repeatedly asking about selection. | Correct proposal version/status and one useful project action. | [O01][o01] · [O09][o09] |
| 2027-03-29 · F · 90 min | Prepare technical explanation | Explain users, architecture, risks and test plan without reading scripted answers. | Five-minute explanation and a list of weak points to review. | [O08][o08] |
| 2027-03-30 · G · 30 min | Weekly buffer | Recheck the real deadline and status; finish any legitimate submission correction while permitted. | Accurate submission record; no silent deadline movement. | [O03][o03] |

### Week 24 · P6 · Deadline follow-through and continuation

**Targets:** 2027-03-31–2027-04-06 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-03-31 · A · 90 min | Check the actual deadline state | Verify the confirmed timeline. If submission remains open and your proposal is ready, complete it; if closed, do not claim otherwise. | True submission state and official deadline source retained. | [O03][o03] · [O01][o01] |
| 2027-04-01 · B · 90 min | Archive the submitted version | Save the exact submitted draft, evidence and any confirmation locally; distinguish it from later notes. | Version snapshot and actual submission time recorded. | [O08][o08] |
| 2027-04-02 · C · 90 min | Return to contribution work | Choose a manageable issue/test or finish an existing review in the main community. | Real next action without a claim that selection is assured. | [D02][d02] |
| 2027-04-03 · D · 90 min | Implement or investigate | Work on the chosen issue with the established reproduce/test/fix workflow. | Tested local change or useful reproduction evidence. | [D09][d09] |
| 2027-04-04 · E · 90 min | Documentation and validation | Inspect diff, run relevant checks and document actual results. | Small coherent ready change and accurate validation log. | [D02][d02] |
| 2027-04-05 · F · 90 min | Review response | Address feedback on contributions or proposal questions through the agreed channel. | Updated action list and specific answers with evidence. | [O09][o09] |
| 2027-04-06 · G · 30 min | Light review | Summarize what was submitted and learned; plan the waiting period without daily result speculation. | Evidence archive and a healthy continuation plan. | [O13][o13] |

### Week 25 · P7 · Continue useful work while applications are reviewed

**Targets:** 2027-04-07–2027-04-13 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-04-07 · A · 90 min | Review main-project priorities | Read current reviews/issues and choose one small action useful independent of GSoC selection. | Bounded task tied to a project need. | [D06][d06] |
| 2027-04-08 · B · 90 min | Reproduce or test | Create the smallest relevant example or regression test. | Clear observed behavior and test/reproduction evidence. | [D09][d09] |
| 2027-04-09 · C · 90 min | Implement the change | Make a focused correction or improvement; avoid starting a huge unrequested feature. | Understandable diff and appropriate local behavior. | [D02][d02] |
| 2027-04-10 · D · 90 min | Validate | Run focused checks, inspect compatibility and update necessary documentation. | Actual validation results and limitations recorded. | [D09][d09] |
| 2027-04-11 · E · 90 min | Explain the proposal | Practice a short technical walk-through of the submitted proposal and demonstrate its spike. | Can answer what/why/how/test/risk questions honestly. | [O08][o08] |
| 2027-04-12 · F · 90 min | Community communication | Respond to actual questions; share a concise update if the project expects it. Do not contact multiple mentors for status. | Helpful update or review response, not repeated pings. | [O09][o09] |
| 2027-04-13 · G · 30 min | Weekly review | Keep studying only the gaps found in real work; check announcements at a reasonable cadence. | Useful next-week priority and current fact status. | [O03][o03] |

### Week 26 · P7 · Technical discussion and review readiness

**Targets:** 2027-04-14–2027-04-20 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-04-14 · A · 90 min | Architecture recall | Explain the relevant source/API path, dependencies and public behavior from memory. | Accurate five-minute code map explanation. | [O08][o08] |
| 2027-04-15 · B · 90 min | Test-plan recall | Explain how each main deliverable will be verified and which cases may fail. | Concrete validation explanation rather than generic testing promises. | [D09][d09] |
| 2027-04-16 · C · 90 min | Trade-offs and alternatives | Discuss one plausible alternative approach and why your design is currently preferable. | Reasoned trade-off plus what evidence might change your mind. | [O08][o08] |
| 2027-04-17 · D · 90 min | Answer a difficult question | Investigate an unresolved proposal assumption or an actual community question before writing an answer. | Evidence-backed answer or honest unresolved state. | [O09][o09] |
| 2027-04-18 · E · 90 min | Contribution follow-through | Resolve a review item or finalize a small local contribution. | No abandoned actionable review without an explanation. | [D02][d02] |
| 2027-04-19 · F · 90 min | Availability update | Recheck exam/teaching commitments and share a change if it affects a potential project timeline. | Current availability record, not a false full-time promise. | [O08][o08] · [O09][o09] |
| 2027-04-20 · G · 30 min | Light review and buffer | Review feedback, rest/catch up and choose one useful next task. | Sustainable plan for the next week. | [O09][o09] |

### Week 27 · P7 · First-milestone simulation

**Targets:** 2027-04-21–2027-04-27 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-04-21 · A · 90 min | Pick a safe simulation task | Choose a local task resembling the proposal's first milestone without doing broad unapproved upstream changes. | Small simulated work item and acceptance criterion. | [O08][o08] |
| 2027-04-22 · B · 90 min | Plan the task | Break it into source research, test, implementation and documentation with honest estimates. | Task plan fits available hours. | [O08][o08] |
| 2027-04-23 · C · 90 min | Code the core behavior | Implement the narrow simulation or improve the existing spike. | A demonstrated behavior connected to the proposal. | [D09][d09] |
| 2027-04-24 · D · 90 min | Validate failure modes | Exercise one realistic failure/boundary case and correct an assumption if needed. | Verification reveals whether the design is robust enough. | [D09][d09] |
| 2027-04-25 · E · 90 min | Write a progress update | Summarize work, evidence, blocker and next step using the same concise format you'd use during GSoC. | A useful update draft without invented progress. | [O09][o09] |
| 2027-04-26 · F · 90 min | Review and revise estimates | Compare planned to actual time; revise assumptions and scope accordingly. | Evidence-based estimate changes recorded. | [O08][o08] |
| 2027-04-27 · G · 30 min | Light review | Review simulation lessons and current official result/start-date status. | Preparation remains useful whichever decision occurs. | [O03][o03] · [O13][o13] |

### Week 28 · P7 · Results checkpoint, only when announced

**Targets:** 2027-04-28–2027-05-04 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-04-28 · A · 90 min | Check official result timing | Open the real timeline/platform. If results are not announced, keep status awaiting_results. | Correct actual status with source, not a guessed announcement date. | [O03][o03] · [O01][o01] |
| 2027-04-29 · B · 90 min | If accepted: read instructions | Only after actual acceptance, read organization onboarding and current program instructions; otherwise continue pending reviews. | Actual acceptance evidence or unchanged awaiting status. | [O05][o05] |
| 2027-04-30 · C · 90 min | If not selected: continuation | If a real decision says not selected, record it, retain work and choose the next useful open-source action. | History preserved; no failure score or progress deletion. | [O13][o13] |
| 2027-05-01 · D · 90 min | Discuss appropriate next steps | Use the prescribed channel for onboarding or a respectful feedback question when appropriate; no demand for selection reasons. | Useful next action or concise draft question. | [O09][o09] |
| 2027-05-02 · E · 90 min | Maintain current work | Resolve open reviews or update your local environment and spike. | Project work remains healthy and reproducible. | [D02][d02] · [D08][d08] |
| 2027-05-03 · F · 90 min | Summer capacity check | Confirm expected weekly hours, exams/leave and internet/workstation availability. | An honest capacity record to discuss with a mentor if selected. | [O08][o08] |
| 2027-05-04 · G · 30 min | Review and branch decision | Select accepted/bonding, awaiting or continuing-open-source mode based only on actual evidence. | Correct next-phase mode and no automatic accepted badge. | [O03][o03] · [O13][o13] |

### Week 29 · P8 · Bonding preparation or sustained contribution

**Targets:** 2027-05-05–2027-05-11 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-05-05 · A · 90 min | Agree on goals if selected | Accepted branch: clarify MVP, scope and responsibilities with mentors. Otherwise: choose one bounded community task. | Agreed notes or a useful contribution goal. | [O05][o05] · [O08][o08] |
| 2027-05-06 · B · 90 min | Current development environment | Run the project at the agreed branch/version and record setup commands and dependencies. | Reproducible environment and relevant focused tests. | [D08][d08] · [D09][d09] |
| 2027-05-07 · C · 90 min | Communication and availability | Accepted branch: agree on channels, updates, timezone and meetings. Other branch: maintain normal review communication. | Clear communication expectations and honest availability. | [O09][o09] |
| 2027-05-08 · D · 90 min | Detailed first work items | Break the first meaningful outcome into small tasks with tests/docs and dependencies. | Concrete task list with verifiable completion criteria. | [O08][o08] |
| 2027-05-09 · E · 90 min | Resolve a setup or review blocker | Use the normal workflow to investigate one blocker; provide logs and hypothesis if asking for help. | Blocker resolved or precisely reported. | [O09][o09] · [D09][d09] |
| 2027-05-10 · F · 90 min | Update milestone plan | Align personal work items with confirmed program dates and mentor guidance if accepted; retain estimates if unknown. | No invented coding-start date or moved official deadline. | [O03][o03] |
| 2027-05-11 · G · 30 min | Light review | Review setup, expectations and next week; include planned rest and course/exam commitments. | Ready next actions with sustainable capacity. | [O09][o09] |

### Week 30 · P8 · Codebase readiness and evaluation expectations

**Targets:** 2027-05-12–2027-05-18 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-05-12 · A · 90 min | Deepen first-component understanding | Read source and tests for the first planned work area; locate relevant prior design/review discussion. | Can explain the starting component and its constraints. | [D06][d06] |
| 2027-05-13 · B · 90 min | Evaluation expectations if selected | Ask about deliverables, progress reporting and evaluations through the agreed channel; otherwise improve contribution quality. | Clear expectations or useful local checklist; no assumed evaluation pass. | [O05][o05] |
| 2027-05-14 · C · 90 min | Baseline and tests | Record the baseline behavior and relevant checks for the first work item. | A reproducible baseline suitable for measuring the change. | [D09][d09] |
| 2027-05-15 · D · 90 min | Dependency and risk check | Identify external dependencies, review lead time and setup/compute limits; reduce scope where needed. | Practical risk list and mitigation or fallback. | [O08][o08] |
| 2027-05-16 · E · 90 min | Documentation and research notes | Organize source maps, experiments and setup into concise documentation for your own work and reviewers. | The next contributor/mentor can follow the relevant evidence. | [D06][d06] |
| 2027-05-17 · F · 90 min | Follow-through on feedback | Resolve open questions or review comments; keep the community updated as agreed. | Accurate progress note and clear next action. | [O09][o09] |
| 2027-05-18 · G · 30 min | Weekly recall | Explain first-milestone approach, tests and risks without reading a script. | Ready to begin scoped work, with remaining unknowns explicit. | [O08][o08] |

### Week 31 · P8 · Coding-start readiness, tied to the actual event

**Targets:** 2027-05-19–2027-05-25 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-05-19 · A · 90 min | Check official coding-start date | Verify the real 2027 start and bonding schedule. If unannounced or later, continue preparation without declaring a start. | Sourced date or explicit unknown status. | [O03][o03] |
| 2027-05-20 · B · 90 min | Agree first milestone if selected | Confirm which tasks should begin at coding start and what completion evidence mentors expect. | Mentor-agreed starting scope or a local contribution plan. | [O05][o05] · [O08][o08] |
| 2027-05-21 · C · 90 min | Environment rehearsal | From a clean checkout, run setup, example and first-milestone tests with agreed versions. | Setup rehearsal passes or an actionable blocker is recorded. | [D08][d08] · [D09][d09] |
| 2027-05-22 · D · 90 min | Issue and branch preparation | Prepare a narrow task/branch following community rules; avoid premature broad changes or claiming approval. | Starting task and branch are ready with test criteria. | [D02][d02] |
| 2027-05-23 · E · 90 min | Schedule and capacity rehearsal | Fit focused work, updates, college/teaching and rest into the actual week's capacity. | A sustainable weekly schedule rather than inflated study hours. | [O08][o08] |
| 2027-05-24 · F · 90 min | Documentation and backup | Export notes/proposal/evidence and verify the work plan matches current source and dates. | Backup and current starting checklist saved. | [O09][o09] |
| 2027-05-25 · G · 30 min | Light readiness review | Review remaining blockers; only switch to coding-active mode if officially selected and the real start has arrived. | Correct mode based on actual status and dates. | [O03][o03] · [O05][o05] |

### Week 32 · P8 · Final preparation horizon and transition

**Targets:** 2027-05-26–2027-05-31 · Personal preparation dates.

| Date / slot / core minutes | Learn or focus | Practical action | Done when / evidence | English resources |
| --- | --- | --- | --- | --- |
| 2027-05-26 · A · 90 min | Actual-event transition | If selected and coding has begun, use the mentor-agreed project plan. Otherwise continue one useful preparation/contribution task. | Mode reflects actual evidence; no automatic program-start badge. | [O03][o03] · [O05][o05] |
| 2027-05-27 · B · 90 min | First scoped action or maintenance | Complete the next agreed small work item or resolve an open contribution review. | Concrete code/test/review evidence rather than a watched-course count. | [D09][d09] |
| 2027-05-28 · C · 90 min | Validate and record | Run relevant checks, capture actual outcomes and write the next technical step. | Test log and accurate progress note. | [D09][d09] |
| 2027-05-29 · D · 90 min | Communication follow-through | Give the agreed update or ask one precise blocker question through the correct channel. | Useful concise communication tied to actual work. | [O09][o09] |
| 2027-05-30 · E · 90 min | Review learning and contribution evidence | Review what you can independently explain, work produced, proposal status and current availability. | Honest portfolio/evidence summary without a Google-intern claim. | [O02][o02] · [O13][o13] |
| 2027-05-31 · F · 90 min | 31 May horizon review | If the real coding start is later, schedule the maintenance cycle. If active, follow mentor milestones. If not selected, continue useful open-source work. | A clear next plan; progress/history retained in every outcome. | [O03][o03] · [O13][o13] |

## 17. Resource provenance and editing instructions

- Research snapshot: 11 October 2026. Official 2027 dates and participation are intentionally unconfirmed. Recheck official sources before applying.
- Link verification means the page/title or an official source-linked destination was opened. It does not mean playback was watched or future availability is guaranteed. All 16 YouTube resources are real retrieved URLs; search fallback URLs are explicitly constructed searches.
- DIPY contribution link R02 is the exact pinned guide linked from its historical ideas page. Read the current repository contribution guidance before starting new work; a historical pinned guide is not a promise of current commands.
- The direct rules page and official directory can depend on client-side rendering. The rules link is official and was opened, but the detailed 2027 rules were not available in this research; read them on the platform when announced.
- Curated recommendations and the dated activities are our planning choices. Contributor stories are attributed examples, not claims that a specific preparation pattern guarantees acceptance.
- To edit the implemented plan, change canonical content/resources in `src/data/gsoc2027.ts`, regenerate personal dates, and keep progress separate. Preserve stable IDs through rescheduling and compatible content edits.
- Adding/removing a required task changes its completion denominator. Show the curriculum version/change summary; do not silently convert old progress into mastery of a replacement task.
- Keep official date fields empty until a sourced announcement. Keep current program facts and historical organization facts separately labelled.
- Next implementation review must confirm the latest project tree, build commands, date/storage tests and that original AI/ML data remains intact.

### Document validation performed

- Generated 223 unique dated target rows in 32 weekly blocks; no date gaps or duplicates.
- First date: 2026-10-21 (Wednesday). Last personal target: 2027-05-31. Before-start countdown on 2026-10-11: 10 days.
- Eight phases covered; each row has a focus, practical action, completion criterion, core time and at least one defined clickable resource.
- 65 reference URLs defined, including 16 YouTube resources and 5 project candidates. No exact 2027 deadline or participation status invented.
- This is document validation, not a claim that the future website implementation/build/UI tests have passed.

### Clickable reference definitions

[v01]: https://youtu.be/YN7uGCg5vLg
[v02]: https://www.youtube.com/watch?v=vA5TTz6BXhY
[v03]: https://www.youtube.com/watch?v=RGOj5yH7evk
[v04]: https://www.youtube.com/watch?v=yzeVMecydCE
[v05]: https://youtu.be/mABpAI-pCw0
[v06]: https://www.youtube.com/watch?v=ix9cRaBkVe0
[v07]: https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU
[v08]: https://www.youtube.com/watch?v=cHYq1MRoyI0
[v09]: https://www.youtube.com/watch?v=6tNS--WetLI
[v10]: https://www.youtube.com/watch?v=QUT1VHiLmmI
[v11]: https://www.youtube.com/watch?v=vmEHCJofslg
[v12]: https://www.youtube.com/watch?v=UO98lJQ3QGI
[v13]: https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_
[v14]: https://www.youtube.com/watch?v=V_xro1bcAuA
[v15]: https://www.youtube.com/watch?v=i_LwzRVP7bg
[v16]: https://www.youtube.com/watch?v=Tz7FsunBbfQ
[d01]: https://docs.github.com/en/get-started/using-github/hello-world
[d02]: https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-open-source
[d03]: https://git-scm.com/book/en/v2
[d04]: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
[d05]: https://github.com/firstcontributions/first-contributions
[d06]: https://opensource.guide/how-to-contribute/
[d07]: https://docs.python.org/3/tutorial/
[d08]: https://docs.python.org/3/tutorial/venv.html
[d09]: https://docs.pytest.org/en/stable/getting-started.html
[d10]: https://www.learnpytorch.io/
[d11]: https://numpy.org/doc/stable/user/absolute_beginners.html
[d12]: https://docs.github.com/en/actions/get-started/quickstart
[o01]: https://summerofcode.withgoogle.com/
[o02]: https://developers.google.com/open-source/gsoc/faq
[o03]: https://developers.google.com/open-source/gsoc/timeline
[o04]: https://summerofcode.withgoogle.com/rules/
[o05]: https://google.github.io/gsocguides/student/
[o06]: https://google.github.io/gsocguides/student/choosing-an-organization
[o07]: https://google.github.io/gsocguides/student/making-first-contact
[o08]: https://google.github.io/gsocguides/student/writing-a-proposal
[o09]: https://google.github.io/gsocguides/student/communication-best-practices
[o10]: https://python-gsoc.org/ideas.html
[o11]: https://github.com/numfocus/gsoc/blob/master/2026/ideas-list.md
[o12]: https://developers.google.com/open-source/gsoc/resources/ai_guidance
[o13]: https://google.github.io/gsocguides/student/being-turned-down
[r01]: https://github.com/dipy/dipy
[r02]: https://github.com/dipy/dipy/blob/aaecdba94a98d0f2ad329932e7c24d31f646f0fd/.github/CONTRIBUTING.md
[r03]: https://github.com/dipy/dipy/issues
[r04]: https://github.com/dipy/dipy/wiki/Google-Summer-of-Code-2026
[r05]: https://github.com/pytorch/ignite
[r06]: https://github.com/pytorch/ignite/blob/master/CONTRIBUTING.md
[r07]: https://github.com/pytorch/ignite/issues
[r08]: https://pytorch-ignite.ai/tutorials/beginner/01-getting-started/
[r09]: https://github.com/pytorch/ignite/wiki/GSoC-2026-project-idea
[r10]: https://github.com/matplotlib/matplotlib
[r11]: https://matplotlib.org/devdocs/devel/index.html
[r12]: https://github.com/matplotlib/matplotlib/issues
[r13]: https://github.com/matplotlib/matplotlib/wiki/Matplotlib-GSoC-2026-Ideas
[r14]: https://github.com/vacanza/holidays
[r15]: https://holidays.readthedocs.io/en/latest/contributing/
[r16]: https://github.com/vacanza/holidays/issues
[r17]: https://github.com/vacanza/holidays/wiki/GSoC-2026
[r18]: https://github.com/opencv/opencv
[r19]: https://github.com/opencv/opencv/wiki/How_to_contribute
[r20]: https://github.com/opencv/opencv/wiki/GSoC_2026
[c01]: https://dipy.org/posts/2023/2023_05_29_Shilpi_Week_0_1.html
[c02]: https://github.com/dipy/dipy/pull/2749
[c03]: https://dipy.org/posts/2026/2026_05_25_Tomas.html
[c04]: https://github.com/wagtail/gsoc/blob/main/contributor-guide.md
