# Rush Deal Tracker

Wall-mounted dashboard showing days since last mutual and last property purchase.

## Quick Start

```bash
docker compose up --build
```

Then open `http://localhost:3000` on the display machine.

## Usage

| URL | Purpose |
|-----|---------|
| `http://localhost:3000/` | Wall display — full-screen this on the monitor |
| `http://localhost:3000/update` | Update the dates (manual or Excel upload) |

## Data

Dates are stored in `./data/dates.json` on the host machine.
The file is created automatically on first save.
It survives container restarts and rebuilds.

## Updating dates

**Manual entry** — go to `/update`, pick the dates, hit Save.

**Excel upload** — go to `/update`, switch to the Upload tab, drop your spreadsheet,
select which columns hold the mutual and purchase dates.
The app finds the most recent date in each column automatically.

## Rebuild after code changes

```bash
docker compose up --build
```
