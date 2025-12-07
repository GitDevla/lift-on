import type { NextRequest } from "next/server";
import prisma from "@/server/lib/prisma";

async function get_handler(req: NextRequest) {
    const equipmentGroups = await prisma.equipment.findMany();
    return new Response(JSON.stringify(equipmentGroups), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const GET = get_handler;