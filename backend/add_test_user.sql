-- Add a test user with username 'user' and password '1234'
INSERT INTO users (email, password, name, role)
VALUES (
  'user@example.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqGVxW.KqW', 
  -- This is bcrypt hash of '1234'
  'Test User',
  'user'  -- Regular user (not admin)
) ON CONFLICT (email) DO NOTHING;
