"use client";
import WorkoutForm from "@/components/forms/WorkoutForm";
import WorkoutProvider from "@/components/providers/WorkoutProvider";

export default function TrackPage() {
    return (
        <div>
            <WorkoutProvider>
                <h1>Track Page</h1>
                <WorkoutForm />
            </WorkoutProvider>
        </div>
    );
}