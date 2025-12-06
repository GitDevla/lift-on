import type { NextRequest } from "next/server";
import type { Workout } from "@/components/contexts/WorkoutContext";
import { forceAuthMiddleware, type RequestContext } from "@/lib/authMiddleware";
import { BadRequestError, errorMiddleware, NotFoundError, UnauthorizedError } from "@/lib/errorMiddleware";
import { getUser } from "@/lib/getUser";
import { WorkoutModel } from "@/model/WorkoutModel";
import { WorkoutService } from "@/service/WorkoutService";

async function post_handler(req: NextRequest, ctx: RequestContext) {
    const userID = ctx.user.id;
    const newWorkout = await WorkoutService.startNewWorkout(userID as unknown as string);
    return new Response(JSON.stringify({ workout: newWorkout.workout, new: newWorkout.new }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

async function patch_handler(req: NextRequest, ctx: RequestContext) {
    let { workout } = await req.json();
    workout = workout as Workout;
    await WorkoutService.updateWorkout(workout);
    return new Response(null, { status: 204 });
}

async function get_handler(req: NextRequest, ctx: RequestContext) {
    const workoutID = req.nextUrl.searchParams.get("workoutID");
    if (!workoutID)
        throw new BadRequestError("Missing workoutID parameter.");

    const workout = await WorkoutModel.getWorkoutById(parseInt(workoutID, 10));
    if (!workout) {
        throw new NotFoundError("Workout not found");
    }
    const formatedWorkout: Workout = {
        id: workout.id,
        startTime: workout.startedAt,
        endTime: workout.endedAt,
        exercises: workout.WorkoutExercises.map((exercise) => ({
            id: exercise.exerciseId,
            name: exercise.exercise.name,
            imageUrl: exercise.exercise.imageUrl as string,
            sets: exercise.sets.map((set, idx) => ({
                id: idx.toString(),
                reps: set.repetitions,
                weight: set.weight,
                order: set.order,
                type: set.type,
                done: set.done,
            })),
        })),
    };
    return new Response(JSON.stringify({ workout: formatedWorkout }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

async function delete_handler(req: NextRequest, ctx: RequestContext) {
    const workoutID = req.nextUrl.searchParams.get("workoutID");
    if (!workoutID)
        throw new BadRequestError("Missing workoutID parameter.");

    await WorkoutService.deleteWorkout(parseInt(workoutID, 10));
    return new Response(null, { status: 204 });
}

export const POST = errorMiddleware(forceAuthMiddleware(post_handler));
export const PATCH = errorMiddleware(forceAuthMiddleware(patch_handler));
export const GET = errorMiddleware(forceAuthMiddleware(get_handler));
export const DELETE = errorMiddleware(forceAuthMiddleware(delete_handler));
