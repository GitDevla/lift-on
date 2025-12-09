import { type NextRequest, NextResponse } from "next/server";
import { adminMiddleware } from "@/server/lib/adminMiddleware";
import {
    forceAuthMiddleware,
    type RequestContext,
} from "@/server/lib/authMiddleware";
import { BadRequestError, errorMiddleware } from "@/server/lib/errorMiddleware";
import type { ExerciseWithRelations } from "@/server/model/ExerciseModel";
import ExerciseService from "@/server/service/ExerciseService";

async function put_handler(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const { id } = await params;
    if (!id) throw new BadRequestError("Missing exercise ID parameter.");
    const exerciseID = parseInt(id, 10);
    if (Number.isNaN(exerciseID))
        throw new BadRequestError("Invalid exercise ID parameter.");

    const body = (await req.json()) as ExerciseWithRelations;

    const updatedExercise = await ExerciseService.updateExercise(
        exerciseID,
        body,
    );
    return NextResponse.json(updatedExercise, { status: 200 });
}

async function get_handler(
    req: NextRequest,
    { params, user }: { params: { id: string } } & RequestContext,
) {
    const userID = user.id;
    const { id } = await params;
    if (!id) throw new BadRequestError("Missing exercise ID parameter.");
    const exerciseID = parseInt(id, 10);
    if (Number.isNaN(exerciseID))
        throw new BadRequestError("Invalid exercise ID parameter.");

    const exercise = await ExerciseService.getUserStatForExercise(
        userID,
        exerciseID,
    );
    return NextResponse.json(exercise, { status: 200 });
}

export const PUT = errorMiddleware(
    forceAuthMiddleware(adminMiddleware(put_handler)),
);

export const GET = errorMiddleware(forceAuthMiddleware(get_handler));
