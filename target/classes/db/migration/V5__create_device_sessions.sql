CREATE TABLE device_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id           VARCHAR(255) NOT NULL,
    platform            VARCHAR(50),
    app_version         VARCHAR(50),
    device_type         VARCHAR(20),
    user_agent          TEXT,
    ip_address          VARCHAR(45),
    last_seen_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    new_login_detected  BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

-- One device_id can only be tied to one account
CREATE UNIQUE INDEX idx_device_sessions_device_id     ON device_sessions (device_id) WHERE is_active = TRUE;
CREATE        INDEX idx_device_sessions_user_id       ON device_sessions (user_id);
CREATE        INDEX idx_device_sessions_is_active     ON device_sessions (is_active);
