import type { SetType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export class WorkoutModel {
    static async create(userId: string) {
        return prisma.workout.create({
            data: {
                userId,
            },
        });
    }

    static async upsertExerciseInWorkout(
        workoutId: number,
        exerciseId: number,
        order: number,
    ) {
        return prisma.workoutExercise.upsert({
            where: {
                workoutId_exerciseId: {
                    workoutId,
                    exerciseId,
                },
            },
            update: {
                order,
            },
            create: {
                workoutId,
                exerciseId,
                order,
            },
        });
    }

    static async upsertSetInExerciseInWorkout(
        workoutExerciseWorkoutId: number,
        workoutExerciseExerciseId: number,
        order: number,
        reps: number,
        weight: number,
        type: SetType,
        done: boolean,
    ) {
        return prisma.set.upsert({
            where: {
                workoutExerciseWorkoutId_workoutExerciseExerciseId_order: {
                    workoutExerciseWorkoutId,
                    workoutExerciseExerciseId,
                    order,
                },
            },
            update: {
                repetitions: reps,
                weight,
                type,
                done,
            },
            create: {
                workoutExerciseWorkoutId,
                workoutExerciseExerciseId,
                order,
                repetitions: reps,
                weight,
                type,
                done,
            },
        });
    }

    static async getWorkoutById(id: number) {
        return prisma.workout.findUnique({
            where: { id },
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

    static async clearWorkoutExercises(workoutId: number) {
        return prisma.workoutExercise.deleteMany({
            where: { workoutId },
        });
    }

    static async deleteWorkout(workoutId: number) {
        return prisma.workout.delete({
            where: { id: workoutId },
        });
    }

    static async userHasUnfinishedWorkouts(userId: string) {
        const wo = await prisma.workout.findFirst({
            where: {
                userId: userId,
                endedAt: null,
            },
        });
        return wo;
    }

    static async upsertWorkoutEndTime(workoutId: number, endedAt: Date | null) {
        return prisma.workout.update({
            where: { id: workoutId },
            data: { endedAt },
        });
    }
}
