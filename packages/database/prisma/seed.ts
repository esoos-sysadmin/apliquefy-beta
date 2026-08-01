import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL não encontrada nas variáveis de ambiente!");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding credit weights...");

    const weights = [
        { stage: "input", weight: 0.1, label: "Input (análise da questão)" },
        { stage: "rag", weight: 0.1, label: "RAG (leitura do currículo)" },
        { stage: "output", weight: 0.2, label: "Output (geração da resposta)" },
        { stage: "judge", weight: 0.1, label: "Judge (validação de qualidade)" },
        { stage: "fallback", weight: 0.5, label: "Fallback (resposta reforçada)" },
    ];

    for (const w of weights) {
        await prisma.creditWeight.upsert({
            where: { stage: w.stage },
            update: { weight: w.weight, label: w.label },
            create: w,
        });
    }

    console.log("Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
