import dotenv from "dotenv";
import { Role } from "@/server/generated/prisma/enums";
import prisma from "@/server/lib/prisma";
import HashService from "@/server/service/HashService";

dotenv.config();

export type Root = exercise[];

export interface exercise {
    exerciseId: string;
    name: string;
    gifUrl: string;
    targetMuscles: string[];
    bodyParts: string[];
    equipments: string[];
    secondaryMuscles: string[];
    instructions: string[];
}

async function readJsonFile(filePath: string): Promise<exercise[]> {
    const data = await import(filePath);
    return data.default as exercise[];
}

async function main() {
    const exerciseData = await readJsonFile("./data/exercises.json");

    for (const exercise of exerciseData) {
        console.log(`Seeding exercise: ${exercise.name}`);
        let muscles = exercise.targetMuscles;
        muscles = muscles.concat(exercise.secondaryMuscles);

        const exerciseRecord = await prisma.exercise.upsert({
            where: { name: exercise.name },
            update: {
                name: exercise.name,
                imageUrl: exercise.gifUrl,
                description: exercise.instructions.join("\n"),
            },
            create: {
                name: exercise.name,
                imageUrl: exercise.gifUrl,
                description: exercise.instructions.join("\n"),
            },
        });

        const muscleGroupRecords = await Promise.all(
            muscles.map((m) =>
                prisma.muscleGroup.upsert({
                    where: { name: m },
                    update: {},
                    create: { name: m },
                }),
            ),
        );

        await Promise.all(
            muscleGroupRecords.map((mg) =>
                prisma.exerciseMuscleGroup.upsert({
                    where: {
                        exerciseId_muscleGroupId: {
                            exerciseId: exerciseRecord.id,
                            muscleGroupId: mg.id,
                        },
                    },
                    update: {
                        isPrimary: exercise.targetMuscles.includes(mg.name),
                    },
                    create: {
                        exerciseId: exerciseRecord.id,
                        muscleGroupId: mg.id,
                        isPrimary: exercise.targetMuscles.includes(mg.name),
                    },
                }),
            ),
        );

        const equipmentRecords = await Promise.all(
            exercise.equipments.map((e) =>
                prisma.equipment.upsert({
                    where: { name: e },
                    update: {},
                    create: { name: e },
                }),
            ),
        );

        await Promise.all(
            equipmentRecords.map((eq) =>
                prisma.exerciseEquipment.upsert({
                    where: {
                        exerciseId_equipmentId: {
                            exerciseId: exerciseRecord.id,
                            equipmentId: eq.id,
                        },
                    },
                    update: {},
                    create: {
                        exerciseId: exerciseRecord.id,
                        equipmentId: eq.id,
                    },
                }),
            ),
        );
    }

    console.log("Seeding admin user");
    const passwordHash = await HashService.hashPassword("admin123");
    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {
            username: "admin",
            password: passwordHash,
            role: Role.ADMIN,
        },
        create: {
            username: "admin",
            email: "admin@example.com",
            password: passwordHash,
            role: Role.ADMIN,
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
