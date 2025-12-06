import prisma from "@/lib/prisma";

export class UserModel {
    static async create(username: string, email: string, passwordHash: string) {
        return await prisma.user.create({
            data: {
                username,
                email,
                password: passwordHash,
            },
        });
    }

    static async findByUsername(username: string) {
        return prisma.user.findUnique({
            where: { username },
        });
    }

    static async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    static async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    static async getWorkouts(userId: string, page: number, pageSize: number) {
        return prisma.workout.findMany({
            where: { userId },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                WorkoutExercises: {
                    include: {
                        exercise: true,
                        sets: true,
                    },
                },
            },
        });
    }
}