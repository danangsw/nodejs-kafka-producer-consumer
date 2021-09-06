CREATE TABLE appl_order (
    id varchar(50) not null,
    branch varchar(50) not null,
    product varchar(50) not null,
    quantity int not null,
    order_date timestamptz not null,
    approval_status varchar(2) not null,
    approval_date timestamptz not null,
    recorded_at timestamptz not null default now()
);

SELECT create_hypertable('appl_order', 'order_date');
--SELECT create_hypertable('appl_order', 'approval_date');
--SELECT create_hypertable('appl_order', 'recorded_at');


CREATE VIEW last_30_min_aproval_rate AS (
  SELECT time_bucket('5 seconds', order_date) AS five_sec_interval,
  product,     
    MAX(temperature) AS max_temp
  FROM appl_order
  WHERE approval_date > NOW() - interval '30 minutes'    
  GROUP BY five_sec_interval, product    
  ORDER BY five_sec_interval ASC
);

  SELECT time_bucket('10 seconds', order_date) AS sec_interval, product, approval_status,
  count(*) * 100.0 / count(*) over() AS percent_status
  FROM appl_order
  WHERE order_date > NOW() - interval '30 minutes'    
  GROUP BY sec_interval, product, approval_status
  ORDER BY sec_interval ASC


CREATE OR REPLACE VIEW last_30_min_approval_rate AS (
  SELECT time_bucket('30 seconds', recorded_at) AS sec_interval, approval_status,
  round((count(*) * 100.0) / sum(count(*)) over(partition by time_bucket('30 seconds', recorded_at)), 2) AS approval_rate
  FROM appl_order
  WHERE recorded_at > NOW() - interval '30 minutes'
  GROUP BY sec_interval, approval_status
  ORDER BY sec_interval ASC
);

CREATE OR REPLACE 