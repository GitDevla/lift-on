"use client";
import { Button, Divider, useDisclosure } from "@heroui/react";
import { useState } from "react";
import HeroText from "@/client/components/layout/HeroText";
import ExercisesList from "@/client/components/lists/ExercisesList";
import EditExerciseModal from "@/client/components/modal/EditExerciseModal";
import ForceRole from "@/client/lib/ForceRole";
import type { ExerciseWithRelations } from "@/server/model/ExerciseModel";

export default function AdminPage() {
    const disclosure = useDisclosure();
    const [selectedExercise, setSelectedExercise] =
        useState<ExerciseWithRelations | null>(null);
    ForceRole("ADMIN");
    return (
        <div className="space-y-6">
            <HeroText
                title="Admin Dashboard"
                subtitle="Manage exercises and app content"
            />

            <Divider />

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Exercise Management</h2>
                    <Button
                        onPress={() => {
                            setSelectedExercise(null);
                            disclosure.onOpen();
                        }}
                        color="primary"
                        size="lg"
                    >
                        + Add New Exercise
                    </Button>
                </div>

                <EditExerciseModal
                    disclosure={disclosure}
                    exercise={selectedExercise}
                />

                <ExercisesList
                    overrideOnPress={(exercise) => {
                        setSelectedExercise(exercise);
                        disclosure.onOpen();
                    }}
                />
            </section>
        </div>
    );
}
