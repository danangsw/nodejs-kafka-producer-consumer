create or replace VIEW last_20_min_temp as (
  SELECT time_bucket('5 seconds', recorded_at) AS five_sec_interval,
  location,     
    MAX(temperature) AS max_temp
  FROM temperature
  WHERE recorded_at > NOW() - interval '20 minutes'    
  GROUP BY five_sec_interval, location    
  ORDER BY five_sec_interval ASC
);
