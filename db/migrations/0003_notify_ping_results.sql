CREATE FUNCTION notify_ping_results_updated() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('ping_results_updated', '');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- STATEMENT-level (not ROW-level) so a batch insert of hundreds of rows
-- fires this once per INSERT statement, not once per row.
CREATE TRIGGER ping_results_notify
AFTER INSERT ON ping_results
FOR EACH STATEMENT
EXECUTE FUNCTION notify_ping_results_updated();
