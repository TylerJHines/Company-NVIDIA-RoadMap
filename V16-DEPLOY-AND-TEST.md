# Version 16 — learning metadata, simulator scenarios and team analytics

## Deploy
This ZIP is a full site. Test it in your separate test GitHub Pages repository before replacing your production site. Preserve the current working `aio/firebase-config.js` if you have customized it. Do not overwrite Firestore rules blindly; this release reuses existing authenticated user progress and company-member permissions and does not require a new collection.

For an update from V15, replace:
- `data.js`, `academy.js`, `academy.css`, `academy-team.js`, `index.html`
- `aio/app.js`, `aio/style.css`, `aio/index.html`
- `ain/app.js`, `ain/style.css`, `ain/index.html`

No changes are needed to `aio/firebase-config.js`, `academy-cloud.js`, `aio/cloud.js`, `ain/cloud.js`, or Firestore rules when existing access works.

## Features
- Every existing study link displays estimated minutes, course/reading/practice classification, and academy-recommended core vs optional status.
- Same URL used in multiple paths is identified, including UFM. Completed study time counts each shared URL once; link checkboxes remain independent per certification path.
- NCP-AIO and NCP-AIN scenario panels include incident descriptions, available scenario command syntax, and official certification topic links.
- Successfully finished guided scenarios and fully completed mock-exam lab scenarios contribute to the unique completed-lab count; repeat completions do not multiply points.
- Company member summaries include completed AIO/AIN lab count and estimated learning time, never detailed commands or mock exam scores.
- Team view adds completed-labs and estimated-learning-hours charts, leaderboard points for labs, and points breakdown.

## Scoring
- Self-reported certification badge: 100 points each (max six unique tracks).
- Checked study resource: 5 points per pathway checkbox (including repeated resource across pathways).
- Unique completed simulator lab: 15 points each (15 AIO + 12 AIN).
- Estimated learning minutes = deduplicated checked resource estimates + (AIO unique labs × 20 minutes) + (AIN unique labs × 15 minutes).

All time figures are *estimates of learning effort*, not stopwatch measurements or evidence of actual hours worked. Core/optional labels are academy recommendations, not NVIDIA prerequisites or a guarantee of passing.

## Simulator scope and verification
NVIDIA NCP-AIO: https://www.nvidia.com/en-us/learn/certification/ai-operations-professional/
NVIDIA NCP-AIN: https://www.nvidia.com/en-us/learn/certification/ai-networking-professional/
The source pages define public domains and lab themes, but do not disclose every exam command or scenario. Simulator commands and mock questions are original synthetic practice content, not official NVIDIA exam content. The AIN scenarios were exercised against the included command interpreter in a Node test harness. JavaScript syntax checks passed. No live Firebase or end-to-end Chrome sign-in test was possible in this environment. Test on a staging GitHub Pages domain with an approved team account and refresh Team View after completing a lab.

## Manual acceptance checks
1. Open NCP-ARI; confirm both Udemy links and metadata appear.
2. Open NCA-AIIO and mark UFM complete. Open NCP-AIN and verify 'already completed there' appears on UFM.
3. Open AIO and AIN guided labs and mock lab views. Verify the scenario, command reference, and official topic link.
4. Complete a guided lab in each simulator while signed in. Return to the academy and press Refresh team. Confirm lab count, 15 points per new unique lab, and estimated hours change.
5. Sign in as a different approved company employee to confirm team data stays isolated to the approved workspace. Confirm mock scores remain private.
