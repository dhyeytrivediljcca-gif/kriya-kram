# क्रिया-क्रम

क्रिया-क्रम is a calm, mobile-first task planner. The current implementation is a local-first PWA: tasks and projects persist in IndexedDB, and the installed app shell and bundled Hindi, Gujarati, and English interface are available offline.

## Run locally

Requirements: Node.js 20+ and npm.

```sh
npm install
npm run dev
```

Use the URL printed by Vite. Localhost is a secure context for PWA development.

## Features available

- Add, edit, complete, reopen, search, and delete tasks. Task fields include a description, due date, priority, and project.
- Inbox, Today (including overdue work), Upcoming, All Tasks, Completed, Calendar, Projects, and Productivity views.
- Create projects, inspect their task list and completion progress, and delete a project without deleting its tasks.
- Hindi, Gujarati, and English interface translations; the language choice is saved on this device.
- Light and dark themes; the theme choice is saved on this device.
- IndexedDB task persistence and an installable offline application shell.
- Responsive navigation, a month calendar, keyboard-operable forms, focus indicators, and reduced-motion support.
- A collapsible desktop navigation rail, contextual empty states, a data-derived Today progress bar, and grouped Upcoming tasks.

User-created task and project text is not translated.

## Build and preview

```sh
npm run build
npm run preview
```

The app is configured for deployment to static SPA hosts. Configure the host to rewrite application routes to `index.html`. Production PWA installation requires HTTPS.

## PWA and offline behavior

The service worker precaches the app shell and bundled assets. Task and project changes are committed locally to IndexedDB before the UI reports success, so task CRUD works without a network connection. Language, theme, and all local data are device/browser-specific.

This version does **not** sync to a server, authenticate users, or synchronize changes across devices. It does not claim background sync. Clearing browser storage removes local task data. Do not use it as a multi-user/shared-device account system.

The provided `supabase/migrations/0001_initial_schema.sql` is a starting point for a future authenticated cloud deployment; it is not currently applied or wired into the UI. Cloud authentication, conflict resolution, account separation, and server sync require a configured Supabase project and additional implementation.

## Brand assets

The original supplied wordmark is at `public/brand/kriya-kram-logo.png`. The app header uses the artwork without redrawing the Devanagari lettering. The supplied square app-symbol artwork is preserved at `public/icons/kriya-kram-icon-original.png` and used for the browser favicon, Apple touch icon, and 192px/512px PWA icons.

## Manual checks

1. Run `npm run dev`, create a task with a title only, then reload and confirm it remains.
2. Add a due date and project; test Today, Upcoming, Calendar, Projects, and Completed.
3. Disconnect the network after the app has loaded and verify task creation, completion, and language/theme switching still work.
4. Change language and theme, reload, and confirm both choices persist. Inspect हिन्दी and ગુજરાતી text at narrow mobile widths.
5. Build with `npm run build`, serve the production output over HTTPS (or localhost), install the app, then reload offline.

## Configuration

`.env.example` lists reserved Supabase public configuration variable names. There are no active cloud features in this version, so adding those variables alone will not enable authentication or sync. Never put a Supabase service-role key or other privileged secret in a frontend environment variable.
