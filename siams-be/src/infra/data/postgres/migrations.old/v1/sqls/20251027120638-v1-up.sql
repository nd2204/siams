CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ============================================
-- Organizations & Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT, -- can be NULL for invited users / oauth users
  salt       TEXT, -- can be NULL for invited users / oauth users
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organizations (
  id         UUID PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE, -- for shorter query
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,           -- canonical name, all caps recommended
  description   TEXT,
  is_global     BOOLEAN NOT NULL DEFAULT false, -- if true, role not bound to org context
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permissions: atomic actions/resources
CREATE TABLE IF NOT EXISTS permissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key           TEXT NOT NULL UNIQUE, -- e.g. "device:create", "device:read", "org:manage"
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mapping: which permissions each role has
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS organization_users (
  id              UUID PRIMARY KEY,
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id         UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  invited_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  accepted_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

-- Index to quickly lookup members by organization
CREATE INDEX IF NOT EXISTS idx_org_users_org_id ON organization_users(org_id);
CREATE INDEX IF NOT EXISTS idx_org_users_user_id ON organization_users(user_id);

-- ============================================
-- Clusters & Credentials
-- ============================================

CREATE TABLE IF NOT EXISTS clusters (
  id          UUID PRIMARY KEY,
  org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cluster_credentials (
  id            UUID PRIMARY KEY,
  cluster_id    UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  login_id      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Devices
-- ============================================

CREATE TABLE IF NOT EXISTS devices (
  id               UUID PRIMARY KEY,
  cluster_id       UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  device_name      TEXT NOT NULL,
  model            TEXT NOT NULL,
  firmware_version TEXT NOT NULL,
  status           TEXT CHECK (status IN ('online','offline')) DEFAULT 'offline',
  last_seen_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE IF NOT EXISTS device_capabilities (
  id                  UUID PRIMARY KEY,
  device_id           UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  sensors_supported   JSONB DEFAULT '[]'::jsonb,
  actuators_supported JSONB DEFAULT '[]'::jsonb,
  commands_supported  JSONB DEFAULT '[]'::jsonb,
  reported_at         TIMESTAMPTZ NOT NULL
);

-- managing events for a specific device
CREATE TABLE IF NOT EXISTS device_events (
  device_id    UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  cluster_id   UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  org_id       UUID REFERENCES ORGANIZATIONS(id),
  event_type   TEXT NOT NULL, -- ACTION, SENSOR, ALERT, ...
  severity     TEXT CHECK (severity IN ('CRITICAL','HIGH','NORMAL','LOW')) DEFAULT 'NORMAL',
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  payload      JSONB DEFAULT '{}'::jsonb,
  reported_at  TIMESTAMPTZ NOT NULL
);

-- ============================================
-- Sensors & Actuators
-- ============================================

CREATE TABLE IF NOT EXISTS sensors (
  id           UUID PRIMARY KEY,
  device_id    UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  local_id     NUMERIC NOT NULL,
  type         TEXT NOT NULL,
  unit         TEXT,
  status       TEXT CHECK (status IN ('online','offline','removed')) DEFAULT 'offline',
  last_seen_at TIMESTAMPTZ,
  UNIQUE (device_id, local_id)
);

CREATE TABLE IF NOT EXISTS actuators (
  id           UUID PRIMARY KEY,
  device_id    UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  local_id     NUMERIC NOT NULL,
  type         TEXT NOT NULL,
  status       TEXT CHECK (status IN ('online','offline')) DEFAULT 'offline',
  last_seen_at TIMESTAMPTZ,
  UNIQUE (device_id, local_id)
);

-- ============================================
-- Telemetry & Device Status
-- ============================================

CREATE TABLE IF NOT EXISTS telemetry (
  id        BIGSERIAL PRIMARY KEY,
  sensor_id UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  value     DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  CONSTRAINT telemetry_unique UNIQUE (sensor_id, timestamp)
);

CREATE INDEX idx_telemetry_sensor_time ON telemetry(sensor_id, timestamp);

CREATE TABLE IF NOT EXISTS device_status (
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

CREATE TABLE IF NOT EXISTS commands (
  id         UUID PRIMARY KEY,
  device_id  UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  issued_by  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  command    TEXT NOT NULL,
  payload    JSONB NOT NULL,
  status     TEXT CHECK (status IN ('PENDING','SENT','ACKED','FAILED')) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  acked_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS outbox (
  id             UUID PRIMARY KEY,
  aggregate_type TEXT NOT NULL,  -- e.g. "command"
  aggregate_id   UUID NOT NULL,
  topic          TEXT NOT NULL,
  payload        JSONB NOT NULL,
  status         TEXT CHECK (status IN ('NEW','SENT','FAILED')) DEFAULT 'NEW',
  created_at     TIMESTAMPTZ DEFAULT now()
);

--------------------------------------------------------------------------------
-- Invitations (optional flow)
--------------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS invitations (
--   id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--   organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
--   email            TEXT NOT NULL,
--   role_id          uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
--   token            TEXT NOT NULL UNIQUE,              -- one-time token sent via email
--   invited_by       uuid REFERENCES users(id) ON DELETE SET NULL,
--   expires_at       TIMESTAMPTZ,
--   accepted         BOOLEAN NOT NULL DEFAULT false,
--   created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
-- CREATE INDEX IF NOT EXISTS idx_invitations_org_email ON invitations (organization_id, email);
