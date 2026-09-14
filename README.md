# Kerala IT Park Jobs — job-board

A React (CRA) site that lists jobs scraped daily from Technopark, Infopark,
and Cyberpark by the [`job-annan-scraper`](../job-annan-scraper) repo — no
backend, no database. It reads a static `public/data/jobs.json` file and
renders filterable job cards.

Built to match [techmyrmidons-web](https://github.com/The-Purple-Movement/techmyrmidons-web)'s
functional pattern (a landing grid of click-through cards, React Router,
plain CSS, `react-icons`) without reusing any of its images/assets.

## Structure

- `public/data/jobs.json` — the data file, updated by the scraper repo's
  `daily-scrape.yml` (see that repo's README for the `JOB_BOARD_REPO` /
  `JOB_BOARD_REPO_TOKEN` setup). Each job has:
  `title, company, location, posted_date, deadline, apply_link, description,
  it_park, role_type, experience_level, job_id`.
- `src/pages/Home` — landing page: one card per IT Park (+ "All Jobs"), each
  showing a live job count and linking into the filtered list.
- `src/pages/JobsPage` — the job list + filter bar, reachable at `/jobs` or
  `/jobs/:park` (e.g. `/jobs/Technopark`).
- `src/Components/Filters` — search (title/company) + dropdowns for IT Park,
  Experience Level (Fresher / Intermediate / Senior — from the scraper's
  `experience_classifier.py`), Role Type, and Location. Role/Location options
  are derived from whatever's actually in `jobs.json`, so they never go stale.
- `src/Components/JobCard` / `src/Components/ParkCard` — the two card types.
- `src/hooks/useJobs.js` — fetches and caches `public/data/jobs.json`.

## Local development

```bash
npm install
npm start        # http://localhost:3000
```

To test with fresh data, copy the scraper's output over the static file:

```bash
cp ../job-annan-scraper/jobs.json public/data/jobs.json
```

## Build

```bash
npm run build     # outputs to build/
```
