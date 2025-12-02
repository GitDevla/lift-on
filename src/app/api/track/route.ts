import type { NextRequest } from "next/server";
import type { Workout } from "@/components/contexts/WorkoutContext";
import { errorMiddleware, UnauthorizedError } from "@/lib/errorMiddleware";
import { getUser } from "@/lib/getUser";
import { WorkoutModel } from "@/model/WorkoutModel";
import { WorkoutService } from "@/service/WorkoutService";

async function post_handler(req: NextRequest) {
    const user = await getUser(req);

    if (!user) {
        throw new UnauthorizedError("Invalid or missing authentication token.");
    }

    const newWorkout = await WorkoutService.startNewWorkout(user.id);
    return new Response(JSON.stringify({ workout: newWorkout }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

async function patch_handler(req: NextRequest) {
    const user = await getUser(req);

    if (!user) {
        throw new UnauthorizedError("Invalid or missing authentication token.");
    }

    let { workout } = await req.json();
    workout = workout as Workout;
    await WorkoutService.updateWorkout(workout);
    return new Response(null, { status: 204 });
}

async function get_handler(req: NextRequest) {
    const user = await getUser(req);

    if (!user) {
        throw new UnauthorizedError("Invalid or missing authentication token.");
    }

    const workoutID = req.nextUrl.searchParams.get("workoutID");
    if (!workoutID) {
        return new Response(
            JSON.stringify({ error: "Missing workoutID parameter." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const workout = await WorkoutModel.getWorkoutById(parseInt(workoutID, 10));
    return new Response(JSON.stringify({ workout }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

async function delete_handler(req: NextRequest) {
    const user = await getUser(req);

    if (!user) {
        throw new UnauthorizedError("Invalid or missing authentication token.");
    }

    const workoutID = req.nextUrl.searchParams.get("workoutID");
    if (!workoutID) {
        return new Response(
            JSON.stringify({ error: "Missing workoutID parameter." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    await WorkoutService.deleteWorkout(parseInt(workoutID, 10));
    return new Response(null, { status: 204 });
}

export const POST = errorMiddleware(post_handler);
export const PATCH = errorMiddleware(patch_handler);
export const GET = errorMiddleware(get_handler);
export const DELETE = errorMiddleware(delete_handler);
