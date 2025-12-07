import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { User } from "@/server/generated/prisma/client";

interface CustomJwtPayload extends jwt.JwtPayload {
    id: number;
    role: string;
}

export default class JWTService {
    private static SECRET: Secret = (process.env.JWT_SECRET as Secret) || "";
    private static expiration = "24h";

    static verifyToken(token: string): boolean {
        try {
            jwt.verify(token, JWTService.SECRET);
            return true;
        } catch (_error) {
            return false;
        }
    }

    static generateUserToken(user: User): string {
        const payload = {
            id: user.id,
            role: user.role,
        };
        return jwt.sign(payload, JWTService.SECRET, {
            expiresIn: JWTService.expiration,
        } as SignOptions);
    }

    static decodeToken(token: string): null | CustomJwtPayload {
        try {
            const decoded = jwt.verify(token, JWTService.SECRET);
            return decoded as CustomJwtPayload;
        } catch (_error) {
            return null;
        }
    }
}
