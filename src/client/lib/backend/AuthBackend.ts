import type { User } from "@/server/generated/prisma/browser";
import { Backend, type BackendResponse } from "./backend";

export default class AuthBackend extends Backend {
    static async login(
        username: string,
        password: string,
    ): Promise<BackendResponse<{ token: string; user: User }>> {
        return AuthBackend.request(
            "POST",
            { username, password },
            "/api/auth/login",
        );
    }

    static async register(
        username: string,
        email: string,
        password: string,
    ): Promise<BackendResponse<{ token: string }>> {
        return AuthBackend.request(
            "POST",
            { username, email, password },
            "/api/auth/register",
        );
    }

    static async getCurrentUser(): Promise<BackendResponse<{ user: User }>> {
        return Backend.GET<{ user: User }>("/api/me");
    }
}
