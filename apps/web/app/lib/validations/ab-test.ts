import { z } from "zod";
import { linkedinConfigSchema, infojobsConfigSchema } from "./campaign";

// ======================= CREATE =======================

const abTestBase = {
    name: z.string().min(3, "O nome do teste deve ter ao menos 3 caracteres"),
    resumeAId: z.string().uuid("ID do currículo A inválido"),
    resumeBId: z.string().uuid("ID do currículo B inválido"),
    dailyLimit: z.number().int().min(1, "O limite diário deve ser ao menos 1").max(200, "O limite diário não pode exceder 200").optional().default(50),
    hypothesis: z.string().max(200, "Hipótese muito longa").optional(),
};

export const createAbTestSchema = z
    .discriminatedUnion("platform", [
        z.object({ platform: z.literal("linkedin"), ...abTestBase, linkedinConfig: linkedinConfigSchema }),
        z.object({ platform: z.literal("infojobs"), ...abTestBase, infojobsConfig: infojobsConfigSchema }),
    ])
    .refine((data) => data.resumeAId !== data.resumeBId, {
        message: "Selecione dois currículos diferentes para o teste A/B",
        path: ["resumeBId"],
    });

// ======================= UPDATE (concluir teste) =======================

export const updateAbTestSchema = z.object({
    winner: z.enum(["A", "B", "tie"]).nullable().optional(),
    hypothesis: z.string().max(200).optional(),
});

export type CreateAbTestInput = z.infer<typeof createAbTestSchema>;
export type UpdateAbTestInput = z.infer<typeof updateAbTestSchema>;
