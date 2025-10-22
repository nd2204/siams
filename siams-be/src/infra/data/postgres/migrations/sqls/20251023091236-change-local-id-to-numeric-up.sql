/* Replace with your SQL commands */
ALTER TABLE sensors
DROP COLUMN local_id;

ALTER TABLE sensors
ADD COLUMN local_id NUMERIC NOT NULL;

ALTER TABLE actuators
DROP COLUMN local_id;

ALTER TABLE actuators
ADD COLUMN local_id NUMERIC NOT NULL;
