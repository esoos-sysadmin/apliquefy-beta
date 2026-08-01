-- Currículo deixa de ser obrigatório na campanha: excluir um currículo passa a
-- zerar o vínculo (SET NULL) em vez de estourar violação de FK. A campanha
-- sobrevive com o histórico e é barrada na ativação até apontar para outro.

ALTER TABLE "campaigns" ALTER COLUMN "resume_id" DROP NOT NULL;

-- O nome da FK pode divergir da convenção do Prisma (o schema deste banco foi
-- aplicado via db push), então descobre pelo catálogo em vez de assumir.
DO $$
DECLARE fk_name text;
BEGIN
    SELECT conname INTO fk_name
    FROM pg_constraint
    WHERE conrelid = 'campaigns'::regclass
      AND contype = 'f'
      AND conkey = ARRAY[(
          SELECT attnum FROM pg_attribute
          WHERE attrelid = 'campaigns'::regclass AND attname = 'resume_id'
      )];

    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE "campaigns" DROP CONSTRAINT %I', fk_name);
    END IF;
END $$;

ALTER TABLE "campaigns"
    ADD CONSTRAINT "campaigns_resume_id_fkey"
    FOREIGN KEY ("resume_id") REFERENCES "resumes"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
