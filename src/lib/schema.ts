import { z } from "zod";

export const SkillMatrixSchema = z.object({
  title: z.string(),
  seniority: z.enum(["junior", "mid", "senior", "lead", "unknown"]),
  skills: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    devops: z.array(z.string()),
    web3: z.array(z.string()),
    other: z.array(z.string()),
  }),
  mustHave: z.array(z.string()),
  niceToHave: z.array(z.string()),
  salary: z
    .object({
      currency: z.enum(["USD", "EUR", "PLN", "GBP"]),
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  summary: z.string().max(300),
});

export type SkillMatrix = z.infer<typeof SkillMatrixSchema>;
