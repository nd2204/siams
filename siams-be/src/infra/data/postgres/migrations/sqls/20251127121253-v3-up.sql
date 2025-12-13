/* Replace with your SQL commands */
-- ============================================
-- Extension
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- Organizations & Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT, -- can be NULL for invited users / oauth users
  salt       TEXT, -- can be NULL for invited users / oauth users
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organizations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  area_geom   GEOMETRY(GEOMETRY, 4326),
  description TEXT,
  location    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cluster_credentials (
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

CREATE TABLE IF NOT EXISTS devices (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Device identity (persistence)
  org_id           UUID NOT NULL REFERENCES organizations(id), --v3: allow manual cluster assignment
  cluster_id       UUID REFERENCES clusters(id) ON DELETE SET NULL, -- v3: allow manual cluster assignment
  hardware_id      TEXT NOT NULL, -- e.g: ChipID, MAC, Serial, must be unique per hardware

  -- Trust & provenance
  trust_level      TEXT NOT NULL CHECK (trust_level IN ('SIGNED','SECRET','PROVCODE', 'EPHEMERAL')),
  pubkey           TEXT,  -- if trust_level=SIGNED
  device_secret_en TEXT,  -- if trust_level=SECRET
  prov_code        TEXT,  -- if trust_level=PROVCODE
  prov_onchain     BOOLEAN NOT NULL DEFAULT false, 
  prov_status      TEXT CHECK (prov_status IN('PROVISIONED','PENDING','REVOKED')),

  -- Status
  status           TEXT CHECK (status IN ('online','offline')) DEFAULT 'offline',
  last_seen_at     TIMESTAMPTZ,

  -- Metadata
  model            TEXT NOT NULL,
  device_name      TEXT NOT NULL,
  fw_ver           TEXT NOT NULL,

  -- Audit
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),

  -- Geospatial data
  geom             GEOMETRY(POINT, 4326),
  UNIQUE (id, hardware_id)
);

CREATE UNIQUE INDEX idx_devices_hardware_id ON devices(hardware_id);
CREATE INDEX idx_devices_org_cluster ON devices(org_id, cluster_id);
CREATE INDEX idx_devices_last_seen ON devices(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_devices_geom ON devices USING GIST (geom);

-- managing events for a specific device
CREATE TABLE IF NOT EXISTS device_events (
  id             BIGSERIAL PRIMARY KEY,  -- v3
  event_uuid     UUID NOT NULL DEFAULT gen_random_uuid(), -- v3: safe querying
  device_id      UUID NOT NULL REFERENCES devices(id), -- v3: don't delete cascade
  cluster_id     UUID REFERENCES clusters(id) ON DELETE SET NULL, -- v3: don't delete cascade
  org_id         UUID NOT NULL REFERENCES ORGANIZATIONS(id), -- v3: don't delete cascade
  event_type     TEXT NOT NULL, -- registered, telemetry, alert, command_ack ...
  data_hash      TEXT NOT NULL, -- v3: for on-chain verification
  raw_payload    TEXT NOT NULL, -- v3: for forensic
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- v3: indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_device_events_device ON device_events(device_id);
CREATE INDEX IF NOT EXISTS idx_device_events_org ON device_events(org_id);
CREATE INDEX IF NOT EXISTS idx_device_events_event_types ON device_events(event_type);
CREATE INDEX IF NOT EXISTS idx_device_events_data_hash ON device_events(data_hash);

-- ============================================
-- Sensors & Actuators
-- ============================================

CREATE TABLE IF NOT EXISTS sensors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id    UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  local_id     INT NOT NULL,
  type         TEXT NOT NULL,
  name         TEXT NOT NULL,
  unit         TEXT,
  status       TEXT CHECK (status IN ('online','offline','removed')) DEFAULT 'offline',
  last_seen_at TIMESTAMPTZ,
  UNIQUE (device_id, local_id)
);

CREATE TABLE IF NOT EXISTS actuators (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id    UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  local_id     INT NOT NULL,
  name         TEXT NOT NULL,
  type         TEXT NOT NULL,
  status       TEXT CHECK (status IN ('online','offline')) DEFAULT 'offline',
  UNIQUE (device_id, local_id)
);

-- ============================================
-- Telemetry & Device Status
-- ============================================

CREATE TABLE IF NOT EXISTS telemetry (
  id             BIGSERIAL PRIMARY KEY,
  telemetry_uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  raw_payload    TEXT NOT NULL,
  sensor_id      UUID NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
  value          DOUBLE PRECISION NOT NULL,
  timestamp      TIMESTAMPTZ NOT NULL,
  CONSTRAINT telemetry_unique UNIQUE (sensor_id, timestamp)
);

CREATE INDEX idx_telemetry_sensor_time ON telemetry(sensor_id, timestamp);

CREATE TABLE IF NOT EXISTS device_status (
  id            BIGSERIAL PRIMARY KEY,
  device_id     UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  cpu_usage     NUMERIC, -- TODO: change numerical to DOUBLE PRECISION
  memory_usage  NUMERIC,
  wifi_strength NUMERIC,
  online        BOOLEAN NOT NULL,
  reported_at   TIMESTAMPTZ NOT NULL
);

-- ============================================
-- Commands & Outbox
-- ============================================

CREATE TABLE IF NOT EXISTS commands (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT,
  type          TEXT,
  device_id     UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  local_id      INT NOT NULL,
  commands      JSONB DEFAULT '[]'::jsonb,
  UNIQUE(device_id, local_id)
);

CREATE TABLE IF NOT EXISTS outbox (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL,  -- e.g. "command"
  payload         JSONB NOT NULL, -- v3: payload now handle the topic for commands, and support other action
  status          TEXT CHECK (status IN ('PENDING','SENT','FAILED')) DEFAULT 'PENDING',
  attempts        INT NOT NULL DEFAULT 0, -- v3
  locked_by       TEXT, -- v3: (optional) worker identifier who locked the job
  locked_at       TIMESTAMPTZ, -- v3
  scheduled_at    TIMESTAMPTZ, -- v3
  last_attempt_at TIMESTAMPTZ, -- v3
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- v3: indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_outbox_type_status ON outbox(type, status);
CREATE INDEX IF NOT EXISTS idx_outbox_locked_at ON outbox(locked_at);

-- ============================================
-- Blockchain (since v3)
-- ============================================

-- on-chain, off-chain proof mapping
CREATE TABLE IF NOT EXISTS anchors (
  id              BIGSERIAL PRIMARY KEY,
  anchor_uuid     UUID NOT NULL DEFAULT gen_random_uuid(),
  anchor_type     TEXT NOT NULL, -- distinguise between batching, telemetry, device or event
  aggregate_id    UUID,          -- e.g: telemetry_uuid, event_uuid or null if batching
  data_hash       TEXT NOT NULL, -- hex string of canonical hash (or merkle root)
  batch_id        TEXT,          -- (optional) group id for batches
  publisher       TEXT,          -- address or identifier of who published the tx
  tx_hash         TEXT,
  block_number    BIGINT,
  status          TEXT NOT NULL CHECK (status IN ('PENDING','SENT','FAILED','VERIFIED')) DEFAULT 'PENDING',
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_anchor_aggregate_id ON anchors(aggregate_id)
WHERE batch_id IS NOT NULL;

--------------------------------------------------------------------------------
-- Invitations (optional flow)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invitations (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email            TEXT NOT NULL,
  role_id          uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  token            TEXT NOT NULL UNIQUE,              -- one-time token sent via email
  invited_by       uuid REFERENCES users(id) ON DELETE SET NULL,
  expires_at       TIMESTAMPTZ,
  accepted         BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invitations_org_email ON invitations (organization_id, email);

-- --------------------------------------------------------------------------------
-- Insert core roles
-- --------------------------------------------------------------------------------
INSERT INTO roles (name, description, is_global)
VALUES
  ('SUPER_ADMIN', 'Platform-level administrator', true),
  ('ORG_OWNER', 'Organization owner: full control, including delete org', false),
  ('ORG_ADMIN', 'Organization administrator: manage org settings & users', false),
  ('ORG_OPERATOR', 'Organization operator: manage devices and act on behalf of org', false),
  ('ORG_VIEWER', 'Organization viewer: read-only access', false)
ON CONFLICT (name) DO NOTHING;

-- Insert sample permissions
INSERT INTO permissions (key, description)
VALUES
  ('org:read', 'Read organization metadata'),
  ('org:write', 'Modify organization metadata'),
  ('org:delete', 'Delete organization'),
  ('user:invite', 'Invite user to organization'),
  ('device:read', 'Read device'),
  ('device:update', 'Update device'),
  ('device:delete', 'Delete device'),
  ('command:issue', 'Issue commands to devices'),
  ('telemetry:read', 'Read telemetry data')
ON CONFLICT (key) DO NOTHING;

-- --------------------------------------------------------------------------------
-- Map role_permissions
-- --------------------------------------------------------------------------------

-- SUPER_ADMIN -> all permissions
-- --------------------------------------------------------------------------------
WITH
  r AS ( SELECT id, name FROM roles WHERE name = 'SUPER_ADMIN'),
  p AS ( SELECT id FROM permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM r CROSS JOIN p
ON CONFLICT DO NOTHING;

-- ORG_OWNER -> full organization control
-- --------------------------------------------------------------------------------
WITH
  r AS (SELECT id FROM roles WHERE name = 'ORG_OWNER'),
  p AS (
    SELECT id FROM permissions
    WHERE key IN (
      'org:read','org:write','org:delete','user:invite',
      'device:read','device:update','device:delete',
      'command:issue','telemetry:read'
    )
  )
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM r CROSS JOIN p
ON CONFLICT DO NOTHING;

-- ORG_ADMIN -> most permissions
-- --------------------------------------------------------------------------------
WITH
  r AS (SELECT id FROM roles WHERE name = 'ORG_ADMIN'),
  p AS (
    SELECT id FROM permissions
    WHERE key IN (
      'org:read', 'user:invite', 'device:read', 'device:update',
      'device:delete', 'command:issue', 'telemetry:read'
    )
  )
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM r CROSS JOIN p
ON CONFLICT DO NOTHING;

-- ORG_OPERATOR -> device & command, telemetry read
-- --------------------------------------------------------------------------------
WITH
  r AS (SELECT id FROM roles WHERE name = 'ORG_OPERATOR'),
  p AS (
    SELECT id FROM permissions
    WHERE key IN (
      'org:read', 'device:read', 'device:update',
      'command:issue', 'telemetry:read'
    )
  )
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM r CROSS JOIN p
ON CONFLICT DO NOTHING;

-- ORG_VIEWER -> read-only
-- --------------------------------------------------------------------------------
WITH
  r AS (SELECT id FROM roles WHERE name = 'ORG_VIEWER'),
  p AS (
    SELECT id FROM permissions
    WHERE key IN ('org:read', 'device:read', 'telemetry:read')
  )
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM r CROSS JOIN p
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

/* Function cập nhật vị trí của cluster khi device's geometry thay đổi */
CREATE OR REPLACE FUNCTION update_cluster_area(cid UUID)
RETURNS VOID AS $$
DECLARE
  geom_count INTEGER;
BEGIN
  -- Đếm số lượng điểm hợp lệ trong cluster
  SELECT COUNT(d.geom)
  INTO geom_count
  FROM devices d
  WHERE d.cluster_id = cid
    AND d.geom IS NOT NULL;

  -- Nếu không có điểm nào => area_geom = NULL
  IF geom_count = 0 THEN
    UPDATE clusters SET area_geom = NULL WHERE id = cid;
    RETURN;
  END IF;

  -- Nhiều điểm => tạo bounding circle thật
  UPDATE clusters
  SET area_geom = (
    SELECT ST_MinimumBoundingCircle(ST_Collect(d.geom))
    FROM devices d
    WHERE d.cluster_id = cid
      AND d.geom IS NOT NULL
  )
  WHERE id = cid;
END;
$$ LANGUAGE plpgsql;
