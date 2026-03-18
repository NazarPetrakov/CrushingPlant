CREATE TABLE conveyor_metrics (
   id character varying (64) PRIMARY KEY,
   equipment_id character varying (64) NOT NULL UNIQUE REFERENCES equipments(id) ON DELETE CASCADE,
   speed smallint NULL,
   updated_at timestamp without time zone NOT NULL DEFAULT now())