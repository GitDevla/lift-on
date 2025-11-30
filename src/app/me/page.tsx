"use client";
import { div } from "framer-motion/client";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/contexts/AuthContext";
import WorkoutForm from "@/components/forms/WorkoutForm";
import WorkoutProvider from "@/components/providers/WorkoutProvider";
import type { Workout } from "@/generated/prisma/client";
import { Backend } from "@/lib/backend";

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
                                        <WorkoutProvider id={workout.id}>
                                            <WorkoutForm />
                                        </WorkoutProvider>
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
