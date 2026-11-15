# V13 Team View — manual administrator approval (Firebase Spark)

## Important: no company administrator is auto-created
This is intentional. A random person with an email address cannot grant themselves company administration. You, the academy owner, bootstrap each company's administrator in the Firebase Console. Employees request access; the administrator approves.

## Deploy
1. Back up your existing GitHub repository and Firestore rules.
2. Replace root `index.html`, `academy.js`, `academy.css`, `academy-cloud.js`; add root `academy-team.js`. Keep `aio/`, `ain/`, and `aio/firebase-config.js` unchanged.
3. Firebase Console → Firestore Database → Rules: paste **the entire** included `firestore.rules` and publish. It preserves existing progress, exam, lab, and certification permissions.
4. Firebase Console → Firestore Database → Data: create document `companies/teksystems.com` with fields `name` (string) `TEKsystems`, `adminUid` (string) your Firebase Authentication user UID. You must sign in with a verified `@teksystems.com` Google account to use the team as the admin. Do not use the email as the UID.
5. Create document `companies/teksystems.com/members/<your-admin-UID>` with `uid` (string) same UID, `email` (string) exact verified email, `name` (string) display name, `role` (string) `admin`, `status` (string) `active`, `completed` (number) 0, `total` (number) 0, `certifications` (array) empty, `updatedAt` (string) empty. This is a one-time trusted console bootstrap.
6. For another company, create `companies/<company-domain>` and bootstrap its admin the same way. Do not give arbitrary employees admin rights.
7. Deploy GitHub Pages. The Team View tab appears for everyone but reveals no member data to outsiders. A company employee with verified email can request access only if their company has a registered workspace.

## Test
- Sign in as the admin, open Team View, confirm company and member appear.
- Sign in as another verified company-domain user, click Request team access. Admin refreshes and approves. Employee refreshes and sees the team.
- Sign in as a different company's account or personal Gmail. Confirm no access to TEKsystems members.
- In Firebase Rules Playground or Emulator, confirm nonmembers cannot read `/companies/teksystems.com/members/*` or `/companies/teksystems.com/requests/*`, and members cannot write their own `role` or create membership.
- Change a study checkbox or save a badge, refresh Team View, and check summary sync. Simulator-specific lab/exam records are **not** shared.

## Privacy and limits
- Only aggregate study-link completion and self-reported badge **codes** are shared, not private badge URLs, exam history, or lab history.
- Member names and email addresses are visible to approved coworkers. Obtain participant consent and agree on company use before deployment.
- Revoked members lose Firestore read access immediately; they may still have previously viewed information in browser memory until refresh.
- Google sign-in with a company-looking email does not prove current employment. Administrator must independently verify requests before approval. Firebase company membership is enforced by security rules, not UI alone.
- Firebase Spark has free-tier quotas; no Storage or Blaze required for this feature. This version does not include automatic employer offboarding, corporate SSO, or identity proofing.
- No live production Firebase sign-in, writes, or Firestore security-rule emulator tests were performed in this environment. Do not deploy to production without the acceptance checks above.
