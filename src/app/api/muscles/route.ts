import { type NextRequest, NextResponse } from "next/server";
import { MuscleService } from "@/server/service/MuscleService";

async function get_handler(req: NextRequest) {
    const muscleGroups = await MuscleService.getAllMuscleGroups();
    return NextResponse.json(muscleGroups, { status: 200 });
}

export const GET = get_handler;
