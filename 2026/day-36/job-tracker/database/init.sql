CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL
);

INSERT INTO jobs (company, role, status)
VALUES
    ('TCS', 'DevOps Intern', 'Applied'),
    ('Zensar', 'Cloud Intern', 'Interview'),
    ('Deloitte', 'DevOps Engineer', 'Applied');

