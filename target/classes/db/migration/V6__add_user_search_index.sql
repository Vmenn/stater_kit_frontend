-- Full-text search vector column for users
ALTER TABLE users ADD COLUMN search_vector TSVECTOR;

-- Populate initial values
UPDATE users
SET search_vector = to_tsvector('english', coalesce(name, '') || ' ' || coalesce(email, ''));

-- GIN index for fast full-text search
CREATE INDEX idx_users_search_vector ON users USING GIN(search_vector);

-- Trigger to auto-update search_vector on insert/update
CREATE OR REPLACE FUNCTION users_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        coalesce(NEW.name, '') || ' ' || coalesce(NEW.email, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_search_vector_trigger
BEFORE INSERT OR UPDATE OF name, email ON users
FOR EACH ROW EXECUTE FUNCTION users_search_vector_update();
