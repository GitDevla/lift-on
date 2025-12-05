import type { Workout } from "@/components/contexts/WorkoutContext";
import type { Exercise, User } from "@/generated/prisma/client";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";

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

    static async PATCH<T = any>(
        path: string,
        body: any,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("PATCH", body, path);
    }

    static async PUT<T = any>(
        path: string,
        body: any,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("PUT", body, path);
    }

    static async DELETE<T = any>(
        path: string,
        queryParams?: Record<string, any>,
    ): Promise<BackendResponse<T>> {
        return Backend.request<T>("DELETE", queryParams, path);
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

    static async getExercises(filters?: {
        nameQuery?: string;
        muscleGroupIDs?: string[];
        equipmentIDs?: string[];
        page?: number;
        pageSize?: number;
    }): Promise<BackendResponse<ExerciseWithRelations[]>> {
        const queryParams: Record<string, any> = {};
        if (filters) {
            if (filters.nameQuery) {
                queryParams.nameQuery = filters.nameQuery;
            }
            if (filters.muscleGroupIDs && filters.muscleGroupIDs.length > 0) {
                queryParams.muscleGroupIDs = filters.muscleGroupIDs.join(",");
            }
            if (filters.equipmentIDs && filters.equipmentIDs.length > 0) {
                queryParams.equipmentIDs = filters.equipmentIDs.join(",");
            }
            if (filters.page) {
                queryParams.page = filters.page;
            }
            if (filters.pageSize) {
                queryParams.pageSize = filters.pageSize;
            }
        }
        return Backend.GET<any>("/api/exercise", queryParams);
    }

    static async getMuscles(): Promise<
        BackendResponse<Array<{ id: number; name: string }>>
    > {
        return Backend.GET<Array<{ id: number; name: string }>>("/api/muscles");
    }

    static async getEquipment(): Promise<
        BackendResponse<Array<{ id: number; name: string }>>
    > {
        return Backend.GET<Array<{ id: number; name: string }>>("/api/equipment");
    }

    static async startNewWorkout(): Promise<
        BackendResponse<{
            workout: { id: number; startedAt: string; endedAt: string | null };
        }>
    > {
        return Backend.POST<{
            workout: { id: number; startedAt: string; endedAt: string | null };
        }>("/api/track", {});
    }

    static async getWorkoutById(
        workoutId: number,
    ): Promise<BackendResponse<{ workout: Workout }>> {
        const queryParams: Record<string, any> = {};
        queryParams.workoutID = workoutId;
        return Backend.GET<{ workout: Workout }>("/api/track", queryParams);
    }

    static async updateWorkout(workout: Workout): Promise<BackendResponse<null>> {
        return Backend.PATCH<null>("/api/track", { workout: workout });
    }

    static async getMyWorkouts(
        page: number,
        pageSize: number,
    ): Promise<BackendResponse<any>> {
        return Backend.GET<any>("/api/me/track", { page, pageSize });
    }

    static async updateExercise(
        exercise: ExerciseWithRelations,
    ): Promise<BackendResponse<ExerciseWithRelations>> {
        return Backend.PUT<ExerciseWithRelations>(
            `/api/exercise/${exercise.id}`,
            exercise,
        );
    }

    static async createExercise(
        exercise: ExerciseWithRelations,
    ): Promise<BackendResponse<ExerciseWithRelations>> {
        return Backend.POST<ExerciseWithRelations>(
            `/api/exercise`,
            exercise,
        );
    }

    static async deleteWorkout(workoutId: number): Promise<BackendResponse<null>> {
        const queryParams: Record<string, any> = {};
        queryParams.workoutID = workoutId;
        return Backend.DELETE<null>("/api/track", queryParams);
    }

    static async getUserStatForExercise(
        exerciseId: number,
    ): Promise<BackendResponse<{
        lastPerformed: Array<{
            repetitions: number; weight: number;
        }>
    }>> {
        return Backend.GET<{
            lastPerformed: Array<{
                repetitions: number; weight: number;
            }>
        }>(`/api/exercise/${exerciseId}`);
    }
}
