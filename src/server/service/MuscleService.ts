import { MuscleModel } from "../model/MuscleModel";

export class MuscleService {
    static async getAllMuscleGroups() {
        return MuscleModel.getAllMuscleGroups();
    }
}