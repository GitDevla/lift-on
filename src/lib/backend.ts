import type { User } from "@/generated/prisma/client";

type BackendResponseOkResponse<T = any> = {
    ok: true;
    data: T;
};

type BackendResponseErrorResponse = {
    ok: false;
    error: string;
};

type BackendResponse<T = any> =
    | BackendResponseOkResponse<T>
    | BackendResponseErrorResponse;

export class Backend {
    private static async request<T = any>(
        method: "GET" | "POST" | "PUT",
        queryParamsOrBody?: Record<string, any> | any,
        path?: string,
    ): Promise<BackendResponse<T>> {
        const token = localStorage.getItem("authToken") || "";
        let url = `${path}`;
        const options: RequestInit = {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        if (method === "GET" && queryParamsOrBody) {
            url += `?${new URLSearchParams(queryParamsOrBody as Record<string, string>).toString()}`;
        } else if (method === "POST" || method === "PUT") {
            options.headers = {
                ...options.headers,
                "Content-Type": "application/json",
            };
            options.body = JSON.stringify(queryParamsOrBody);
        }
        let res: Response;
        try {
            res = await fetch(url, options);
        } catch (error) {
            return {
                ok: false,
                error: `Network error: ${(error as Error).message}`,
            };
        }
        let json: any;
        try {
            json = await res.json();
        } catch (error) {
            return {
                ok: false,
                error: res.statusText || "Failed to parse server response",
            };
        }
        if (!res.ok) {
            return {
                ok: false,
                error: json.message || "An error occurred",
            };
        }
        return {
            ok: true,
            data: json,
        };
    }

    static async GET<T = any>(
        path: string,
        queryParams?: Record<string, any>,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("GET", queryParams, path);
    }

    static async POST<T = any>(
        path: string,
        body: any,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("POST", body, path);
    }

    static async PUT<T = any>(
        path: string,
        body: any,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("PUT", body, path);
    }

    static async GETPROMISE<T = any>(
        path: string,
        queryParams?: Record<string, any>,
    ): Promise<T> {
        const res = await Backend.GET(path, queryParams);
        if (!res.ok) {
            throw new Error(res.error);
        }
        return res.data;
    }

    static async POSTPROMISE<T = any>(path: string, body: any): Promise<T> {
        const res = await Backend.POST(path, body);
        if (!res.ok) {
            throw new Error(res.error);
        }
        return res.data;
    }

    static async PUTPROMISE<T = any>(path: string, body: any): Promise<T> {
        const res = await Backend.PUT(path, body);
        if (!res.ok) {
            throw new Error(res.error);
        }
        return res.data;
    }

    static async login(
        username: string,
        password: string,
    ): Promise<BackendResponse<{ token: string }>> {
        return Backend.POST<{ token: string }>("/api/auth/login", {
            username,
            password,
        });
    }

    static async register(
        username: string,
        password: string,
        email: string,
    ): Promise<BackendResponse<{ message: string }>> {
        return Backend.POST<{ message: string }>("/api/auth/register", {
            username,
            password,
            email,
        });
    }

    static async getCurrentUser(): Promise<BackendResponse<{ user: User }>> {
        return Backend.GET<{ user: User }>("/api/me");
    }
}
