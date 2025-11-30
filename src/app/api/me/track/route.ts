import type { NextRequest } from "next/server";
import { errorMiddleware, UnauthorizedError } from "@/lib/errorMiddleware";
import { getUser } from "@/lib/getUser";
import { UserService } from "@/service/UserService";

async function get_handler(req: NextRequest) {
    const user = await getUser(req);

    if (!user) {
        throw new UnauthorizedError("Invalid or missing authentication token.");
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(
        req.nextUrl.searchParams.get("pageSize") || "10",
        10,
    );

    const workouts = await UserService.getUserWorkouts(user.id, page, pageSize);
    return new Response(JSON.stringify({ workouts }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const GET = errorMiddleware(get_handler);