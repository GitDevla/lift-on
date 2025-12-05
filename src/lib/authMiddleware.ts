import type { NextRequest } from "next/server";
import JWTService from "@/service/JWTService";
import { UnauthorizedError } from "./errorMiddleware";

export function forceAuthMiddleware(handler: Function) {
    return (req: NextRequest, ctx: RequestContext) => {
        let token = req.headers.get("Authorization");
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }
        token = token.replace("Bearer ", "");

        const valid = JWTService.verifyToken(token);
        if (!valid) {
            throw new UnauthorizedError("Invalid token");
        }

        const decoded = JWTService.decodeToken(token);
        if (!decoded) {
            throw new UnauthorizedError("Could not decode token");
        }

        const user = {
            id: decoded.id,
            role: decoded.role,
        };

        return handler(req, { ...ctx, user });
    };
}


export interface RequestContext {
    user: {
        id: number;
        role: string;
    };
}