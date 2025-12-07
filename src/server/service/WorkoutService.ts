import type { Workout } from "@/client/components/contexts/WorkoutContext";
import { NotFoundError } from "@/server/lib/errorMiddleware";
import { WorkoutModel } from "@/server/model/WorkoutModel";

export class WorkoutService {
    static async startNewWorkout(userId: string) {
        const existingWorkout = await WorkoutModel.userHasUnfinishedWorkouts(userId);
        if (existingWorkout) {
            return {
                new: false,
                workout: existingWorkout,
            }
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
        await WorkoutModel.upsertWorkoutEndTime(
            workoutId,
            workout.endTime,
        );


        await WorkoutModel.clearWorkoutExercises(workoutId);

        for (const [i, exercise] of workout.exercises.entries()) {
            const workoutExercise = await WorkoutModel.upsertExerciseInWorkout(
                workoutId,
                exercise.id,
                i,
            );

            for (const set of exercise.sets) {
                await WorkoutModel.upsertSetInExerciseInWorkout(
                    workoutExercise.workoutId,
                    workoutExercise.exerciseId,
                    set.order,
                    set.reps,
                    set.weight,
                    set.type,
                    set.done,
                );
            }
        }
    }

    static async deleteWorkout(workoutId: number) {
        const dbWorkout = await WorkoutModel.getWorkoutById(workoutId);
        if (!dbWorkout) {
            throw new NotFoundError("Workout not found");
        }

        await WorkoutModel.deleteWorkout(workoutId);
    }
}
