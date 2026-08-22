# WebSense — Technical Plan

## Goal

Build a public project that monitors the health of the Internet using
real-world network measurements, with an emphasis on learning:

- Time-series data
- PostgreSQL + TimescaleDB
- Real-time/event-driven systems
- Network measurement concepts
- Backend/server infrastructure
- Data visualization

Use [RIPE Atlas](https://atlas.ripe.net/) as the initial source of
latency/network measurements.

## Server

- Node.js
- JavaScript with JSDoc types
- PostgreSQL
- TimescaleDB

## Database

Use TimescaleDB on PostgreSQL to learn time-series infrastructure properly.

Initial goals:

- Hypertables
- Time-based indexing
- Retention policies
- Continuous aggregates
- Efficient time-window queries
- Aggregating large measurement streams
- PostgreSQL querying alongside TimescaleDB features

Database schema and migrations live in `db/`, independently of the
JavaScript workspace.

## Initial Milestones

### Repository/tooling

- pnpm workspace
- Prettier
- Biome
- TypeScript/JSDoc checking
- Vitest
- Zed project settings

### Infrastructure

- Docker Compose
- PostgreSQL + TimescaleDB
- Database migrations
- Basic connection from Node.js

### Data ingestion

- Connect to RIPE Atlas
- Fetch/receive measurements
- Normalize measurements
- Store them efficiently

### API

- Expose historical measurements
- Time-window queries
- Aggregations/statistics

### Client

- Establish UI components
- Build latency/time-series visualizations
- Add geographic visualization

### Internet health

- Define useful health metrics
- Detect unusual latency/packet-loss patterns
- Compare regions, destinations, and time periods
- Eventually correlate network disturbances with routing/BGP events

## Guiding principle

Build a small working vertical slice first:

```
one RIPE Atlas measurement
        ↓
TimescaleDB
        ↓
Node API
        ↓
Lit UI
        ↓
one useful visualization
```
