import {
    Button,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@/lib/heroui";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";

export default function ExerciseModal({
    exercise,
    disclosure,
}: {
    exercise: ExerciseWithRelations;
    disclosure: any;
}) {
    const { isOpen, onOpen, onOpenChange } = disclosure;
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {exercise.name}
                        </ModalHeader>
                        <ModalBody>
                            <Image src={exercise.imageUrl as string} alt={exercise.name} />
                            {exercise.description.split("\n").map((para, idx) => (
                                <p key={idx} className="mb-2">
                                    {para}
                                </p>
                            ))}
                            {exercise.exerciseMuscleGroups.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold">Muscle Groups:</h3>
                                    <ul className="list-disc list-inside">
                                        {exercise.exerciseMuscleGroups.map((mg) => (
                                            <li key={mg.muscleGroupId}>{mg.muscleGroup.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {exercise.exerciseEquipments && (
                                <div className="mt-4">
                                    <h3 className="font-semibold">Equipment:</h3>
                                    <ul className="list-disc list-inside">
                                        {exercise.exerciseEquipments.map((eq) => (
                                            <li key={eq.equipmentId}>{eq.equipment.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
