"use client";
import WorkoutForm from "@/client/components/forms/WorkoutForm";
import HeroText from "@/client/components/layout/HeroText";
import WorkoutProvider from "@/client/components/providers/WorkoutProvider";
import { forceAuthenticated } from "@/client/lib/ForceAuthenticated";
import { Divider } from "@/client/lib/heroui";

export default function TrackPage() {
    forceAuthenticated();

    return (
        <div className="space-y-6">
            <HeroText title="Track Your Workouts" subtitle="Log and monitor your exercise routines" />
            <Divider />
            <WorkoutProvider>
                <WorkoutForm />
            </WorkoutProvider>
        </div>
    );
}
