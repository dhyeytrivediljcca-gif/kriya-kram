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

The app requires a shared Supabase Auth password before showing the planner. Supabase's supported browser session persistence and refresh are used; the password itself is not saved by the app. Offline use is available only when a valid Supabase session is already stored on that device. The service worker caches the app shell and static assets only; it does not cache authentication responses or API data.

Tasks and projects still use device-local IndexedDB; this change does not add cloud task sync. The shared password gates the application UI, but it does not encrypt existing local data or make a shared device safe for multiple people. The client currently does not query Supabase task tables.

## Shared Supabase authentication setup

1. In the Supabase dashboard, create one dedicated Auth user manually and set its email and password. The password entered in the app is this account's actual Supabase password. Do not add user creation or a service-role key to the client.
2. Disable public user sign-ups in the Supabase Auth settings. The app has no sign-up flow; provisioning is an administrator action. Everyone who uses the app shares this account and its identity.
3. Set these variables in the local `.env` file and in the deployment environment:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   VITE_SHARED_ACCOUNT_EMAIL=the-dedicated-account-email
   ```

   The URL, publishable key, and shared account email are public client configuration. Never use a service-role key, secret API key, or database password here. Restart Vite after changing local environment variables and rebuild/redeploy after changing deployment variables.
4. If deploying cloud tables, review and apply `supabase/migrations/0001_initial_schema.sql` using your normal Supabase migration workflow. Its `projects`, `tasks`, `tags`, and `task_tags` tables have RLS enabled and authenticated-only owner policies based on `auth.uid() = user_id`. No policy or task schema was changed for this login work. Those policies keep one authenticated user's rows separate from another's; disabling public sign-ups ensures the dedicated shared account is the only normal client account. Do not remove these policies to make the UI work.

Adding these settings enables Supabase Auth only. The migration does not connect the current IndexedDB task UI to cloud storage, and this app cannot confirm whether the migration has already been applied to a Supabase project.

## Brand assets

The original supplied wordmark is at `public/brand/kriya-kram-logo.png`. The app header uses the artwork without redrawing the Devanagari lettering. The supplied square app-symbol artwork is preserved at `public/icons/kriya-kram-icon-original.png` and used for the browser favicon, Apple touch icon, and 192px/512px PWA icons.

## Manual checks

1. With the shared Auth user and environment configured, open `/today` in a browser with no saved session; confirm only the password login appears. Verify empty and incorrect passwords show localized errors.
2. Sign in with the dedicated account password, refresh a protected route, then log out from Settings. Confirm the login screen returns and local tasks remain.
3. Change language and theme on the login screen and in Settings, reload, and confirm both preferences persist. Inspect हिन्दी and ગુજરાતી at narrow mobile widths.
4. With a valid saved session, disconnect the network and verify the app opens using its local data. Clear the Supabase session and confirm offline login cannot open the planner.
5. Run `npm run dev`, create a task with a title only, then reload and confirm it remains. Add a due date and project; test Today, Upcoming, Calendar, Projects, and Completed.
6. Build with `npm run build`, serve the production output over HTTPS (or localhost), install the app, then reload offline.

## Configuration

`.env.example` lists the Supabase public configuration variables. Authentication requires a provisioned shared Auth user and all three variables above. Task synchronization is not implemented. Never put a Supabase service-role key or other privileged secret in a frontend environment variable.
