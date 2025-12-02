import { use, useContext, useEffect, useState } from "react";
import type { Exercise } from "@/generated/prisma/client";
import { Backend } from "@/lib/backend";
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
} from "@/lib/heroui";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";
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
            const res = await Backend.createExercise(exerciseState);
            if (res.ok) {
                onOpenChange();
            } else {
                console.error("Failed to create exercise:", res.error);
            }
            return;
        }
        const res = await Backend.updateExercise(exerciseState);
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
                    <Form
                    >
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
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onPress={onOpenChange}>Close</Button>
                    <Button
                        color="primary"
                        type="submit"
                        onPress={handleSubmit}
                    >
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
