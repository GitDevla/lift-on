import { cn } from "clsx-for-tailwind";
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
