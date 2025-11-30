import type { NextRequest } from "next/server";
import { errorMiddleware } from "@/lib/errorMiddleware";
import { ExerciseModel } from "@/model/ExerciseModel";

async function get_handler(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const nameQuery = searchParams.get("nameQuery") || undefined;
    const rawMuscleGroupIDs = searchParams.get("muscleGroupIDs")?.split(",") as string[];
    const rawEquipmentIDs = searchParams.get("equipmentIDs")?.split(",") as string[];
    const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string, 10) : undefined;
    const pageSize = searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize") as string, 10) : undefined;

    const muscleGroupIDs = rawMuscleGroupIDs ? rawMuscleGroupIDs.map(id => parseInt(id, 10)) : undefined;
    const equipmentIDs = rawEquipmentIDs ? rawEquipmentIDs.map(id => parseInt(id, 10)) : undefined;

    const exercises = await ExerciseModel.getAllExercises({
        nameQuery,
        muscleGroupIDs,
        equipmentIDs,
        page,
        pageSize,
    });

    return new Response(JSON.stringify(exercises), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const GET = errorMiddleware(get_handler);
