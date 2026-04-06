CREATE TYPE "user_role" AS ENUM (
  'admin',
  'user'
);

CREATE TYPE "sub_status" AS ENUM (
  'active',
  'inactive',
  'past_due'
);

CREATE TYPE "app_status" AS ENUM (
  'pending',
  'applied',
  'failed',
  'skipped'
);

CREATE TYPE "platform" AS ENUM (
  'linkedin',
  'infojobs',
  'glassdoor'
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "email" varchar UNIQUE NOT NULL,
  "name" varchar,
  "clerk_id" varchar UNIQUE,
  "role" user_role DEFAULT 'user',
  "stripe_customer_id" varchar,
  "subscription_status" sub_status DEFAULT 'inactive',
  "plan_tier" varchar DEFAULT 'free',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "resumes" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid,
  "title" varchar,
  "personal_info" jsonb,
  "education" jsonb,
  "experience" jsonb,
  "skills" jsonb,
  "languages" jsonb,
  "is_default" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "campaigns" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid,
  "resume_id" uuid,
  "name" varchar,
  "status" varchar DEFAULT 'paused',
  "target_platforms" platform[],
  "search_terms" varchar,
  "location_filter" varchar,
  "daily_limit" int DEFAULT 50,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "job_applications" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "campaign_id" uuid,
  "user_id" uuid,
  "platform" platform,
  "company_name" varchar,
  "job_title" varchar,
  "job_url" varchar,
  "status" app_status DEFAULT 'pending',
  "error_log" text,
  "applied_at" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE INDEX ON "job_applications" ("user_id", "status");

CREATE INDEX ON "job_applications" ("campaign_id");

COMMENT ON COLUMN "users"."plan_tier" IS 'free, pro, scale';

COMMENT ON COLUMN "resumes"."title" IS 'Ex: Dev Fullstack 2024';

COMMENT ON COLUMN "resumes"."personal_info" IS '{name, phone, linkedin, portfolio, location}';

COMMENT ON COLUMN "resumes"."education" IS '[{institution, degree, start, end, description}]';

COMMENT ON COLUMN "resumes"."experience" IS '[{company, role, start, end, current, description}]';

COMMENT ON COLUMN "resumes"."skills" IS '["React", "Node", "SQL"]';

COMMENT ON COLUMN "resumes"."languages" IS '[{lang: "English", level: "Fluent"}]';

COMMENT ON COLUMN "campaigns"."resume_id" IS 'Qual CV usar nesta campanha';

COMMENT ON COLUMN "campaigns"."name" IS 'Ex: Vagas Remotas React';

COMMENT ON COLUMN "campaigns"."status" IS 'running, paused, finished';

COMMENT ON COLUMN "campaigns"."target_platforms" IS 'Array de enums: [linkedin, infojobs]';

COMMENT ON COLUMN "campaigns"."search_terms" IS 'Ex: "Desenvolvedor Frontend"';

COMMENT ON COLUMN "campaigns"."location_filter" IS 'Ex: "Brasil (Remote)"';

COMMENT ON COLUMN "job_applications"."error_log" IS 'Se falhar, guarda o erro aqui';

ALTER TABLE "resumes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "campaigns" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "campaigns" ADD FOREIGN KEY ("resume_id") REFERENCES "resumes" ("id");

ALTER TABLE "job_applications" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id");

ALTER TABLE "job_applications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
