# Rush Deal Tracker

Wall-mounted dashboard showing days since last mutual and last property purchase.

## Quick Start

```bash
docker compose up --build
```

Then open `http://localhost:3011` on the display machine.

## Usage

| URL | Purpose |
|-----|---------|
| `http://localhost:3011/` | Wall display — full-screen this on the monitor |
| `http://localhost:3011/update` | Update the dates manually |

## Data

Dates are stored in `./data/dates.json` on the host machine.
The file is created automatically on first save.
It survives container restarts and rebuilds.

## Updating dates

**Manual entry** — go to `/update`, pick the dates, hit Save.

## Rebuild after code changes

```bash
docker compose up --build
```
