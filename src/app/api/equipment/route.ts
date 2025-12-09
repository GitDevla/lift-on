import { type NextRequest, NextResponse } from "next/server";
import { EquipmentService } from "@/server/service/EquipmentService";

async function get_handler(req: NextRequest) {
    const equipmentGroups = await EquipmentService.getAllEquipment();
    return NextResponse.json(equipmentGroups, { status: 200 });
}

export const GET = get_handler;
