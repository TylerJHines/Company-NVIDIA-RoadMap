# V17 changes and checks

- Core vs optional resources set from the six screenshots in the supplied order.
- Per-path estimated time shown for core preparation and all resources. Times are estimates, not measured duration.
- Duplicate resource comparison uses canonical resource identifiers and excludes the current path.
- AIO/AIN help is grouped by command family.
- Team summary retries after academy progress hydration and reads available local AIN completion cache as a fallback.

## Important
Team data depends on successful Firebase reads/writes. Open Team View and choose Refresh team after opening simulators. If a lab still does not sync, inspect Firestore users/{uid}/profile/progress and users/{uid}/ain/progress, and browser console errors. Live Firebase was not tested.

Keep existing live aio/firebase-config.js. Deploy to test GitHub Pages before production.
