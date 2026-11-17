-- Valores novos de enum vão numa migração só deles: o Postgres não deixa usar um valor
-- de enum na mesma transação que o criou (ADR-04).
-- AlterEnum
ALTER TYPE "app_status" ADD VALUE 'needs_user';

-- AlterEnum
ALTER TYPE "platform" ADD VALUE 'ats';
