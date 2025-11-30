import type { NextRequest } from "next/server";
import { UserModel } from "@/model/UserModel";
import JWTService from "@/service/JWTService";

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
    return UserModel.findById(decodedToken.id);
}
