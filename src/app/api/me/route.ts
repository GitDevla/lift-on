import { type NextRequest, NextResponse } from "next/server";
import { errorMiddleware, UnauthorizedError } from "@/lib/errorMiddleware";
import { UserModel } from "@/model/UserModel";
import JWTService from "@/service/JWTService";

async function get_handler(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    const userID = await JWTService.decodeToken(token);
    const user = await UserModel.findById(userID?.id as string);
    if (!user) {
        throw new UnauthorizedError("Unauthorized");
    }

    return NextResponse.json({ user });
}

export const GET = errorMiddleware(get_handler);
