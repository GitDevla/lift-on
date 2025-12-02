"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { is } from "zod/locales";
import ExerciseCard from "@/components/cards/ExerciseCard";
import MuscleGroupSelector from "@/components/selector/MuscleGroupSelector";
import { Backend } from "@/lib/backend";
import { Input } from "@/lib/heroui";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";

export default function ExercisesList({
    overrideOnPress,
}: {
    overrideOnPress?: (exercise: ExerciseWithRelations) => void;
}) {
    const [shownExercises, setShownExercises] = useState<
        Array<ExerciseWithRelations>
    >([]);
    const [nameQuery, setNameQuery] = useState<string>("");
    const [muscleGroupFilter, setMuscleGroupFilter] = useState<string[]>([]);
    const page = useRef<number>(1);
    const isLoading = useRef<boolean>(false);
    const hasMore = useRef<boolean>(true);

    const freshSearch = () => {
        page.current = 1;
        isLoading.current = true;
        Backend.getExercises({
            muscleGroupIDs: muscleGroupFilter,
            nameQuery: nameQuery,
            page: page.current,
        }).then((res) => {
            if (res.ok) {
                if (res.data.length === 0) {
                    hasMore.current = false;
                } else {
                    hasMore.current = true;
                }
                setShownExercises(res.data);
            } else {
                console.error("Failed to fetch exercises:", res.error);
            }
            isLoading.current = false;
        });
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const loadMore = useCallback(() => {
        if (isLoading.current) {
            return;
        }
        if (!hasMore.current) {
            return;
        }
        isLoading.current = true;
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
            isLoading.current = false;
        });
    }, [muscleGroupFilter, nameQuery]);

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
    }, [loadMore]);

    return (
        <div className="@container">
            <div>
                <h1 className="text-2xl font-bold mb-4 text-center">Exercises</h1>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
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
            <div className="grid grid-cols-1 @lg:grid-cols-4 gap-4">
                {shownExercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        overrideOnPress={overrideOnPress}
                    />
                ))}
            </div>
        </div>
    );
}
