import { EquipmentModel } from "../model/EquipmentModel";

export class EquipmentService {
    static async getAllEquipment() {
        return EquipmentModel.getAllEquipment();
    }
}