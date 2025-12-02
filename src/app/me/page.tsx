"use client";
import { div } from "framer-motion/client";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/contexts/AuthContext";
import type { Workout } from "@/components/contexts/WorkoutContext";
import WorkoutForm from "@/components/forms/WorkoutForm";
import CollapsedWorkoutModal from "@/components/modal/CollapsedWorkoutModal";
import WorkoutProvider from "@/components/providers/WorkoutProvider";
import { Backend } from "@/lib/backend";
import { Button } from "@/lib/heroui";

export default function MePage() {
    const authContext = useContext(AuthContext);

    if (!authContext.loading && !authContext.user) {
        redirect("/login");
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
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mt-6">My Workouts</h2>
                        {workouts.length === 0 ? (
                            <p>No workouts found.</p>
                        ) : (
                            <ul className="mt-4 space-y-4">
                                {workouts.map((workout) => (
                                    <div key={workout.id}>
                                        {/* <WorkoutProvider data={workout}>
                                            <WorkoutForm />
                                        </WorkoutProvider> */}
                                        <CollapsedWorkoutModal
                                            workout={workout}
                                            trigger={(onOpen) => (
                                                <div
                                                    className="p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                                                    onClick={onOpen}
                                                >
                                                    <h3 className="text-lg font-semibold">
                                                        Workout on{" "}
                                                        {new Date(workout.startTime).toLocaleDateString()}
                                                    </h3>
                                                    <p>
                                                        {workout.exercises.length} exercise
                                                        {workout.exercises.length !== 1 ? "s" : ""}
                                                    </p>
                                                    <Button
                                                        onPress={() => {
                                                            Backend.deleteWorkout(workout.id);
                                                        }}
                                                    >Delete</Button>
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
