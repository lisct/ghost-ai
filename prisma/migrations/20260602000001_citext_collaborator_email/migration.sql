-- EnableExtension
CREATE EXTENSION IF NOT EXISTS citext;

-- AlterColumn
ALTER TABLE "project_collaborators" ALTER COLUMN "email" TYPE CITEXT USING "email"::CITEXT;
