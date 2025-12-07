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
    disclosure: any;
    exercise: ExerciseWithRelations | null;
}) {
    const { onOpen, isOpen, onOpenChange } = disclosure;
    // if (!exercise) {
    //     exercise = {
    //         id: 0,
    //         name: "",
    //         description: "",
    //         imageUrl: "",
    //         exerciseEquipments: [],
    //         exerciseMuscleGroups: [],
    //     };
    // }

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
        console.log("Submitting exercise:", exerciseState);
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
            size="lg"
        >
            <ModalContent>
                <ModalHeader>Add New Exercise</ModalHeader>
                <ModalBody>
                    <Form>
                        <Input
                            type="text"
                            label="Exercise Name"
                            defaultValue={exerciseState.name}
                            value={exerciseState.name}
                            onValueChange={(value) =>
                                setExerciseState({ ...exerciseState, name: value })
                            }
                        />
                        <Image
                            src={exerciseState.imageUrl || "https://placehold.co/400"}
                            alt={exerciseState.name}
                        />
                        <Input
                            type="file"
                            label="Exercise Image"
                            onChange={(ev) => {
                                const f = ev.target.files?.[0];
                                if (!f) return;
                                const reader = new FileReader();
                                reader.onload = () =>
                                    setExerciseState((s) => {
                                        if (!s) return s; // should not happen
                                        return {
                                            ...s,
                                            imageUrl: String(reader.result),
                                        };
                                    });
                                reader.readAsDataURL(f);
                            }}
                        />
                        <Textarea
                            type="text"
                            label="Exercise Description"
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
                    <Button onPress={onOpenChange}>Close</Button>
                    <Button color="primary" type="submit" onPress={handleSubmit}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
