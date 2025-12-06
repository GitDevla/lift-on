"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/components/contexts/AuthContext";
import WorkoutForm from "@/components/forms/WorkoutForm";
import WorkoutProvider from "@/components/providers/WorkoutProvider";
import { addToast, Divider } from "@/lib/heroui";

export default function TrackPage() {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    if (!authContext.loading && !authContext.user) {
        addToast({
            title: "You must be logged in to access the track page.",
            color: "warning",
        });
        router.push("/auth");
    }

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
