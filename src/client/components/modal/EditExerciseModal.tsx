import { useEffect, useState } from "react";
import ExerciseBackend from "@/client/lib/backend/ExerciseBackend";
import {
    Button,
    Form,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from "@/client/lib/heroui";
import type { ExerciseWithRelations } from "@/server/model/ExerciseModel";
import EquipmentGroupSelector from "../selector/EquipmentGroupSelector";
import MuscleGroupSelector from "../selector/MuscleGroupSelector";

export default function EditExerciseModal({
    disclosure,
    exercise,
}: {
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onOpenChange: () => void;
    };
    exercise: ExerciseWithRelations | null;
}) {
    const { onOpen, isOpen, onOpenChange } = disclosure;

    const [exerciseState, setExerciseState] =
        useState<ExerciseWithRelations | null>(null);

    useEffect(() => {
        if (exercise) {
            setExerciseState(exercise);
        } else {
            setExerciseState({
                id: -1,
                name: "",
                description: "",
                imageUrl: "",
                exerciseEquipments: [],
                exerciseMuscleGroups: [],
            });
        }
    }, [exercise]);

    if (!exerciseState) {
        return null;
    }

    const handleSubmit = async () => {
        if (exerciseState.id === -1) {
            // New exercise
            const res = await ExerciseBackend.create(exerciseState);
            if (res.ok) {
                onOpenChange();
            } else {
                console.error("Failed to create exercise:", res.error);
            }
            return;
        }
        const res = await ExerciseBackend.update(exerciseState);
        if (res.ok) {
            onOpenChange();
        } else {
            console.error("Failed to update exercise:", res.error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            backdrop="blur"
            size="2xl"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold">
                        {exerciseState.id === -1 ? "Add New Exercise" : "Edit Exercise"}
                    </h2>
                    <p className="text-sm text-gray-400 font-normal">
                        {exerciseState.id === -1
                            ? "Create a new exercise for the database"
                            : `Editing: ${exerciseState.name}`}
                    </p>
                </ModalHeader>
                <ModalBody>
                    <Form className="flex flex-col gap-4">
                        <Input
                            type="text"
                            label="Exercise Name"
                            placeholder="e.g., Barbell Bench Press"
                            defaultValue={exerciseState.name}
                            value={exerciseState.name}
                            onValueChange={(value) =>
                                setExerciseState({ ...exerciseState, name: value })
                            }
                            isRequired
                        />

                        <div className="space-y-2">
                            {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                            <label className="text-sm font-medium">Exercise Image</label>
                            {exerciseState.imageUrl && (
                                <div className="mb-2 overflow-hidden rounded-lg aspect-square size-44 relative">
                                    <img
                                        src={exerciseState.imageUrl}
                                        alt={exerciseState.name}
                                        className="object-cover rounded-lg absolute inset-0 w-full h-full"
                                    />
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(ev) => {
                                    const f = ev.target.files?.[0];
                                    if (!f) return;
                                    const reader = new FileReader();
                                    reader.onload = () =>
                                        setExerciseState((s) => {
                                            if (!s) return s;
                                            return {
                                                ...s,
                                                imageUrl: String(reader.result),
                                            };
                                        });
                                    reader.readAsDataURL(f);
                                }}
                            />
                        </div>

                        <Textarea
                            label="Exercise Description"
                            placeholder="Describe the exercise, form tips, etc."
                            minRows={3}
                            defaultValue={exerciseState.description || ""}
                            value={exerciseState.description || ""}
                            onValueChange={(value) =>
                                setExerciseState({ ...exerciseState, description: value })
                            }
                        />

                        <MuscleGroupSelector
                            value={exerciseState.exerciseMuscleGroups.map((mg) =>
                                mg.muscleGroupId.toString(),
                            )}
                            overrideHint="Select Muscle Groups Involved"
                            onChange={(newValue) => {
                                const updatedMuscleGroups = newValue.map((id) => ({
                                    exerciseId: exerciseState.id,
                                    muscleGroupId: parseInt(id),
                                    isPrimary: false,
                                    muscleGroup: { id: parseInt(id), name: "" },
                                }));
                                setExerciseState({
                                    ...exerciseState,
                                    exerciseMuscleGroups: updatedMuscleGroups,
                                });
                            }}
                        />

                        <EquipmentGroupSelector
                            overrideHint="Select Required Equipment"
                            value={exerciseState.exerciseEquipments.map((eq) =>
                                eq.equipmentId.toString(),
                            )}
                            onChange={(newValue) => {
                                const updatedEquipments = newValue.map((id) => ({
                                    exerciseId: exerciseState.id,
                                    equipmentId: parseInt(id),
                                    equipment: { id: parseInt(id), name: "" },
                                }));
                                setExerciseState({
                                    ...exerciseState,
                                    exerciseEquipments: updatedEquipments,
                                });
                            }}
                        />
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onOpenChange}>
                        Cancel
                    </Button>
                    <Button color="primary" onPress={handleSubmit}>
                        {exerciseState.id === -1 ? "Create Exercise" : "Save Changes"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
