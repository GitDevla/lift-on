import { NotFoundError, UnauthorizedError } from "@/server/lib/errorMiddleware";
import prisma from "@/server/lib/prisma";
import HashService from "./HashService";

export default class AuthService {
    static async isValidCredentials(username: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const isPasswordValid = await HashService.comparePassword(
            password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid password");
        }

        return user;
    }
}
