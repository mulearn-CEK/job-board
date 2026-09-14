# Kerala IT Park Jobs — job-board

A public job board for Kerala's IT parks — **Technopark**, **Infopark**, and
**Cyberpark** — scraped daily, classified, and browsable with filters. Live
at whatever URL Vercel gave this deployment; the code here is the frontend
only. It has no backend, no database, and no build-time API calls — it reads
one static JSON file and renders it.

This repo is one half of a two-repo system:

| Repo | Job |
|---|---|
| [`job-annan`](https://github.com/mulearn-CEK/job-annan) (private-ish scraper repo) | Scrapes the 3 IT park sites daily, classifies each job, writes `jobs.json` |
| `job-board` (this repo) | Reads that `jobs.json`, renders it as a filterable site, deployed on Vercel |

## How it works, end to end

```
 GitHub Actions (job-annan, daily 8:30 AM IST cron)
   │
   ├─ scrapers/technopark.py   → hits technopark.in's public JSON API directly
   ├─ scrapers/infopark.py     → parses infopark.in's server-rendered HTML table
   ├─ scrapers/cyberpark.py    → Playwright headless browser, clicks "Load more"
   │
   ├─ main.py merges all three, de-dupes by job_id, and tags every job with:
   │     • role_type         (scrapers/role_classifier.py)
   │     • experience_level  (scrapers/experience_classifier.py)
   │  → writes job-annan/jobs.json
   │
   └─ workflow step commits that file straight into
      job-board/public/data/jobs.json (this repo) and pushes
        │
        ▼
 Vercel is watching this repo's default branch
   → every push triggers a fresh build + deploy automatically
        │
        ▼
 Browser loads the site → src/hooks/useJobs.js fetches
 /data/jobs.json → cards + filters render client-side
```

No server ever runs for the site itself — "daily updates" means a GitHub
Action commits new data and Vercel rebuilds, nothing more.

### Why no backend/database
The original version of this project synced into a Notion database instead.
That's now a legacy/optional path (`job-annan/notion_sync.py`, not run by
default) — this site replaced it because a static JSON file + a static site
host is simpler to keep running and free to host.

## What's in `jobs.json`

Each entry:

```json
{
  "title": "Software Developer - Fresher / 0-6 Months",
  "company": "Stackmod Innovations (P) Ltd",
  "location": "Technopark",
  "posted_date": "2026-09-12",
  "deadline": "2026-10-10",
  "apply_link": "https://technopark.in/job-details/32863",
  "description": "",
  "it_park": "Technopark",
  "role_type": "Software Development",
  "experience_level": "Fresher",
  "job_id": "job-12-32863"
}
```

- `it_park` — always one of `Technopark` / `Infopark` / `Cyberpark`.
- `role_type` — one of 11 buckets (Software Development, QA / Testing,
  DevOps / Cloud / Sysadmin, Data / AI / ML, Design / UI-UX, Technical
  Support, Business / Sales / Marketing, HR / Admin / Finance, Project /
  Product Management, Internship / Trainee, Other) — keyword-matched against
  the title, most-specific bucket wins.
- `experience_level` — `Fresher` / `Intermediate` / `Senior`, also
  keyword-matched off the title (e.g. "Senior", "Lead" → Senior; "Intern",
  "Trainee", "Fresher" → Fresher; no signal → Intermediate).
- `location` is whatever the source site itself printed — it's the park name
  for Technopark/Infopark, but a real city/campus string for Cyberpark (and
  not perfectly consistent there — e.g. "CyberPark Calicut" vs "Govt
  CyberPark - Calicut" both exist as separate values today).

## Site structure

- **`src/pages/Home`** — landing page: one click-through card per IT park
  (+ an "All Jobs" card), each showing a live count pulled from the data.
  Same interaction pattern as
  [techmyrmidons-web](https://github.com/The-Purple-Movement/techmyrmidons-web)'s
  landing cards, rebuilt from scratch with `react-icons` — no shared images
  or CSS from that repo.
- **`src/pages/JobsPage`** — the job list, at `/jobs` (all parks) or
  `/jobs/:park` (e.g. `/jobs/Technopark`, which is what the home cards link
  to — it pre-fills the IT Park filter but stays fully editable).
- **`src/Components/Filters`** — free-text search (matches title + company)
  plus four dropdowns: IT Park, Experience Level, Role Type, Location. Role
  and Location options are computed from whatever's actually present in
  `jobs.json` at load time, so they can never list a stale/missing option.
- **`src/Components/JobCard`** — one listing: title, company, location,
  deadline, a colored Experience badge (green/amber/red for
  Fresher/Intermediate/Senior), a Role badge, and an "Apply" link straight to
  the source posting.
- **`src/Components/ParkCard`** — the landing-page cards.
- **`src/Components/Navbar`** — Home / All Jobs links.
- **`src/hooks/useJobs.js`** — the only data access in the app: one `fetch`
  of `/data/jobs.json` on mount, with `loading` / `ready` / `error` states.

All filtering, searching, and counting happens client-side in
`src/pages/JobsPage/JobsPage.jsx` over the array `useJobs()` returns — there's
no pagination or server-side query because the whole dataset (~800 jobs,
a few hundred KB) is small enough to just ship as one file.

## Local development

```bash
npm install
npm start        # http://localhost:3000
```

To test against fresher data than what's committed:

```bash
cp ../job-annan-scraper/jobs.json public/data/jobs.json
```

```bash
npm run build     # production build → build/
```

## Deployment (Vercel)

This repo is connected to Vercel with the default Create React App preset
(`npm run build`, output dir `build`). Every push to `main` triggers a new
deploy automatically — including the daily commit from `job-annan`'s
GitHub Action, so the live site refreshes with new jobs once a day with no
manual step.

## Keeping the data pipeline wired up

For the daily scrape to actually reach this repo (and therefore the live
site), `job-annan`'s GitHub Actions needs two things set on it — a repo
**variable** and a repo **secret**:

```bash
gh variable set JOB_BOARD_REPO --repo mulearn-CEK/job-annan --body "mulearn-CEK/job-board"
gh secret set JOB_BOARD_REPO_TOKEN --repo mulearn-CEK/job-annan --body "<a token with push access to job-board>"
```

Without both set, `job-annan`'s scraper still runs daily and produces
`jobs.json` — it just has nowhere to publish it, and this repo's
`public/data/jobs.json` stays frozen at whatever was last committed manually.
You can check both are set with:

```bash
gh variable list --repo mulearn-CEK/job-annan
gh secret list --repo mulearn-CEK/job-annan
```

and confirm the pipeline actually ran end-to-end by checking this repo's
commit history for an automated `chore: update jobs.json (...)` commit, or
by triggering `job-annan`'s workflow manually from the Actions tab
(`workflow_dispatch`) and watching for a new push here.

## Extending

- **New IT park**: add a scraper module in `job-annan/scrapers/`, a case in
  `job-annan/main.py`, and one more entry in `PARKS` in
  `src/pages/Home/Home.jsx` — no other site code needs to change since role,
  location, and park filter options are all derived from the data.
- **New role/experience bucket**: edit the keyword lists in
  `job-annan/scrapers/role_classifier.py` or `experience_classifier.py` —
  nothing in this repo needs touching, the dropdowns pick up new values
  automatically from the next `jobs.json`.
