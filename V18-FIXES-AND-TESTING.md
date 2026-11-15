# Version 18 — core labels, lab sync, time accounting

- All green-marked resource entries from screenshots are Core preparation. NCP-AIN catalog and learning-path overview remain optional; other listed entries are core. This is user-selected preparation, not NVIDIA exam eligibility.
- Estimated learning hours now sum **each completed pathway entry**, including a resource listed in two pathways. This matches pathway-based completion counts and can count repeated study twice; it is not elapsed time.
- AIO lab sync reads the actual `cf-state` browser storage key, rather than the incorrect `cf-state-v10`, and checks the Firebase account owner before using local data. It also reads Firestore profile progress.
- Team Refresh re-reads simulator completion and re-syncs the team member summary.
- Keep your working `aio/firebase-config.js` and Firestore rules when deploying.

## Verification (requires your live Firebase account)
1. Sign into the Academy and AIO simulator using the same Google account.
2. Confirm AIO dashboard shows 1/15 completed. Return to Team View and click Refresh team.
3. Confirm labs display 1/27 and points increase by 15.
4. Check the learning-hour total. It should equal the sum of durations of every checked resource entry plus 20 minutes per AIO lab and 15 minutes per AIN lab.
5. If your total still differs from 3425 minutes, inspect which specific checked entries differ; the ZIP cannot know your Firebase checkmarks.
