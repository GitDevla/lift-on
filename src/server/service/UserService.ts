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

    static async findById(userId: string) {
        return UserModel.findById(userId);
    }

    static async removeById(userId: string) {
        return UserModel.deleteById(userId);
    }

    static async updateById(userId: string, data: Partial<{ username: string; email: string; password: string }>) {
        const sameUsernameUser = data.username
            ? await UserModel.findByUsername(data.username)
            : null;
        if (sameUsernameUser && sameUsernameUser.id !== userId) {
            throw new ConflictError("Username already taken");
        }

        const sameEmailUser = data.email
            ? await UserModel.findByEmail(data.email)
            : null;
        if (sameEmailUser && sameEmailUser.id !== userId) {
            throw new ConflictError("Email already taken");
        }

        if (data.password) {
            data.password = await HashService.hashPassword(data.password);
        }
        return UserModel.updateById(userId, data);
    }
}
