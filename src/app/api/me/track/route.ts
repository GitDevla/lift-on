import type { NextRequest } from "next/server";
import type { Workout } from "@/components/contexts/WorkoutContext";
import { errorMiddleware, UnauthorizedError } from "@/lib/errorMiddleware";
import { getUser } from "@/lib/getUser";
import { UserService } from "@/service/UserService";

async function get_handler(req: NextRequest) {
    const user = await getUser(req);

    if (!user) {
        throw new UnauthorizedError("Invalid or missing authentication token.");
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(
        req.nextUrl.searchParams.get("pageSize") || "10",
        10,
    );

    const workouts = await UserService.getUserWorkouts(user.id, page, pageSize);
    const formatedWorkouts: Workout[] = workouts.map((workout) => ({
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
    }));
    return new Response(JSON.stringify({ workouts: formatedWorkouts }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const GET = errorMiddleware(get_handler);
