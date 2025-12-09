import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { adminMiddleware } from "@/server/lib/adminMiddleware";
import { forceAuthMiddleware } from "@/server/lib/authMiddleware";
import { BadRequestError, errorMiddleware } from "@/server/lib/errorMiddleware";
import type { ExerciseWithRelations } from "@/server/model/ExerciseModel";
import ExerciseService from "@/server/service/ExerciseService";

const QuerySchema = z.object({
    nameQuery: z.string().min(1).max(100).optional(),
    muscleGroupIDs: z
        .string()
        .regex(/^(\d+,)*\d+$/)
        .optional(),
    equipmentIDs: z
        .string()
        .regex(/^(\d+,)*\d+$/)
        .optional(),
    page: z.string().regex(/^\d+$/).optional(),
    pageSize: z.string().regex(/^\d+$/).optional(),
});

async function get_handler(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.safeParse({
        nameQuery: searchParams.get("nameQuery") ?? undefined,
        muscleGroupIDs: searchParams.get("muscleGroupIDs") ?? undefined,
        equipmentIDs: searchParams.get("equipmentIDs") ?? undefined,
        page: searchParams.get("page") ?? undefined,
        pageSize: searchParams.get("pageSize") ?? undefined,
    });

    if (!parsed.success)
        throw new BadRequestError("Invalid input", parsed.error.flatten());

    const {
        muscleGroupIDs: muscleGroupIDsStr,
        equipmentIDs: equipmentIDsStr,
        page: pageStr,
        pageSize: pageSizeStr,
    } = parsed.data;

    const nameQuery = parsed.data.nameQuery;
    const muscleGroupIDs = muscleGroupIDsStr
        ? muscleGroupIDsStr.split(",").map((s) => parseInt(s, 10))
        : undefined;
    const equipmentIDs = equipmentIDsStr
        ? equipmentIDsStr.split(",").map((s) => parseInt(s, 10))
        : undefined;
    const page = pageStr ? parseInt(pageStr, 10) : undefined;
    const pageSize = pageSizeStr ? parseInt(pageSizeStr, 10) : undefined;

    const exercises = await ExerciseService.getAllExercises({
        nameQuery,
        muscleGroupIDs,
        equipmentIDs,
        page,
        pageSize,
    });

    return NextResponse.json(exercises, { status: 200 });
}

async function post_handler(req: NextRequest) {
    const body = (await req.json()) as ExerciseWithRelations;

    const createdExercise = await ExerciseService.createExercise(body);

    return NextResponse.json(createdExercise, { status: 200 });
}

export const POST = errorMiddleware(
    forceAuthMiddleware(adminMiddleware(post_handler)),
);

export const GET = errorMiddleware(get_handler);
