CREATE TYPE "user_role" AS ENUM (
  'admin',
  'user'
);

CREATE TYPE "status_campaign" AS ENUM (
  'paused',
  'active',
  'inactive'
);

CREATE TYPE "app_status" AS ENUM (
  'pending',
  'applied',
  'failed',
  'skipped'
);

CREATE TYPE "platform" AS ENUM (
  'linkedin',
  'infojobs'
);

CREATE TYPE "brazil_state" AS ENUM (
  'acre',
  'alagoas',
  'amapa',
  'amazonas',
  'bahia',
  'ceara',
  'distrito_federal',
  'espirito_santo',
  'goias',
  'maranhao',
  'mato_grosso',
  'mato_grosso_do_sul',
  'minas_gerais',
  'para',
  'paraiba',
  'parana',
  'pernambuco',
  'piaui',
  'rio_de_janeiro',
  'rio_grande_do_norte',
  'rio_grande_do_sul',
  'rondonia',
  'roraima',
  'santa_catarina',
  'sao_paulo',
  'sergipe',
  'tocantins'
);

CREATE TYPE "linkedin_sort" AS ENUM (
  'recent',
  'relevant'
);

CREATE TYPE "linkedin_date" AS ENUM (
  'any',
  'past_month',
  'past_week',
  'past_24h'
);

CREATE TYPE "linkedin_exp" AS ENUM (
  'internship',
  'entry',
  'associate',
  'mid_senior',
  'director',
  'executive'
);

CREATE TYPE "linkedin_job_type" AS ENUM (
  'full_time',
  'part_time',
  'contract',
  'temporary',
  'volunteer',
  'internship',
  'other'
);

CREATE TYPE "linkedin_remote" AS ENUM (
  'remote',
  'hybrid',
  'on_site'
);

CREATE TYPE "ij_work_model" AS ENUM (
  'presencial',
  'home_office',
  'hibrido'
);

CREATE TYPE "ij_radius" AS ENUM (
  'km_5',
  'km_10',
  'km_25',
  'km_50',
  'km_75',
  'km_100'
);

CREATE TYPE "ij_salary" AS ENUM (
  'brl_1000',
  'brl_2000',
  'brl_3000',
  'brl_4000',
  'brl_5000',
  'brl_6000',
  'brl_7000',
  'brl_8000',
  'brl_9000',
  'brl_10000'
);

CREATE TYPE "ij_date_posted" AS ENUM (
  'hoje',
  'ultimos_3_dias',
  'ultima_semana',
  'ultimos_15_dias',
  'ultimo_mes'
);

CREATE TYPE "ij_job_area" AS ENUM (
  'administracao',
  'agricultura_pecuaria_veterinaria',
  'alimentacao_gastronomia',
  'arquitetura_decoracao_design',
  'artes',
  'auditoria',
  'ciencias_pesquisa',
  'comercial_vendas',
  'comercio_exterior',
  'compras',
  'comunicacao_tv_cinema',
  'construcao_manutencao',
  'contabil_financas_economia',
  'cultura_lazer_entretenimento',
  'educacao_ensino_idiomas',
  'engenharia',
  'estetica',
  'hotelaria_turismo',
  'industrial_producao_fabrica',
  'informatica_ti_telecomunicacoes',
  'juridica',
  'logistica',
  'marketing',
  'meio_ambiente_ecologia',
  'moda',
  'qualidade',
  'quimica_petroquimica',
  'recursos_humanos',
  'saude',
  'seguranca',
  'servico_social_comunitario',
  'servicos_gerais',
  'telemarketing',
  'transportes'
);

CREATE TYPE "ij_contract" AS ENUM (
  'clt',
  'autonomo',
  'pj',
  'cooperado',
  'jovem_aprendiz',
  'estagio',
  'temporario',
  'trainee',
  'outros'
);

CREATE TYPE "ij_schedule" AS ENUM (
  'periodo_integral',
  'parcial_manha',
  'parcial_tarde',
  'parcial_noite',
  'noturno'
);

CREATE TYPE "ij_seniority" AS ENUM (
  'estagiario',
  'operacional',
  'auxiliar',
  'assistente',
  'trainee',
  'tecnico',
  'analista',
  'encarregado',
  'supervisor',
  'consultor',
  'especialista',
  'coordenador',
  'gerente',
  'diretor'
);

CREATE TYPE "ij_pcd" AS ENUM (
  'auditiva',
  'fisica',
  'visual',
  'mental',
  'reabilitados',
  'psicossocial',
  'fala',
  'intelectual',
  'tea'
);

CREATE TYPE "TransactionType" AS ENUM (
  'PURCHASE',
  'USAGE',
  'BONUS',
  'REFUND'
);

CREATE TABLE "users" (
  "id" text PRIMARY KEY DEFAULT (gen_random_uuid()),
  "email" text UNIQUE NOT NULL,
  "password" text,
  "role" user_role DEFAULT 'user',
  "gateway_customer_id" text,
  "credits" int,
  "plan_tier" text DEFAULT 'free',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "Transaction" (
  "id" uuid UNIQUE PRIMARY KEY,
  "user_id" text,
  "amount" int,
  "type" "TransactionType",
  "reference_id" text,
  "description" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "resumes" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid,
  "title" text,
  "personal_info" jsonb,
  "education" jsonb,
  "experience" jsonb,
  "skills" jsonb,
  "is_default" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "campaigns" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "resume_id" uuid,
  "user_id" uuid,
  "name" text,
  "platform" platform,
  "status" text DEFAULT 'paused',
  "daily_limit" int DEFAULT 50,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "campaign_linkedin" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "campaign_id" uuid,
  "search_terms" text,
  "location_term" text,
  "sort_by" linkedin_sort DEFAULT 'relevant',
  "date_posted" linkedin_date DEFAULT 'any',
  "exp_level" linkedin_exp,
  "job_type" linkedin_job_type,
  "remote_filter" linkedin_remote
);

CREATE TABLE "campaign_infojobs" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "campaign_id" uuid,
  "search_terms" text,
  "location_state" brazil_state,
  "km_de_voce" ij_radius DEFAULT 'km_25',
  "salary_filter" ij_salary,
  "date_posted" ij_date_posted,
  "work_models" ij_work_model,
  "job_areas" ij_job_area,
  "contract_types" ij_contract,
  "work_schedules" ij_schedule,
  "seniority_levels" ij_seniority,
  "pcd_types" ij_pcd
);

CREATE TABLE "job_applications" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "campaign_id" uuid,
  "user_id" uuid,
  "platform" platform,
  "company_name" text,
  "job_title" text,
  "job_url" text UNIQUE,
  "status" app_status DEFAULT 'pending',
  "error_log" text,
  "applied_at" timestamp,
  "created_at" timestamp DEFAULT (now())
);

CREATE INDEX ON "job_applications" ("user_id", "status");

CREATE INDEX ON "job_applications" ("campaign_id");

COMMENT ON COLUMN "Transaction"."amount" IS '+1000 (Comprou), -1 (Usou Proxy), -50 (Renovou)';

COMMENT ON COLUMN "Transaction"."reference_id" IS 'ID da Invoice do Stripe ou ID da Request do Proxy';

COMMENT ON COLUMN "Transaction"."description" IS 'Ex: Pacote Iniciante ou Request #992';

COMMENT ON COLUMN "campaign_linkedin"."search_terms" IS 'Termo principal de pesquisa';

COMMENT ON COLUMN "campaign_linkedin"."location_term" IS 'Termo de localização (Cidade, Estado, País)';

COMMENT ON COLUMN "campaign_linkedin"."exp_level" IS 'Multi-select Array';

COMMENT ON COLUMN "campaign_linkedin"."job_type" IS 'Multi-select Array';

COMMENT ON COLUMN "campaign_linkedin"."remote_filter" IS 'Multi-select Array';

COMMENT ON COLUMN "campaign_infojobs"."search_terms" IS 'Apenas nome da profissão';

COMMENT ON COLUMN "campaign_infojobs"."location_state" IS 'Estado Brasileiro';

COMMENT ON COLUMN "campaign_infojobs"."salary_filter" IS 'Dropdown de Salário Mínimo';

COMMENT ON COLUMN "campaign_infojobs"."work_models" IS 'Multi-select: Presencial, Home Office, Híbrido';

COMMENT ON COLUMN "campaign_infojobs"."job_areas" IS 'Multi-select: Áreas de atuação';

COMMENT ON COLUMN "campaign_infojobs"."contract_types" IS 'Multi-select: CLT, PJ, etc';

COMMENT ON COLUMN "campaign_infojobs"."work_schedules" IS 'Multi-select: Integral, Parcial, etc';

COMMENT ON COLUMN "campaign_infojobs"."seniority_levels" IS 'Multi-select: Estagiário a Diretor';

COMMENT ON COLUMN "campaign_infojobs"."pcd_types" IS 'Multi-select: Tipos de deficiência';

ALTER TABLE "Transaction" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "resumes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "campaigns" ADD FOREIGN KEY ("resume_id") REFERENCES "resumes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "campaigns" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "campaign_linkedin" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "campaign_infojobs" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "job_applications" ADD FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "job_applications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
