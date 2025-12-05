import type { NextRequest } from "next/server";
import { adminMiddleware } from "@/lib/adminMiddleware";
import { forceAuthMiddleware } from "@/lib/authMiddleware";
import { errorMiddleware } from "@/lib/errorMiddleware";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";
import ExerciseService from "@/service/ExerciseService";

async function put_handler(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const { id } = await params;
    const exerciseID = parseInt(id, 10);

    const body = (await req.json()) as ExerciseWithRelations;

    const updatedExercise = await ExerciseService.updateExercise(
        exerciseID,
        body,
    );

    return new Response(JSON.stringify(updatedExercise), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const PUT = errorMiddleware(
    forceAuthMiddleware(adminMiddleware(put_handler)),
);
