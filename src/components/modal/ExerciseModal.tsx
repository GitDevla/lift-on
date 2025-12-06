import { useContext, useEffect, useState } from "react";
import { Backend } from "@/lib/backend";
import {
    Button,
    Chip,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@/lib/heroui";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";
import { AuthContext } from "../contexts/AuthContext";
import OneRepMaxGraph from "../graphs/oneRepMaxGraph";

export default function ExerciseModal({
    exercise,
    disclosure,
}: {
    exercise: ExerciseWithRelations;
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onOpenChange: (isOpen: boolean) => void;
    };
}) {
    const authContext = useContext(AuthContext);
    const loggedIn = authContext.user !== null;
    const [userStats, setUserStats] = useState<{
        lastPerformed: Array<{
            repetitions: number;
            weight: number;
        }>;
        stats: Array<{
            one_rm: number;
            workout_date: string;
        }>;
    } | null>(null);

    useEffect(() => {
        if (!disclosure.isOpen) {
            return;
        }
        if (loggedIn) {
            Backend.getUserStatForExercise(exercise.id).then((response) => {
                if (response.ok) {
                    setUserStats(response.data);
                }
            });
        }
    }, [loggedIn, exercise.id, disclosure.isOpen]);

    const { isOpen, onOpen, onOpenChange } = disclosure;
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            backdrop="blur"
            size="md"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="capitalize flex flex-col gap-4">
                            {exercise.name}
                        </ModalHeader>
                        <ModalBody>
                            <div>
                                {exercise.exerciseMuscleGroups.length > 0 && (
                                    <div className="flex gap-2">
                                        <h3 className="font-semibold">Muscle Groups:</h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {exercise.exerciseMuscleGroups.map((mg) => (
                                                <Chip
                                                    key={mg.muscleGroupId}
                                                    color={mg.isPrimary ? "primary" : "default"}
                                                >
                                                    {mg.muscleGroup.name}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                {exercise.exerciseEquipments && (
                                    <div className="flex gap-2">
                                        <h3 className="font-semibold">Equipment:</h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {exercise.exerciseEquipments.map((eq) => (
                                                <Chip key={eq.equipmentId}>{eq.equipment.name}</Chip>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-full flex justify-center">
                                <Image src={exercise.imageUrl as string} alt={exercise.name} />
                            </div>
                            <ul className="mt-4 list-decimal pl-5 space-y-2">
                                {exercise.description.split("\n").map((para, idx) => (
                                    <li key={idx} className="mb-2">
                                        {para.replace(/^Step:\d/, "").trim()}
                                    </li>
                                ))}
                            </ul>
                            {loggedIn ? (
                                <div className="mt-4 text-sm text-gray-500 italic">
                                    <h4>Your Progress with this Exercise:</h4>
                                    <div>
                                        <OneRepMaxGraph stats={userStats?.stats || []} />
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 text-sm text-gray-500 italic">
                                    Log in to track your progress with this exercise from the
                                    Track page.
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
