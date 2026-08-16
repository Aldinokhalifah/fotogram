CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    path_file TEXT NOT NULL,
    name_file TEXT NOT NULL,
    type VARCHAR(200) NOT NULL,
    size_byte BIGINT NOT NULL CHECK (size_byte >= 0),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) NOT NULL CHECK (status IN('pending', 'completed', 'failed'))
)

CREATE INDEX idx_files_user_uploaded ON files (user_id, uploaded_at DESC);