import { useContext } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@/lib/heroui";
import { WorkoutContext } from "../contexts/WorkoutContext";
import ExercisesList from "../lists/ExercisesList";

export default function SelectExerciseTrack() {
    const workoutContext = useContext(WorkoutContext);
    const { onOpen, isOpen, onOpenChange } = useDisclosure();

    return (
        <div>
            <Button onPress={onOpen}>Add Exercise</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>Add New Exercise</ModalHeader>
                    <ModalBody>
                        <ExercisesList
                            overrideOnPress={(exercise) => {
                                workoutContext.addExercise(exercise);
                                onOpenChange();
                            }}
                        />

                        <Button onPress={onOpenChange}>Close</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
