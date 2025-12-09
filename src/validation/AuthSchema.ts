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


export const updateUserSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(20).optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
    confirmPassword: z.string().min(6).optional(),
});