"use client";
import { Button, useDisclosure } from "@heroui/react";
import { useContext, useState } from "react";
import { AuthContext } from "@/components/contexts/AuthContext";
import ExercisesList from "@/components/lists/ExercisesList";
import EditExerciseModal from "@/components/modal/EditExerciseModal";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";

export default function AdminPage() {
    const disclosure = useDisclosure();
    const [selectedExercise, setSelectedExercise] =
        useState<ExerciseWithRelations | null>(null);
    const authContext = useContext(AuthContext);

    if (authContext.user?.role !== "ADMIN") {
        return <p>Access Denied</p>;
    }
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <section>
                <h2>Edit Exercises</h2>
                <EditExerciseModal
                    disclosure={disclosure}
                    exercise={selectedExercise}
                ></EditExerciseModal>
                <Button
                    onPress={() => {
                        setSelectedExercise(null);
                        disclosure.onOpen();
                    }}
                    color="primary"
                >
                    Add New Exercise
                </Button>
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
