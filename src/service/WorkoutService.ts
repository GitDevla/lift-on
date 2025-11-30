import type { Workout } from "@/components/contexts/WorkoutContext";
import { WorkoutModel } from "@/model/WorkoutModel";

export class WorkoutService {
    static async startNewWorkout(userId: string) {
        const workout = await WorkoutModel.create(userId);
        return workout;
    }

    static async updateWorkout(workout: Workout) {
        const workoutId = parseInt(workout.id, 10);

        for (const exercise of workout.exercises) {
            const workoutExercise = await WorkoutModel.upsertExerciseInWorkout(
                workoutId,
                exercise.id,
                0,
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
