"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/contexts/AuthContext";
import type { Workout } from "@/components/contexts/WorkoutContext";
import CollapsedWorkoutModal from "@/components/modal/CollapsedWorkoutModal";
import { Backend } from "@/lib/backend";
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/lib/heroui";

export default function MePage() {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    if (!authContext.loading && !authContext.user) {
        addToast({
            title: "You must be logged in to access your profile.",
            color: "warning",
        });
        router.push("/auth");
    }

    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        Backend.getMyWorkouts(1, 10).then((response) => {
            if (response.ok) {
                setWorkouts(response.data.workouts);
            }
        });
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            {authContext.user && (
                <>
                    <div className="mt-4">
                        <p>
                            <strong>Username:</strong> {authContext.user.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {authContext.user.email}
                        </p>
                        <p>
                            <strong>Role:</strong> {authContext.user.role}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mt-6">My Workouts</h2>
                        {workouts.length === 0 ? (
                            <p>No workouts found.</p>
                        ) : (
                            <ul className="mt-4 space-y-4">
                                {workouts.map((workout) => (
                                    <div key={workout.id}>
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
                                                        Workout on{" "}
                                                        {new Date(workout.startTime).toLocaleDateString()}
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
                                                                <DropdownItem key="delete" className="text-danger" color="danger"
                                                                    onPress={() => {
                                                                        Backend.deleteWorkout(workout.id);
                                                                    }}
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
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
