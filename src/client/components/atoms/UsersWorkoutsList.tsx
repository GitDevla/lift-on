import { useEffect, useState } from "react";
import WorkoutBackend from "@/client/lib/backend/WorkoutBackend";
import UserWorkoutCard from "../cards/UserWokroutCard";
import type { Workout } from "../contexts/WorkoutContext";

export default function UsersWorkoutsList() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        WorkoutBackend.getUsers(1, 10).then((response) => {
            if (response.ok) {
                setWorkouts(response.data.workouts);
            }
        });
    }, []);
    return (
        <div>
            <h2 className="text-2xl font-bold mt-6">My Workouts</h2>
            {workouts.length === 0 ? (
                <p>No workouts found.</p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {workouts.map((workout) => (
                        <UserWorkoutCard key={workout.id} workout={workout} />
                    ))}
                </ul>
            )}
        </div>
    );
}
