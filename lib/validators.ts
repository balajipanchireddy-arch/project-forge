import { z } from 'zod';

export const StudentInputSchema = z.object({
  interests: z
    .string()
    .min(3, "Tell us at least 3 characters about your interests.")
    .max(500, "Keep it under 500 characters.")
    .regex(/^[a-zA-Z0-9\s.,!?\-']+$/, "No special characters or code syntax allowed.")
    .transform((str) => str.trim()),
  skills: z
    .string()
    .min(3, "List your skills.")
    .max(300, "Keep skills concise.")
    .regex(/^[a-zA-Z0-9\s.,!?\-']+$/, "No special characters allowed."),
});

export const ProjectIdeaSchema = z.object({
  title: z.string().min(5).max(100),
  problem_statement: z.string().min(20).max(300, "Must be a specific, real-world issue."),
  features: z.array(z.string()).min(3).max(8),
  tech_stack: z.array(z.string()).min(3).max(5),
  development_steps: z.array(z.string()).length(6, "Must have exactly 6 steps."),
  improvements: z.array(z.string()).length(3, "Must have 3 improvements."),
});

export type ProjectIdea = z.infer<typeof ProjectIdeaSchema>;