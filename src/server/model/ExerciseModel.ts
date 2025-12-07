import type { Exercise } from "@/server/generated/prisma/client";
import prisma from "@/server/lib/prisma";

export class ExerciseModel {
    static async getAllExercises(
        query: Partial<{
            nameQuery: string;
            muscleGroupIDs: number[];
            equipmentIDs: number[];
            page: number;
            pageSize: number;
        }>,
    ) {
        let res = await prisma.exercise.findMany({
            where: {
                name: {
                    contains: query.nameQuery ? query.nameQuery : "",
                },
                exerciseMuscleGroups:
                    query.muscleGroupIDs && query.muscleGroupIDs.length > 0
                        ? {
                            some: {
                                muscleGroupId: {
                                    in: query.muscleGroupIDs,
                                },
                            },
                        }
                        : undefined,
                exerciseEquipments:
                    query.equipmentIDs && query.equipmentIDs.length > 0
                        ? {
                            some: {
                                equipmentId: {
                                    in: query.equipmentIDs,
                                },
                            },
                        }
                        : undefined,
            },
            skip: query.page ? (query.page - 1) * (query.pageSize ?? 10) : 0,
            take: query.pageSize ?? 10,
            include: {
                exerciseEquipments: {
                    include: {
                        equipment: true,
                    },
                },
                exerciseMuscleGroups: {
                    include: {
                        muscleGroup: true,
                    },
                },
            },
        });

        const seen = new Set();
        res = res.filter((ex) => {
            const duplicate = seen.has(ex.id);
            seen.add(ex.id);
            return !duplicate;
        });

        if (res.length > 0) {
            return res.filter((ex) =>
                query.muscleGroupIDs && query.muscleGroupIDs.length > 0
                    ? query.muscleGroupIDs.every((id) =>
                        ex.exerciseMuscleGroups.some((emg) => emg.muscleGroupId === id),
                    )
                    : true,
            );
        }

        return res;
    }

    static async updateExercise(
        exerciseId: number,
        data: Partial<Exercise>,
        muscleGroupIDs: number[],
        equipmentIDs: number[],
    ) {
        return prisma.exercise.update({
            where: { id: exerciseId },
            data: {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
                exerciseEquipments: {
                    deleteMany: { exerciseId: exerciseId },
                    create: equipmentIDs.map((equipmentId) => ({
                        equipmentId: equipmentId,
                    })),
                },
                exerciseMuscleGroups: {
                    deleteMany: { exerciseId: exerciseId },
                    create: muscleGroupIDs.map((muscleGroupId) => ({
                        muscleGroupId: muscleGroupId,
                    })),
                },
            },
        });
    }

    static async getExerciseById(exerciseId: number) {
        return prisma.exercise.findUnique({
            where: { id: exerciseId },
            include: {
                exerciseEquipments: {
                    include: {
                        equipment: true,
                    },
                },
                exerciseMuscleGroups: {
                    include: {
                        muscleGroup: true,
                    },
                },
            },
        });
    }

    static async createExercise(data: Partial<Exercise>) {
        return prisma.exercise.create({
            data: {
                name: data.name ?? "",
                description: data.description ?? "",
                imageUrl: data.imageUrl,
            },
        });
    }

    static async lastPerformedByUser(exerciseId: number, userId: string) {
        const result = await prisma.workoutExercise.findMany({
            where: {
                exerciseId: exerciseId,
                workout: {
                    userId: userId,
                },
            },
            orderBy: {
                workout: {
                    endedAt: "desc",
                },
            },
            take: 1,
            include: {
                workout: true,
                sets: true,
            },
        });

        if (result.length === 0) {
            return null;
        }

        return result[0].sets;
    }

    static async getStatsForExercise(exerciseId: number, userId: string) {
        const result = await prisma.$queryRaw<any>`
            SELECT 
                MAX(ws.weight * (1 + ws.repetitions / 30.0)) AS one_rm,
                w.startedAt AS workout_date
            FROM 'WorkoutExercise' we
            JOIN 'Set' ws ON we.workoutId = ws.workoutExerciseWorkoutId AND we.exerciseId = ws.workoutExerciseExerciseId
            JOIN 'Workout' w ON we.workoutId = w.id
            WHERE we.exerciseId = ${exerciseId} AND w.userId = ${userId}
            GROUP BY we.workoutId;
        `;
        return result;
    }
}

export type ExerciseWithRelations = Awaited<
    ReturnType<typeof ExerciseModel.getAllExercises>
>[number];