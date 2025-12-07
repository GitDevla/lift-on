import type { Workout } from "@/client/components/contexts/WorkoutContext";
import { Backend, type BackendResponse } from "./backend";

export default class WorkoutBackend extends Backend {
    static async fetchByID(
        workoutId: number,
    ): Promise<BackendResponse<{ workout: Workout }>> {
        const queryParams: Record<string, any> = {};
        queryParams.workoutID = workoutId;
        return Backend.GET<{ workout: Workout }>("/api/track", queryParams);
    }

    static async update(workout: Workout): Promise<BackendResponse<null>> {
        return Backend.PATCH<null>("/api/track", { workout: workout });
    }

    static async getUsers(
        page: number,
        pageSize: number,
    ): Promise<BackendResponse<any>> {
        return Backend.GET<any>("/api/me/track", { page, pageSize });
    }

    static async delete(
        workoutId: number,
    ): Promise<BackendResponse<null>> {
        const queryParams: Record<string, any> = {};
        queryParams.workoutID = workoutId;
        return Backend.DELETE<null>("/api/track", queryParams);
    }
}
