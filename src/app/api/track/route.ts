import { type NextRequest, NextResponse } from "next/server";
import type { Workout } from "@/client/components/contexts/WorkoutContext";
import {
    forceAuthMiddleware,
    type RequestContext,
} from "@/server/lib/authMiddleware";
import {
    BadRequestError,
    errorMiddleware,
} from "@/server/lib/errorMiddleware";
import { WorkoutService } from "@/server/service/WorkoutService";

async function post_handler(req: NextRequest, ctx: RequestContext) {
    const userID = ctx.user.id;
    const newWorkout = await WorkoutService.startNewWorkout(userID);
    return NextResponse.json(
        { workout: newWorkout.workout, new: newWorkout.new },
        { status: 200 },
    );
}

async function patch_handler(req: NextRequest, ctx: RequestContext) {
    let { workout } = await req.json();
    workout = workout as Workout;
    await WorkoutService.updateWorkout(workout);
    return new Response(null, { status: 204 });
}

async function get_handler(req: NextRequest, ctx: RequestContext) {
    const rawWorkoutID = req.nextUrl.searchParams.get("workoutID");
    if (!rawWorkoutID) throw new BadRequestError("Missing workoutID parameter.");
    const workoutID = parseInt(rawWorkoutID, 10);
    if (Number.isNaN(workoutID))
        throw new BadRequestError("Invalid workoutID parameter.");

    const workout = await WorkoutService.getWorkoutById(workoutID);

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
    return NextResponse.json({ workout: formatedWorkout }, { status: 200 });
}

async function delete_handler(req: NextRequest, ctx: RequestContext) {
    const workoutID = req.nextUrl.searchParams.get("workoutID");
    if (!workoutID) throw new BadRequestError("Missing workoutID parameter.");

    await WorkoutService.deleteWorkout(parseInt(workoutID, 10));
    return NextResponse.json(
        { message: "Workout deleted successfully" },
        { status: 200 },
    );
}

export const POST = errorMiddleware(forceAuthMiddleware(post_handler));
export const PATCH = errorMiddleware(forceAuthMiddleware(patch_handler));
export const GET = errorMiddleware(forceAuthMiddleware(get_handler));
export const DELETE = errorMiddleware(forceAuthMiddleware(delete_handler));
