import type { NextRequest } from "next/server";
import { Role } from "@/generated/prisma/enums";
import type { RequestContext } from "./authMiddleware";
import { UnauthorizedError } from "./errorMiddleware";

export const adminMiddleware = (handler: Function) => {
    return async (req: NextRequest, ctx: RequestContext) => {
        const user = ctx.user;
        if (!user || user.role !== Role.ADMIN) {
            throw new UnauthorizedError("Admin access required");
        }
        return handler(req, ctx);
    };
};
