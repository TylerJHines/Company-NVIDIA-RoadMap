# Version 14 — Team charts and leaderboard

## What's new
- Two stacked charts at left: study links and unique reported certifications, by approved employee.
- Leaderboard at right, 100 points per reported certification and 5 per completed study link.
- Points rules table below charts. No scoring dropdown.
- Mobile responsive. Same approved-team privacy and company admin workflow as V13.
- No Firestore schema/rule changes. No new reads beyond the V13 member collection query.

## Safe update for your WORKING V13 TEST website
1. Back up the GitHub repository.
2. Replace only root `academy-team.js`, `academy.css`, and `index.html` with V14 versions.
3. Keep your existing `aio/firebase-config.js`, `firestore.rules`, `academy-cloud.js`, `academy.js`, and all `aio/` and `ain/` files unchanged.
4. Wait for GitHub Pages deployment; hard-refresh (Ctrl+Shift+R).
5. Sign in with approved company account, open Team View. Verify charts, leaderboard and points table.
6. Sign in with non-approved account and confirm no team data is visible.

## Important
This ZIP is a complete V14 site based on the previously supplied V13 files, including the original V13 Firebase config. If you created a separate test Firebase project, DO NOT replace its working `aio/firebase-config.js` with the ZIP copy.

## Scoring
- 100 points per unique self-reported badge code, maximum 6 tracks.
- 5 points per completed study link.
- Ranking tie-breaks: badge count, then completed study links, then name.
- Mock exam and lab histories remain private and do not affect ranking.
