"use client";
import { use, useEffect, useRef, useState } from "react";
import ExerciseCard from "@/components/cards/ExerciseCard";
import MuscleGroupSelector from "@/components/selector/MuscleGroupSelector";
import { Backend } from "@/lib/backend";
import { Input, } from "@/lib/heroui";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";

export default function ExercisesList({
    overrideOnPress,
}: {
    overrideOnPress?: (exercise: ExerciseWithRelations) => void;
}
) {
    const [shownExercises, setShownExercises] = useState<
        Array<ExerciseWithRelations>
    >([]);
    const [nameQuery, setNameQuery] = useState<string>("");
    const [muscleGroupFilter, setMuscleGroupFilter] = useState<string[]>([]);
    const page = useRef<number>(1);

    const freshSearch = () => {
        page.current = 1;
        Backend.getExercises({
            muscleGroupIDs: muscleGroupFilter,
            nameQuery: nameQuery,
            page: page.current,
        }).then((res) => {
            if (res.ok) {
                setShownExercises(res.data);
            } else {
                console.error("Failed to fetch exercises:", res.error);
            }
        });
    }

    const loadMore = () => {
        page.current += 1;
        Backend.getExercises({
            muscleGroupIDs: muscleGroupFilter,
            nameQuery: nameQuery,
            page: page.current,
        }).then((res) => {
            if (res.ok) {
                setShownExercises((prev) => [...prev, ...res.data]);
            } else {
                console.error("Failed to fetch exercises:", res.error);
            }
        });
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const timeout = setTimeout(() => {
            freshSearch();
        }, 300);
        return () => clearTimeout(timeout);
    }, [nameQuery, muscleGroupFilter]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        freshSearch();
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 500
            ) {
                loadMore();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    return (
        <div>
            <div>
                <Input
                    label="Search Exercises"
                    value={nameQuery}
                    onValueChange={setNameQuery}
                />
                <MuscleGroupSelector
                    value={muscleGroupFilter}
                    onChange={setMuscleGroupFilter}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4">
                {shownExercises.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} overrideOnPress={overrideOnPress} />
                ))}
            </div>
        </div>
    );
}
