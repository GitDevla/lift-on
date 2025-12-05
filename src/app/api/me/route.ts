import { type NextRequest, NextResponse } from "next/server";
import { forceAuthMiddleware, type RequestContext } from "@/lib/authMiddleware";
import { errorMiddleware } from "@/lib/errorMiddleware";
import { UserModel } from "@/model/UserModel";

async function get_handler(req: NextRequest, ctx: RequestContext) {
    const userID = ctx.user.id;
    const user = await UserModel.findById(userID as unknown as string);
    return NextResponse.json({ user });
}

export const GET = errorMiddleware(forceAuthMiddleware(get_handler));
