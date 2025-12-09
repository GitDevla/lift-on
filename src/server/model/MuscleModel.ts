import prisma from "../lib/prisma";

export class MuscleModel {
    static async getAllMuscleGroups() {
        return prisma.muscleGroup.findMany();
    }
}