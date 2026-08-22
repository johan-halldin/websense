const MEASUREMENT_ID = Number(process.env.RIPE_MEASUREMENT_ID);
if (!Number.isInteger(MEASUREMENT_ID)) {
  throw new Error("RIPE_MEASUREMENT_ID must be set to an integer");
}

const PROBE_IDS = (process.env.RIPE_PROBE_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter((id) => id.length > 0)
  .map(Number);
if (PROBE_IDS.length === 0 || PROBE_IDS.some((id) => !Number.isInteger(id))) {
  throw new Error(
    "RIPE_PROBE_IDS must be set to a comma-separated list of integers",
  );
}

export { MEASUREMENT_ID, PROBE_IDS };
