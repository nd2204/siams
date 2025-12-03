/* Replace with your SQL commands */
ALTER TABLE devices
ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false;
