"use client";
import ExercisesList from "@/components/lists/ExercisesList";
import { Divider } from "@/lib/heroui";
export default function ExercisesPage() {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Exercises</h1>
                <p className="text-gray-400 mt-1">Browse all available exercises</p>
            </div>
        </div>

        <Divider />
        <ExercisesList />
    </div>
}
