-- Default super admin — password: Admin@123456 (BCrypt)
INSERT INTO users (id, name, email, password, role, is_active)
VALUES (
    gen_random_uuid(),
    'Super Admin',
    'admin@company.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN9X1uqL3K7r9f2sKpT6G',
    'SUPER_ADMIN',
    TRUE
) ON CONFLICT DO NOTHING;
