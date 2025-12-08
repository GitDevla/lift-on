import { useRef } from "react";
import WorkoutBackend from "@/client/lib/backend/WorkoutBackend";
import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@/client/lib/heroui";
import type { Workout } from "../contexts/WorkoutContext";
import CollapsedWorkoutModal from "../modal/CollapsedWorkoutModal";

export default function UserWorkoutCard({ workout }: { workout: Workout }) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleDelete = async () => {
        const res = await WorkoutBackend.delete(workout.id);
        if (res.ok) {
            addToast({
                title: "Workout Deleted",
                description: "The workout has been successfully deleted.",
                color: "success",
            });
            wrapperRef?.current?.remove();
        }
        else {
            addToast({
                title: "Error Deleting Workout",
                description: res.error || "An unknown error occurred.",
                color: "danger",
            });
        }
    };

    return (
        <div ref={wrapperRef}>
            <CollapsedWorkoutModal
                workout={workout}
                trigger={(onOpen) => (
                    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
                    <div
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer text-left w-full relative"
                        onClick={onOpen}
                        onKeyDown={onOpen}
                    >
                        <h3 className="text-lg font-semibold">
                            Workout on {new Date(workout.startTime).toLocaleDateString()}
                        </h3>
                        <p>
                            {workout.exercises.length} exercise
                            {workout.exercises.length !== 1 ? "s" : ""}
                        </p>
                        <div className="absolute top-2 right-2">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant="bordered">Open Menu</Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                        onPress={handleDelete}
                                    >
                                        Delete Workout
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
