# Local Supabase Setup

QShieldX uses Supabase locally for development. It does not connect to a hosted
Supabase project or a cloud database.

See the official guide: https://supabase.com/docs/guides/local-development

## Prerequisites

- Docker Desktop is installed and running.
- Node.js and `npx` are installed.
- Run Supabase commands from the repository root (`D:\qshieldx`).

The Supabase CLI is already listed in the root `package.json`, so use `npx
supabase` in this repository. Do not install or use a globally installed CLI
unless it is the same version.

## Start the local Supabase stack

The repository already contains `supabase/config.toml` and the migrations
directory. Therefore, `supabase init` is not needed. It will report that the
project is already initialized.

If `npx supabase status` shows a `linked_project`, remove the remote-link
metadata before continuing:

```powershell
npx supabase unlink
```

This only removes the local CLI link. It does not delete or change any remote
database.

From PowerShell:

```powershell
Set-Location D:\qshieldx
npx supabase start
```

The first start downloads the required Docker images and can take several
minutes. After it starts, inspect the local connection details:

```powershell
npx supabase status
```

Important local URLs:

- Supabase API: http://127.0.0.1:54321
- Supabase Studio: http://127.0.0.1:54323
- Local Postgres: `127.0.0.1:54322`
- Email testing UI: http://127.0.0.1:54324

Open Studio to inspect tables, users, storage, and SQL data locally.

## Apply the migrations

Apply all migrations from `supabase/migrations/` and recreate the local
database with:

```powershell
npx supabase db reset
```

`db reset` removes existing local data, recreates the database, applies the
migrations in timestamp order, and then runs the configured seed files. Do not
use this command when you need to preserve local data.

To check that the local database is running and view migration state:

```powershell
npx supabase status
```

Do not use `npx supabase migration list` in this local-only workflow while a
remote project is linked; that command can contact the linked project.

There is currently no `supabase/seed.sql` file. The seed step is enabled in
`config.toml`, but it has nothing to load until a seed file is added.

## Configure the frontend

Get the local API URL and keys:

```powershell
npx supabase status -o env
```

Create `frontend/.env.local` with the local URL and the local **anon** key:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
```

Never put the service-role key in `frontend/.env.local` or expose it to the
browser.

Start the frontend in a second terminal:

```powershell
Set-Location D:\qshieldx\frontend
pnpm install
pnpm dev
```

The frontend runs at http://localhost:3000.

## Configure the backend

Create `backend/.env` using the same local API URL, anon key, and the local
**service-role** key from `npx supabase status -o env`:

```dotenv
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
GEMINI_API_KEY=<optional-for-local-ai-features>
```

The service-role key is for the backend only. Do not commit `frontend/.env.local`
or `backend/.env` if they contain real keys.

## Create and test a new migration

Create a migration from the repository root:

```powershell
npx supabase migration new describe_change
```

Edit the generated SQL file under `supabase/migrations/`, then apply it:

```powershell
npx supabase db reset
```

Inspect the result in Studio or with the local database connection shown by
`npx supabase status`.

## Stop or reset the environment

Stop the containers without deleting their data:

```powershell
npx supabase stop
```

Stop the containers and remove their local data:

```powershell
npx supabase stop --no-backup
```

The next `npx supabase start` recreates the local services. Run
`npx supabase db reset` whenever you need to apply the complete migration
history from a clean local database.

## Local-only rules

- Do not run `npx supabase link`.
- If a remote project is already linked, run `npx supabase unlink` before local
	development.
- Do not run `npx supabase db push`; that targets a linked remote project.
- Do not use production or hosted Supabase credentials locally.
- Keep Docker Desktop running while using the app.

