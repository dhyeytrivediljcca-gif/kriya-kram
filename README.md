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

The app requires an individual Supabase Auth account before showing the planner. Supabase's supported browser session persistence and refresh are used; passwords are never saved by the app. Offline use is available only when a valid Supabase session is already stored on that device. The service worker caches the app shell and static assets only; it does not cache authentication responses or API data.

Tasks and projects use separate device-local IndexedDB databases keyed to each authenticated user; there is no cloud task sync. Existing local tasks are copied (not removed) into the first account that signs in on that browser profile. Local task data is not encrypted; anyone with access to that browser profile or developer tools can inspect it. Deleting a Supabase account does not erase its local IndexedDB database.

## Accounts and administrator setup

1. In Supabase Authentication settings, disable public sign-ups. Set the deployed app URL as the Site URL, add `https://your-domain.example/set-password*` (and your localhost development URL) to the allowed Redirect URLs, and configure SMTP so invitation and password-reset emails can be delivered.
2. Apply `supabase/migrations/0002_user_profiles.sql` in the Supabase SQL Editor. It creates the private username-to-user mapping table, enables RLS, and grants access only to the server's `service_role`; it does not alter tasks. If using the Supabase migration CLI, check remote migration history first and review `0001_initial_schema.sql` before applying it.
3. Set these **public** client variables in local `.env` and in Vercel's Production/Preview/Development environments:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

   Restart Vite after local changes and redeploy after changing Vercel variables. Never add a service-role key, secret API key, or database password to these frontend variables.
4. Create the first administrator Auth user from the Supabase dashboard. In the Supabase SQL Editor, assign its server-controlled role and username (replace the email and username):

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where lower(email) = lower('admin@example.com');

   insert into public.user_profiles (user_id, username)
   select id, 'admin'
   from auth.users
   where lower(email) = lower('admin@example.com');
   ```

   Confirm each statement affects exactly one account, then sign out and sign back in so the role is present in the session. `app_metadata` is checked by the Edge Function; user-editable metadata is not trusted. Usernames are unique, lowercase letters/numbers/underscores, 3–32 characters.
5. Deploy both Edge Functions from this repository using the Supabase CLI:

   ```sh
   supabase link --project-ref your-project-ref
   supabase secrets set APP_SITE_URL=https://your-domain.example
   supabase functions deploy admin-users
   supabase functions deploy username-login
   ```

   `admin-users` keeps JWT verification enabled and independently checks the authenticated user's `app_metadata.role`. `username-login` disables gateway JWT verification because it is the public sign-in endpoint; it validates the username/password through Supabase Auth and returns the normal Supabase session tokens. Both functions use `SUPABASE_SERVICE_ROLE_KEY` only on the server; never copy it into Vercel or any `VITE_` variable. Set `APP_SITE_URL` to the exact deployed app origin for invite links.
6. Visit Settings → User management to invite accounts and manage users. Each invitation gets a unique username and email link to set its password. Admins can list users, send password-reset emails, disable/enable accounts, and delete non-admin accounts. Admin accounts cannot be modified from this screen; bootstrap or promote administrators only using a trusted Supabase Dashboard/SQL operation.
7. Vercel uses the included `vercel.json` SPA rewrite so direct routes and Supabase password links open the app. Tasks remain local in separate per-user IndexedDB databases; there is no cloud task sync. Existing tasks are copied, not removed, into the first account that signs in on each browser profile. The existing `0001_initial_schema.sql` has owner-scoped RLS policies for future cloud tables, but this app does not query those tables.

## Brand assets

The original supplied wordmark is at `public/brand/kriya-kram-logo.png`. The app header uses the artwork without redrawing the Devanagari lettering. The supplied square app-symbol artwork is preserved at `public/icons/kriya-kram-icon-original.png` and used for the browser favicon, Apple touch icon, and 192px/512px PWA icons.

## Manual checks

1. With the admin Auth user, profile row, migrations, Edge Functions, and environment configured, open `/today` without a saved session; confirm username/password login appears. Verify empty and incorrect credentials show generic localized errors.
2. Sign in as admin, invite a user with a unique username, and complete the email/password setup flow. Confirm a regular user cannot access User management or invoke the admin Edge Function.
3. Sign in as two users in the same browser profile; verify their task lists are separate. Confirm the original local tasks are copied to the first account only.
4. As admin, send a password reset email, disable/re-enable a user, and delete a non-admin test account. Confirm disabled accounts cannot sign in and admin accounts cannot be modified from this screen.
5. Refresh a protected route, then log out from Settings. Confirm login returns and the account's local tasks remain.
6. Change language and theme on the login screen and in Settings, reload, and confirm both preferences persist. Inspect हिन्दी and ગુજરાતી at narrow mobile widths.
7. With a valid saved session, disconnect the network and verify the app opens using its local data. Clear the Supabase session and confirm offline login cannot open the planner.
8. Run `npm run dev`, create a task with a title only, then reload and confirm it remains. Add a due date and project; test Today, Upcoming, Calendar, Projects, and Completed.
9. Build with `npm run build`, serve the production output over HTTPS (or localhost), install the app, then reload offline.

## Configuration

`.env.example` lists the two public Supabase client variables. User management requires both deployed Edge Functions, the `user_profiles` migration, a bootstrapped administrator, and server-only `APP_SITE_URL` configuration. Task synchronization is not implemented. Never put a Supabase service-role key or other privileged secret in frontend configuration.
