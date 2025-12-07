import type { NextRequest } from "next/server";
import { UserModel } from "@/server/model/UserModel";
import JWTService from "@/server/service/JWTService";

export async function getUser(req: NextRequest) {
    const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authToken) {
        return null;
    }
    if (!JWTService.verifyToken(authToken)) {
        return null;
    }
    const decodedToken = JWTService.decodeToken(authToken);
    if (!decodedToken) {
        return null;
    }
    return UserModel.findById(decodedToken.id as unknown as string);
}
