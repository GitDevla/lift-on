"use client";
import {
    addToast,
    Button,
    Divider,
    useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "@/client/components/contexts/AuthContext";
import ExercisesList from "@/client/components/lists/ExercisesList";
import EditExerciseModal from "@/client/components/modal/EditExerciseModal";
import type { ExerciseWithRelations } from "@/server/model/ExerciseModel";

export default function AdminPage() {
    const disclosure = useDisclosure();
    const [selectedExercise, setSelectedExercise] =
        useState<ExerciseWithRelations | null>(null);
    const authContext = useContext(AuthContext);
    const router = useRouter();
    if (!authContext.loading && authContext.user?.role !== "ADMIN") {
        addToast({
            title: "Access Denied",
            description: "You do not have permission to access the admin panel.",
            color: "danger",
        });
        router.push("/");
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage exercises and app content</p>
                </div>
            </div>

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
