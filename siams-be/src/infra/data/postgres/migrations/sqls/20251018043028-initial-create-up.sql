
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ============================================
-- Organizations & Users
-- ============================================

CREATE TABLE organizations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     UUID REFERENCES organizations(id),
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  salt       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE roles (
  id          UUID PRIMARY KEY,
  name        TEXT UNIQUE,       -- "admin", "operator", "viewer"
  description TEXT
);

CREATE TABLE user_org_roles (
  user_id     UUID REFERENCES USERS(id),
  org_id      UUID REFERENCES ORGANIZATIONS(id),
  role_id     UUID REFERENCES ROLES(id),
  granted_at  TIMESTAMPTZ DEFAULT NOW(),
  granted_by  UUID REFERENCES USERS(id),
  PRIMARY KEY (user_id, org_id)
);

-- ============================================
-- Clusters & Credentials
-- ============================================

CREATE TABLE clusters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cluster_credentials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id    UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  login_id      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Devices
-- ============================================

CREATE TABLE devices (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id       UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  device_name      TEXT NOT NULL,
  model            TEXT,
  firmware_version TEXT,
  status           TEXT CHECK (status IN ('online','offline')) DEFAULT 'offline',
  last_seen_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Sensors & Actuators
-- ============================================

CREATE TABLE sensors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id    UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  local_id     TEXT NOT NULL,
  type         TEXT NOT NULL,
  unit         TEXT,
  status       TEXT CHECK (status IN ('online','offline','removed')) DEFAULT 'offline',
  last_seen_at TIMESTAMPTZ,
  UNIQUE (device_id, local_id)
);

CREATE TABLE actuators (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id    UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  local_id     TEXT NOT NULL,
  type         TEXT NOT NULL,
  status       TEXT CHECK (status IN ('online','offline')) DEFAULT 'offline',
  last_seen_at TIMESTAMPTZ,
  UNIQUE (device_id, local_id)
);

-- ============================================
-- Telemetry & Device Status
-- ============================================

CREATE TABLE telemetry (
  id        BIGSERIAL PRIMARY KEY,
  sensor_id UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  value     DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  CONSTRAINT telemetry_unique UNIQUE (sensor_id, timestamp)
);

CREATE INDEX idx_telemetry_sensor_time
ON telemetry(sensor_id, timestamp);

CREATE TABLE device_status (
  id            BIGSERIAL PRIMARY KEY,
  device_id     UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  cpu_usage     NUMERIC,
  memory_usage  NUMERIC,
  wifi_strength NUMERIC,
  reported_at   TIMESTAMPTZ NOT NULL
);

-- ============================================
-- Commands & Outbox
-- ============================================

CREATE TABLE commands (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id  UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  payload    JSONB NOT NULL,
  status     TEXT CHECK (status IN ('PENDING','SENT','ACKED','FAILED')) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  acked_at   TIMESTAMPTZ
);

CREATE TABLE outbox (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type TEXT NOT NULL,  -- e.g. "command"
  aggregate_id   UUID NOT NULL,
  topic          TEXT NOT NULL,
  payload        JSONB NOT NULL,
  status         TEXT CHECK (status IN ('NEW','SENT','FAILED')) DEFAULT 'NEW',
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Device Capabilities
-- ============================================

CREATE TABLE device_capabilities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id           UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  sensors_supported   JSONB,
  actuators_supported JSONB,
  reported_at         TIMESTAMPTZ NOT NULL
);
