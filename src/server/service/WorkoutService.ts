import type { Workout } from "@/client/components/contexts/WorkoutContext";
import { NotFoundError } from "@/server/lib/errorMiddleware";
import { WorkoutModel } from "@/server/model/WorkoutModel";
import prisma from "../lib/prisma";

export class WorkoutService {
    static async startNewWorkout(userId: string) {
        const existingWorkout =
            await WorkoutModel.userHasUnfinishedWorkouts(userId);
        if (existingWorkout) {
            return {
                new: false,
                workout: existingWorkout,
            };
        }

        const workout = await WorkoutModel.create(userId);
        return {
            new: true,
            workout,
        };
    }

    static async updateWorkout(workout: Workout) {
        const workoutId = parseInt(workout.id as unknown as string, 10);

        const dbWorkout = await WorkoutModel.getWorkoutById(workoutId);
        if (!dbWorkout) {
            throw new NotFoundError("Workout not found");
        }
        await WorkoutModel.upsertWorkoutEndTime(workoutId, workout.endTime);

        await prisma.$transaction(async (tx) => {
            await WorkoutModel.clearWorkoutExercisesTx(tx, workoutId);

            const setPromises = [];
            for (const [i, exercise] of workout.exercises.entries()) {
                const workoutExercise = await WorkoutModel.upsertExerciseInWorkoutTx(
                    tx,
                    workoutId,
                    exercise.id,
                    i,
                );

                for (const set of exercise.sets) {
                    const promise = WorkoutModel.upsertSetInExerciseInWorkoutTx(
                        tx,
                        workoutExercise.workoutId,
                        workoutExercise.exerciseId,
                        set.order,
                        set.reps,
                        set.weight,
                        set.type,
                        set.done,
                    );
                    setPromises.push(promise);
                }
            }
            await Promise.all(setPromises);
        });
    }

    static async deleteWorkout(workoutId: number) {
        const dbWorkout = await WorkoutModel.getWorkoutById(workoutId);
        if (!dbWorkout) {
            throw new NotFoundError("Workout not found");
        }

        await WorkoutModel.deleteWorkout(workoutId);
    }

    static async getWorkoutById(workoutId: number) {
        const workout = await WorkoutModel.getWorkoutById(workoutId);
        if (!workout) {
            throw new NotFoundError("Workout not found");
        }
        return workout;
    }
}
