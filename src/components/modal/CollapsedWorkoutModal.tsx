import type React from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@/lib/heroui";
import type { Workout } from "../contexts/WorkoutContext";
import WorkoutForm from "../forms/WorkoutForm";
import WorkoutProvider from "../providers/WorkoutProvider";

export default function CollapsedWorkoutModal({
    workout,
    trigger,
}: {
    trigger: (onOpen: () => void) => React.ReactNode;
    workout: Workout;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                scrollBehavior="inside"
                size="xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-4">
                                <h3 className="text-lg font-semibold">Edit Workout</h3>
                            </ModalHeader>
                            <ModalBody>
                                <WorkoutProvider data={workout}>
                                    <WorkoutForm />
                                </WorkoutProvider>
                            </ModalBody>
                            <ModalFooter className="flex justify-end gap-2">
                                <Button variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => { }}
                                >
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            {trigger(onOpen)}
        </>
    );
}
