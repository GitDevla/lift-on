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
        let res = await prisma.exercise.findMany(
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
                skip: query.page ? (query.page - 1) * (query.pageSize ?? 10) : 0,
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

        const seen = new Set();
        res = res.filter(ex => {
            const duplicate = seen.has(ex.id);
            seen.add(ex.id);
            return !duplicate;
        });


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


export type ExerciseWithRelations = Awaited<ReturnType<typeof ExerciseModel.getAllExercises>>[number];