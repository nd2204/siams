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

