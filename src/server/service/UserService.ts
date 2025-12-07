import { ConflictError } from "@/server/lib/errorMiddleware";
import { UserModel } from "@/server/model/UserModel";
import HashService from "./HashService";

export class UserService {
    static async register(username: string, password: string, email: string) {
        const exists = await UserModel.findByUsername(username);
        if (exists) {
            throw new ConflictError("Username already taken");
        }
        const emailExists = await UserModel.findByEmail(email);
        if (emailExists) {
            throw new ConflictError("Email already taken");
        }

        const hashPassword = await HashService.hashPassword(password);
        return UserModel.create(username, email, hashPassword);
    }

    static async getUserWorkouts(
        userId: string,
        page: number,
        pageSize: number,
    ) {
        return UserModel.getWorkouts(userId, page, pageSize);
    }
}
