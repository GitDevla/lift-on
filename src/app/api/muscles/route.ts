import type { NextRequest } from "next/server";
import prisma from "@/server/lib/prisma";

async function get_handler(req: NextRequest) {
    const muscleGroups = await prisma.muscleGroup.findMany();
    return new Response(JSON.stringify(muscleGroups), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const GET = get_handler;