import prisma from "../lib/prisma";

export class EquipmentModel {
    static async getAllEquipment() {
        return prisma.equipment.findMany();
    }
}