"use client";
import HeroText from "@/client/components/layout/HeroText";
import ExercisesList from "@/client/components/lists/ExercisesList";
import { Divider } from "@/client/lib/heroui";
export default function ExercisesPage() {
    return (
        <div className="space-y-6">
            <HeroText title="Exercises" subtitle="Browse all available exercises" />
            <Divider />
            <ExercisesList />
        </div>
    );
}
