# V21 — AIN lab usability repair

- Removed document height/overflow locks from AIN guided and mock labs.
- Scenario pane scrolls independently on desktop; whole page scrolls on mobile.
- Terminal output remains independently scrollable.
- Added explicit incident targets, symptoms, expected states, and diagnostic scope to all 12 AIN labs.
- Added a readable scenario-specific command checklist.
- Existing Firebase config, progress persistence, scoring, and AIO files preserved.

Testing: syntax, static assertions, ZIP integrity. Live Firebase integration and cross-browser interaction are not validated by those checks.
