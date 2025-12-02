import type { Workout } from "@/components/contexts/WorkoutContext";
import { NotFoundError } from "@/lib/errorMiddleware";
import { WorkoutModel } from "@/model/WorkoutModel";

export class WorkoutService {
    static async startNewWorkout(userId: string) {
        const workout = await WorkoutModel.create(userId);
        return workout;
    }

    static async updateWorkout(workout: Workout) {
        const workoutId = parseInt(workout.id, 10);

        const dbWorkout = await WorkoutModel.getWorkoutById(workoutId);
        if (!dbWorkout) {
            throw new NotFoundError("Workout not found");
        }

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
}
