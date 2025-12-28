-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "app_status" AS ENUM ('pending', 'applied', 'failed', 'skipped');

-- CreateEnum
CREATE TYPE "platform" AS ENUM ('linkedin', 'infojobs');

-- CreateEnum
CREATE TYPE "brazil_state" AS ENUM ('acre', 'alagoas', 'amapa', 'amazonas', 'bahia', 'ceara', 'distrito_federal', 'espirito_santo', 'goias', 'maranhao', 'mato_grosso', 'mato_grosso_do_sul', 'minas_gerais', 'para', 'paraiba', 'parana', 'pernambuco', 'piaui', 'rio_de_janeiro', 'rio_grande_do_norte', 'rio_grande_do_sul', 'rondonia', 'roraima', 'santa_catarina', 'sao_paulo', 'sergipe', 'tocantins');

-- CreateEnum
CREATE TYPE "linkedin_sort" AS ENUM ('recent', 'relevant');

-- CreateEnum
CREATE TYPE "linkedin_date" AS ENUM ('any', 'past_month', 'past_week', 'past_24h');

-- CreateEnum
CREATE TYPE "linkedin_exp" AS ENUM ('internship', 'entry', 'associate', 'mid_senior', 'director', 'executive');

-- CreateEnum
CREATE TYPE "linkedin_job_type" AS ENUM ('full_time', 'part_time', 'contract', 'temporary', 'volunteer', 'internship', 'other');

-- CreateEnum
CREATE TYPE "linkedin_remote" AS ENUM ('remote', 'hybrid', 'on_site');

-- CreateEnum
CREATE TYPE "ij_work_model" AS ENUM ('presencial', 'home_office', 'hibrido');

-- CreateEnum
CREATE TYPE "ij_radius" AS ENUM ('km_5', 'km_10', 'km_25', 'km_50', 'km_75', 'km_100');

-- CreateEnum
CREATE TYPE "ij_salary" AS ENUM ('brl_1000', 'brl_2000', 'brl_3000', 'brl_4000', 'brl_5000', 'brl_6000', 'brl_7000', 'brl_8000', 'brl_9000', 'brl_10000');

-- CreateEnum
CREATE TYPE "ij_date_posted" AS ENUM ('hoje', 'ultimos_3_dias', 'ultima_semana', 'ultimos_15_dias', 'ultimo_mes');

-- CreateEnum
CREATE TYPE "ij_job_area" AS ENUM ('administracao', 'agricultura_pecuaria_veterinaria', 'alimentacao_gastronomia', 'arquitetura_decoracao_design', 'artes', 'auditoria', 'ciencias_pesquisa', 'comercial_vendas', 'comercio_exterior', 'compras', 'comunicacao_tv_cinema', 'construcao_manutencao', 'contabil_financas_economia', 'cultura_lazer_entretenimento', 'educacao_ensino_idiomas', 'engenharia', 'estetica', 'hotelaria_turismo', 'industrial_producao_fabrica', 'informatica_ti_telecomunicacoes', 'juridica', 'logistica', 'marketing', 'meio_ambiente_ecologia', 'moda', 'qualidade', 'quimica_petroquimica', 'recursos_humanos', 'saude', 'seguranca', 'servico_social_comunitario', 'servicos_gerais', 'telemarketing', 'transportes');

-- CreateEnum
CREATE TYPE "ij_contract" AS ENUM ('clt', 'autonomo', 'pj', 'cooperado', 'jovem_aprendiz', 'estagio', 'temporario', 'trainee', 'outros');

-- CreateEnum
CREATE TYPE "ij_schedule" AS ENUM ('periodo_integral', 'parcial_manha', 'parcial_tarde', 'parcial_noite', 'noturno');

-- CreateEnum
CREATE TYPE "ij_seniority" AS ENUM ('estagiario', 'operacional', 'auxiliar', 'assistente', 'trainee', 'tecnico', 'analista', 'encarregado', 'supervisor', 'consultor', 'especialista', 'coordenador', 'gerente', 'diretor');

-- CreateEnum
CREATE TYPE "ij_pcd" AS ENUM ('auditiva', 'fisica', 'visual', 'mental', 'reabilitados', 'psicossocial', 'fala', 'intelectual', 'tea');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL,
    "password" VARCHAR,
    "role" "user_role" NOT NULL DEFAULT 'user',
    "cakto_customer_id" VARCHAR,
    "plan_tier" VARCHAR DEFAULT 'free',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "title" VARCHAR,
    "personal_info" JSONB,
    "education" JSONB,
    "experience" JSONB,
    "skills" JSONB,
    "is_default" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "resume_id" UUID,
    "user_id" UUID,
    "name" VARCHAR,
    "platform" "platform",
    "status" VARCHAR DEFAULT 'paused',
    "daily_limit" INTEGER DEFAULT 50,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_linkedin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID,
    "search_terms" VARCHAR,
    "location_term" VARCHAR,
    "sort_by" "linkedin_sort" DEFAULT 'relevant',
    "date_posted" "linkedin_date" DEFAULT 'any',
    "exp_level" "linkedin_exp"[],
    "job_type" "linkedin_job_type"[],
    "remote_filter" "linkedin_remote"[],

    CONSTRAINT "campaign_linkedin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_infojobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID,
    "search_terms" VARCHAR,
    "location_state" "brazil_state",
    "km_de_voce" "ij_radius" DEFAULT 'km_25',
    "salary_filter" "ij_salary",
    "date_posted" "ij_date_posted",
    "work_models" "ij_work_model"[],
    "job_areas" "ij_job_area"[],
    "contract_types" "ij_contract"[],
    "work_schedules" "ij_schedule"[],
    "seniority_levels" "ij_seniority"[],
    "pcd_types" "ij_pcd"[],

    CONSTRAINT "campaign_infojobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID,
    "user_id" UUID,
    "platform" "platform",
    "company_name" VARCHAR,
    "job_title" VARCHAR,
    "job_url" VARCHAR,
    "status" "app_status" DEFAULT 'pending',
    "error_log" TEXT,
    "applied_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_linkedin_campaign_id_key" ON "campaign_linkedin"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_infojobs_campaign_id_key" ON "campaign_infojobs"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_job_url_key" ON "job_applications"("job_url");

-- CreateIndex
CREATE INDEX "job_applications_user_id_status_idx" ON "job_applications"("user_id", "status");

-- CreateIndex
CREATE INDEX "job_applications_campaign_id_idx" ON "job_applications"("campaign_id");

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_linkedin" ADD CONSTRAINT "campaign_linkedin_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_infojobs" ADD CONSTRAINT "campaign_infojobs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
