import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { BadRequestError, errorMiddleware } from "@/lib/errorMiddleware";
import { UserService } from "@/service/UserService";

export const registerSchema = z.object({
    email: z.email(),
    username: z.string().min(3).max(20),
    password: z.string().min(6),
});

async function post_handler(req: NextRequest) {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success)
        throw new BadRequestError("Invalid input", parsed.error.flatten());


    await UserService.register(
        parsed.data.username,
        parsed.data.password,
        parsed.data.email,
    );

    return NextResponse.json(
        { message: "User registered successfully" },
        { status: 201 },
    );
}

export const POST = errorMiddleware(post_handler);
