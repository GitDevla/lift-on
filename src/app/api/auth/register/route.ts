import { type NextRequest, NextResponse } from "next/server";
import { BadRequestError, errorMiddleware } from "@/server/lib/errorMiddleware";
import { UserService } from "@/server/service/UserService";
import { registerSchema } from "@/validation/AuthSchema";

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
