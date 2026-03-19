CREATE TABLE crusher_metrics (
   equipment_id character varying (64) PRIMARY KEY REFERENCES equipments(id) ON DELETE CASCADE,
   temperature_celsius smallint NULL,
   load_percentage smallint NULL,
   power_kw smallint NULL,
   feeding_size_mm smallint NULL,
   discharging_size_mm smallint NULL,
   updated_at timestamp without time zone NOT NULL DEFAULT now()
)