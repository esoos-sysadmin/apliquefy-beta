-- Modelo do PDF (harvard | two-column) e idioma dos rótulos (pt | en | es) por currículo.
ALTER TABLE "resumes" ADD COLUMN "template" VARCHAR NOT NULL DEFAULT 'harvard';
ALTER TABLE "resumes" ADD COLUMN "language" VARCHAR NOT NULL DEFAULT 'pt';
