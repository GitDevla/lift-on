import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { BadRequestError, errorMiddleware, UnauthorizedError } from "@/lib/errorMiddleware";
import AuthService from "@/service/AuthService";
import JWTService from "@/service/JWTService";

export const loginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6),
});

async function post_handler(req: NextRequest) {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success)
        throw new BadRequestError("Invalid input", parsed.error.flatten());

    try {
        const user = await AuthService.isValidCredentials(
            parsed.data.username,
            parsed.data.password,
        );
        const token = await JWTService.generateUserToken(user);
        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        throw new UnauthorizedError("Invalid username or password"); // Generic error to avoid leaking info
    }
}

export const POST = errorMiddleware(post_handler);
