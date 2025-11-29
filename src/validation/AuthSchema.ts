import z from "zod";

export const loginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6),
});

export const registerSchema = z.object({
    email: z.email(),
    username: z.string().min(3).max(20),
    password: z.string().min(6),
});
