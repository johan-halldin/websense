-- Some RIPE Atlas results report a fully lossy ping as rtt_avg_ms/min/max =
-- -1 rather than omitting the field. normalize.js now guards new ingests
-- against this; this backfills rows already stored before that fix.

UPDATE ping_results
SET rtt_avg_ms = NULL
WHERE rtt_avg_ms < 0;

UPDATE ping_results
SET rtt_min_ms = NULL
WHERE rtt_min_ms < 0;

UPDATE ping_results
SET rtt_max_ms = NULL
WHERE rtt_max_ms < 0;
