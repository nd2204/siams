
-- ============================================
-- Drop schema (Down Migration)
-- ============================================

DROP TABLE IF EXISTS device_capabilities CASCADE;
DROP TABLE IF EXISTS outbox CASCADE;
DROP TABLE IF EXISTS commands CASCADE;
DROP TABLE IF EXISTS device_status CASCADE;
DROP TABLE IF EXISTS telemetry CASCADE;
DROP TABLE IF EXISTS actuators CASCADE;
DROP TABLE IF EXISTS sensors CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS cluster_credentials CASCADE;
DROP TABLE IF EXISTS clusters CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_org_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
