import { NotFoundError } from "@/server/lib/errorMiddleware";
import prisma from "@/server/lib/prisma";
import {
    ExerciseModel,
    type ExerciseWithRelations,
} from "@/server/model/ExerciseModel";
import { ImageModel } from "@/server/model/ImageModel";

export default class ExerciseService {
    static async updateExercise(exerciseId: number, data: ExerciseWithRelations) {
        const existingExercise = await ExerciseModel.getExerciseById(exerciseId);

        if (!existingExercise) throw new NotFoundError("Exercise not found");

        if (existingExercise.name !== data.name) {
            existingExercise.name = data.name;
        }
        if (existingExercise.description !== data.description) {
            existingExercise.description = data.description;
        }
        if (existingExercise.imageUrl !== data.imageUrl) {
            if (
                existingExercise.imageUrl &&
                !existingExercise.imageUrl.startsWith("http")
            ) {
                await ImageModel.delete("public" + existingExercise.imageUrl.replace("/api/", ""));
            }

            let newPath = data.imageUrl;
            if (data.imageUrl) {
                newPath = await ImageModel.save(
                    data.imageUrl,
                    `exercise_${exerciseId}`,
                );
            }
            existingExercise.imageUrl = newPath
                ? newPath.replace("public/", "/api/")
                : null;
        }

        const updatedExercise = await ExerciseModel.updateExercise(
            exerciseId,
            {
                name: existingExercise.name,
                description: existingExercise.description,
                imageUrl: existingExercise.imageUrl,
            },
            data.exerciseMuscleGroups.map((emg) => emg.muscleGroup.id),
            data.exerciseEquipments.map((ee) => ee.equipment.id),
        );

        return updatedExercise;
    }

    static async createExercise(data: ExerciseWithRelations) {
        const newExercise = await ExerciseModel.createExercise({
            name: data.name,
            description: data.description,
            imageUrl: "",
        });

        let imageUrl = "";
        if (data.imageUrl) {
            const savedPath = await ImageModel.save(
                data.imageUrl,
                `exercise_${newExercise.id}`,
            );
            imageUrl = savedPath.replace("public/", "/api/");
        }

        const updatedExercise = await ExerciseModel.updateExercise(
            newExercise.id,
            {
                name: newExercise.name,
                description: newExercise.description,
                imageUrl: imageUrl,
            },
            data.exerciseMuscleGroups.map((emg) => emg.muscleGroup.id),
            data.exerciseEquipments.map((ee) => ee.equipment.id),
        );

        return updatedExercise;
    }

    static async getUserStatForExercise(userId: string, exerciseId: number) {
        const lastPerformedByUser = await ExerciseModel.lastPerformedByUser(
            exerciseId,
            userId,
        );
        const statsForExercise = await ExerciseModel.getStatsForExercise(
            exerciseId,
            userId,
        );

        return {
            lastPerformed: lastPerformedByUser,
            stats: statsForExercise,
        };
    }

    static async getUserTrendForExercise(userId: string, exerciseId: number) {
        return ExerciseModel.getStatsForExercise(exerciseId, userId);
    }

    static async getLastPerformanceForExercise(
        userId: string,
        exerciseId: number,
    ) {
        return ExerciseModel.lastPerformedByUser(exerciseId, userId);
    }
}
