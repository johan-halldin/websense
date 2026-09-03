-- The previous Stockholm and London Anchoring Mesh targets show sustained
-- destination-wide ICMP loss. These replacements are connected IPv4-capable
-- Anchors whose mesh measurements were validated from the existing sources.
UPDATE cities
SET
  lat = 51.5205,
  lon = -0.0705,
  probe_id = 6657,
  measurement_id = 23196887
WHERE name = 'London';

UPDATE cities
SET
  lat = 59.4095,
  lon = 17.9485,
  probe_id = 7434,
  measurement_id = 84292484
WHERE name = 'Stockholm';

-- RIPE Atlas classifies this probe under CN; WebSense presents the city using
-- the Hong Kong country code, which is the intended product label.
UPDATE cities
SET country = 'HK'
WHERE name = 'Hong Kong';
