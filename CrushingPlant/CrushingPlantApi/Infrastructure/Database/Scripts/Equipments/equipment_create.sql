CREATE TABLE IF NOT EXISTS equipments (
	id character varying (64) PRIMARY KEY,
	name character varying (256) NOT NULL,
	status character varying (64) NOT NULL,
	type character varying (64) NOT NULL)	