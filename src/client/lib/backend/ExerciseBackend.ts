import type { ExerciseWithRelations } from "@/server/model/ExerciseModel";
import { Backend, type BackendResponse } from "./backend";

export default class ExerciseBackend extends Backend {
    static async fetch(filters?: {
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

    static async fetchMuscles(): Promise<
        BackendResponse<Array<{ id: number; name: string }>>
    > {
        return Backend.GET<Array<{ id: number; name: string }>>("/api/muscles");
    }

    static async fetchEquipment(): Promise<
        BackendResponse<Array<{ id: number; name: string }>>
    > {
        return Backend.GET<Array<{ id: number; name: string }>>("/api/equipment");
    }

    static async update(
        exercise: ExerciseWithRelations,
    ): Promise<BackendResponse<ExerciseWithRelations>> {
        return Backend.PUT<ExerciseWithRelations>(
            `/api/exercise/${exercise.id}`,
            exercise,
        );
    }

    static async create(
        exercise: ExerciseWithRelations,
    ): Promise<BackendResponse<ExerciseWithRelations>> {
        return Backend.POST<ExerciseWithRelations>(
            `/api/exercise`,
            exercise,
        );
    }

    static async getUserStat(
        exerciseId: number,
    ): Promise<BackendResponse<{
        lastPerformed: Array<{
            repetitions: number; weight: number;
        }>,
        stats: Array<{
            one_rm: number;
            workout_date: string;
        }>
    }>> {
        return Backend.GET<{
            lastPerformed: Array<{
                repetitions: number; weight: number;
            }>, stats: Array<{
                one_rm: number;
                workout_date: string;
            }>
        }>(`/api/exercise/${exerciseId}`);
    }
}
