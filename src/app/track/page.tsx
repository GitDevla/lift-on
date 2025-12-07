"use client";
import WorkoutForm from "@/client/components/forms/WorkoutForm";
import WorkoutProvider from "@/client/components/providers/WorkoutProvider";
import { forceAuthenticated } from "@/client/lib/ForceAuthenticated";
import { Divider } from "@/client/lib/heroui";

export default function TrackPage() {
    forceAuthenticated();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Track Page</h1>
                    <p className="text-gray-400 mt-1">Manage your workouts</p>
                </div>
            </div>

            <Divider />
            <WorkoutProvider>
                <WorkoutForm />
            </WorkoutProvider>
        </div>
    );
}
