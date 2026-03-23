CREATE TABLE IF NOT EXISTS equipments (
	id character varying (64) PRIMARY KEY,
	name character varying (256) NOT NULL,
	status character varying (64) NOT NULL,
	type character varying (64) NOT NULL,
	updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE bunker_metrics (
   equipment_id character varying (64) PRIMARY KEY REFERENCES equipments(id) ON DELETE CASCADE,
   level_percentage smallint NULL,
   capacity_ton int NULL,
   updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE conveyor_metrics (
   equipment_id character varying (64) PRIMARY KEY REFERENCES equipments(id) ON DELETE CASCADE,
   "speed_m/s" real NULL,
   updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE crusher_metrics (
   equipment_id character varying (64) PRIMARY KEY REFERENCES equipments(id) ON DELETE CASCADE,
   temperature_celsius smallint NULL,
   load_percentage smallint NULL,
   power_kw smallint NULL,
   feeding_size_mm smallint NULL,
   discharging_size_mm smallint NULL,
   updated_at timestamp with time zone NOT NULL DEFAULT now()
);

INSERT INTO equipments (id, name, status, type) VALUES 
('kkd-11', 'Cone coarse crusher 11', 'OFF', 'crusher'),
('krd-12', 'Cone coarse crusher 12', 'OFF', 'crusher'),
('krd-13', 'Cone coarse crusher 13', 'OFF', 'crusher'),
('ksd-3', 'Cone medium crusher 3', 'OFF', 'crusher'),
('kmd-3', 'Cone fine crusher 3', 'OFF', 'crusher'),
('ksd-4', 'Cone medium crusher 4', 'OFF', 'crusher'),
('kmd-4', 'Cone fine crusher 4', 'OFF', 'crusher'),
('ksd-5', 'Cone medium crusher 5', 'OFF', 'crusher'),
('kmd-5', 'Cone fine crusher 5', 'OFF', 'crusher'),
('ksd-6', 'Cone medium crusher 6', 'OFF', 'crusher'),
('kmd-6', 'Cone fine crusher 6', 'OFF', 'crusher'),

('bunk-1', 'Bunker 1', 'OFF', 'bunker'),
('bunk-2', 'Bunker 2', 'OFF', 'bunker'),
('bunk-3', 'Bunker 3', 'OFF', 'bunker'),

('conv-k-1', 'Conveyor k-1', 'OFF', 'conveyor'),
('conv-k-2', 'Conveyor k-2', 'OFF', 'conveyor'),
('conv-m-1', 'Conveyor m-1', 'OFF', 'conveyor'),
('conv-m-2', 'Conveyor m-2', 'OFF', 'conveyor'),
('conv-m-15', 'Conveyor m-15', 'OFF', 'conveyor');

INSERT INTO crusher_metrics 
(equipment_id, temperature_celsius, load_percentage, power_kw, feeding_size_mm, discharging_size_mm) VALUES
('kkd-11', NULL, NULL, NULL, 120, 25),
('krd-12', NULL, NULL, NULL, 100, 20),
('krd-13', NULL, NULL, NULL, 100, 20),
('ksd-3',  NULL, NULL, NULL, 90, 18),
('kmd-3',  NULL, NULL, NULL, 90, 18),
('ksd-4',  NULL, NULL, NULL, 110, 22),
('kmd-4',  NULL, NULL, NULL, 110, 22),
('ksd-5',  NULL, NULL, NULL, 95, 19),
('kmd-5',  NULL, NULL, NULL, 95, 19),
('ksd-6',  NULL, NULL, NULL, 105, 21),
('kmd-6',  NULL, NULL, NULL, 105, 21);

INSERT INTO bunker_metrics (equipment_id, level_percentage, capacity_ton) VALUES
('bunk-1', NULL, 100),
('bunk-2', NULL, 120),
('bunk-3', NULL, 80);

INSERT INTO conveyor_metrics (equipment_id, "speed_m/s") VALUES
('conv-k-1',  NULL),
('conv-k-2',  NULL),
('conv-m-1',  NULL),
('conv-m-2',  NULL),
('conv-m-15', NULL);

