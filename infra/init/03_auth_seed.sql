-- roles
INSERT INTO roles (code, description) VALUES
('admin', 'System administrator'),
('investigator', 'Investigator'),
('field', 'Field officer');

-- admin user (PLAIN password for now)
INSERT INTO users (
  id,
  email,
  full_name,
  role_id,
  password_hash,
  is_active
)
VALUES (
  gen_random_uuid(),
  'admin',
  'System Admin',
  (SELECT id FROM roles WHERE code='admin'),
  'admin',
  true
);