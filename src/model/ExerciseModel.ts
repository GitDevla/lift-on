import prisma from "@/lib/prisma";

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
        const res = await prisma.exercise.findMany(
            {
                where: {
                    name: {
                        contains: query.nameQuery ? query.nameQuery : "",
                    },
                    exerciseMuscleGroups: query.muscleGroupIDs && query.muscleGroupIDs.length > 0 ? {
                        some: {
                            muscleGroupId: {
                                in: query.muscleGroupIDs,
                            }
                        }
                    } : undefined,
                    exerciseEquipments: query.equipmentIDs && query.equipmentIDs.length > 0 ? {
                        some: {
                            equipmentId: {
                                in: query.equipmentIDs,
                            }
                        }
                    } : undefined,

                },
                skip: query.page && query.pageSize ? (query.page - 1) * query.pageSize : 0,
                take: query.pageSize ?? 10,
                include: {
                    exerciseEquipments: {
                        include: {
                            equipment: true,
                        }
                    },
                    exerciseMuscleGroups: {
                        include: {
                            muscleGroup: true,
                        }
                    }
                }
            }
        )
        if (res.length > 0) {
            return res.filter(ex =>
                query.muscleGroupIDs && query.muscleGroupIDs.length > 0 ?
                    query.muscleGroupIDs.every(id =>
                        ex.exerciseMuscleGroups.some(emg => emg.muscleGroupId === id)
                    ) : true
            );
        }

        return res;
    }

}
