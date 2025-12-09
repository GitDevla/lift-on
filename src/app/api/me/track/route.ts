import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import type { Workout } from "@/client/components/contexts/WorkoutContext";
import {
    forceAuthMiddleware,
    type RequestContext,
} from "@/server/lib/authMiddleware";
import { BadRequestError, errorMiddleware } from "@/server/lib/errorMiddleware";
import { UserService } from "@/server/service/UserService";

const QuerySchema = z.object({
    page: z.string().regex(/^\d+$/).optional(),
    pageSize: z.string().regex(/^\d+$/).optional(),
});

async function get_handler(req: NextRequest, ctx: RequestContext) {
    const user = ctx.user;

    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.safeParse({
        page: searchParams.get("page") ?? undefined,
        pageSize: searchParams.get("pageSize") ?? undefined,
    });

    if (!parsed.success)
        throw new BadRequestError("Invalid input", parsed.error.flatten());

    const pageStr = parsed.data.page;
    const pageSizeStr = parsed.data.pageSize;

    const page = pageStr ? parseInt(pageStr, 10) : 0;
    const pageSize = pageSizeStr ? parseInt(pageSizeStr, 10) : 20;

    const workouts = await UserService.getUserWorkouts(
        user.id as unknown as string,
        page,
        pageSize,
    );
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
    return NextResponse.json({ workouts: formatedWorkouts }, { status: 200 });
}

export const GET = errorMiddleware(forceAuthMiddleware(get_handler));
