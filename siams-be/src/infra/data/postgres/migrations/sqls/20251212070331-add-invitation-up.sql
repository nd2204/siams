/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS invitations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email            TEXT NOT NULL,
  role_id          uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  token            TEXT NOT NULL UNIQUE,              -- one-time token sent via email
  invited_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  expires_at       TIMESTAMPTZ,
  accepted         BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invitations_org_email ON invitations (organization_id, email);
