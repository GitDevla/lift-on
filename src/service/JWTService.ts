import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

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

    static generateUserToken(user: {
        id: string;
        username: string;
        email: string;
    }): string {
        const payload = {
            id: user.id,
        };
        return jwt.sign(payload, JWTService.SECRET, {
            expiresIn: JWTService.expiration,
        } as SignOptions);
    }
}
