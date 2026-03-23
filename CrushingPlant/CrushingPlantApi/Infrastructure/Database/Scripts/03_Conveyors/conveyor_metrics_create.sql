CREATE TABLE conveyor_metrics (
   equipment_id character varying (64) PRIMARY KEY REFERENCES equipments(id) ON DELETE CASCADE,
   "speed_m/s" real NULL,
   updated_at timestamp with time zone NOT NULL DEFAULT now())