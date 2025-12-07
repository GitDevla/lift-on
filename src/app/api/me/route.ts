import { type NextRequest, NextResponse } from "next/server";
import { forceAuthMiddleware, type RequestContext } from "@/server/lib/authMiddleware";
import { errorMiddleware, NotFoundError } from "@/server/lib/errorMiddleware";
import { UserModel } from "@/server/model/UserModel";

async function get_handler(req: NextRequest, ctx: RequestContext) {
    const userID = ctx.user.id;
    const user = await UserModel.findById(userID as unknown as string);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
    return NextResponse.json({ user: safeUser });
}

async function delete_handler(req: NextRequest, ctx: RequestContext) {
    const userID = ctx.user.id;
    await UserModel.deleteById(userID as unknown as string);
    return NextResponse.json({ message: "User deleted successfully" });
}

export const GET = errorMiddleware(forceAuthMiddleware(get_handler));
export const DELETE = errorMiddleware(forceAuthMiddleware(delete_handler));
