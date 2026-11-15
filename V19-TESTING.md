Version 19: Corrected preparation categories, team progress synchronization, and Firebase configuration.

Core classifications:
- NCA-APC: first 3 core, last 3 optional.
- NCP-ARI: first 4 core, last 2 optional.
- NCP-AIN: all core except Introduction to Networking (3rd resource).

Team View now reads both AIO profile completion and the individual /users/{uid}/labs documents, plus AIN progress. It also checks account-owned browser storage, and refreshes the member summary when Team View refreshes.

Important: Live Firebase sign-in, Firestore security rules, and the specific account's completed lab data cannot be verified in this offline test environment. Firebase rules must allow the logged-in user to read /users/{uid}/labs/{labId} and /users/{uid}/profile/progress, and update their own approved company member document. On first deploy, open the AIO simulator with the same Google account, verify 1/15, return to Team View, and click Refresh team. Allow several seconds for sync.

Points: 100 per unique badge + 5 per completed resource + 15 per unique completed AIO or AIN lab. Estimated time is derived from completed resources plus 20 minutes per AIO lab or 15 minutes per AIN lab, not actual time tracking.
