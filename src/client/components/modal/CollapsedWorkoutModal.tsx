import type React from "react";
import { useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Switch,
    useDisclosure,
} from "@/client/lib/heroui";
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
    const [editable, setEditable] = useState<boolean>(false);

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
                                <Switch isSelected={editable} onValueChange={setEditable} className="mb-4">
                                    {editable ? "Editing Enabled" : "Read-Only Mode"}
                                </Switch>
                                <WorkoutProvider data={workout} editable={editable}>
                                    <WorkoutForm />
                                </WorkoutProvider>
                            </ModalBody>
                            <ModalFooter className="flex justify-end gap-2">
                                <Button onPress={onClose} color="primary">
                                    OK
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
