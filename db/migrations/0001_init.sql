CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE ping_results (
  time timestamptz NOT NULL,
  probe_id integer NOT NULL,
  measurement_id integer NOT NULL,
  dst_addr text NOT NULL,
  dst_name text,
  rtt_avg_ms double precision,
  rtt_min_ms double precision,
  rtt_max_ms double precision,
  packet_loss_pct double precision,
  PRIMARY KEY (time, probe_id, measurement_id)
);

SELECT create_hypertable('ping_results', 'time');
