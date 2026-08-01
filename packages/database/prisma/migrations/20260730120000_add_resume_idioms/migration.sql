-- Idiomas do currículo: o form já coletava e validava, mas não havia onde gravar.
ALTER TABLE "resumes" ADD COLUMN "idioms" JSONB;
