-- ============================================
-- USERS
-- ============================================

CREATE TABLE qshieldx_user (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'visitor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_role_check
        CHECK (role IN ('admin', 'dev', 'visitor'))
);

CREATE INDEX idx_qshieldx_user_email
    ON qshieldx_user(email);


-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE project (
    project_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,

    user_id BIGINT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_project_user
        FOREIGN KEY (user_id)
        REFERENCES qshieldx_user(user_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_project_user_id
    ON project(user_id);


-- ============================================
-- REPOSITORIES
-- ============================================

CREATE TABLE repository (
    repository_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL,

    repo_uri TEXT NOT NULL,
    repo_name VARCHAR(255),
    repo_branch VARCHAR(255) DEFAULT 'main',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_repository_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_project_repository
        UNIQUE (project_id, repo_uri)
);

CREATE INDEX idx_repository_project_id
    ON repository(project_id);


-- ============================================
-- CBOM
-- ============================================

CREATE TABLE cbom (
    cbom_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    repository_id BIGINT NOT NULL,

    tool VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,

    commit_hash VARCHAR(100),
    branch VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_cbom_repository
        FOREIGN KEY (repository_id)
        REFERENCES repository(repository_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_cbom_repository_id
    ON cbom(repository_id);

CREATE INDEX idx_cbom_commit_hash
    ON cbom(commit_hash);

CREATE INDEX idx_cbom_tool
    ON cbom(tool);