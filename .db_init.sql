CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SELECT 'CREATE DATABASE transplex'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'transplex')\gexec

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
