import { type NextRequest, NextResponse } from "next/server";
import { BadRequestError, errorMiddleware, UnauthorizedError } from "@/lib/errorMiddleware";
import AuthService from "@/service/AuthService";
import JWTService from "@/service/JWTService";
import { loginSchema } from "@/validation/AuthSchema";

async function post_handler(req: NextRequest, ctx: any) {
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
        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
        return NextResponse.json({ token, user: safeUser }, { status: 200 });
    } catch (error) {
        throw new UnauthorizedError("Invalid username or password"); // Generic error to avoid leaking info
    }
}

export const POST = errorMiddleware(post_handler);
