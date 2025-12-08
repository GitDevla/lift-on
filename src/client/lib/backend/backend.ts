export type BackendResponseOkResponse<T = any> = {
    ok: true;
    data: T;
};

export type BackendResponseErrorResponse = {
    ok: false;
    error: string;
};

export type BackendResponse<T = any> =
    | BackendResponseOkResponse<T>
    | BackendResponseErrorResponse;

export class Backend {
    protected static async request<T = any>(
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
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

        if ((method === "GET" || method === "DELETE") && queryParamsOrBody) {
            url += `?${new URLSearchParams(queryParamsOrBody as Record<string, string>).toString()}`;
        } else if (method === "POST" || method === "PUT" || method === "PATCH") {
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
            json = res.status === 204 ? null : await res.json();
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

    protected static async GET<T = any>(
        path: string,
        queryParams?: Record<string, any>,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("GET", queryParams, path);
    }

    protected static async POST<T = any>(
        path: string,
        body: any,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("POST", body, path);
    }

    protected static async PATCH<T = any>(
        path: string,
        body: any,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("PATCH", body, path);
    }

    protected static async PUT<T = any>(
        path: string,
        body: any,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("PUT", body, path);
    }

    protected static async DELETE<T = any>(
        path: string,
        queryParams?: Record<string, any>,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("DELETE", queryParams, path);
    }

    protected static async GETPROMISE<T = any>(
        path: string,
        queryParams?: Record<string, any>,
    ): Promise<T> {
        const res = await Backend.GET(path, queryParams);
        if (!res.ok) {
            throw new Error(res.error);
        }
        return res.data;
    }

    protected static async POSTPROMISE<T = any>(path: string, body: any): Promise<T> {
        const res = await Backend.POST(path, body);
        if (!res.ok) {
            throw new Error(res.error);
        }
        return res.data;
    }

    protected static async PUTPROMISE<T = any>(path: string, body: any): Promise<T> {
        const res = await Backend.PUT(path, body);
        if (!res.ok) {
            throw new Error(res.error);
        }
        return res.data;
    }

    static async startNewWorkout(): Promise<
        BackendResponse<{
            workout: { id: number; startedAt: string; endedAt: string | null };
            new: boolean;
        }>
    > {
        return Backend.POST<{
            workout: { id: number; startedAt: string; endedAt: string | null };
            new: boolean;
        }>("/api/track", {});
    }
}
