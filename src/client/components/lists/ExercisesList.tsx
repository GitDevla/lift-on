"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import ExerciseCard from "@/client/components/cards/ExerciseCard";
import MuscleGroupSelector from "@/client/components/selector/MuscleGroupSelector";
import ExerciseBackend from "@/client/lib/backend/ExerciseBackend";
import { Input } from "@/client/lib/heroui";
import type { ExerciseWithRelations } from "@/server/model/ExerciseModel";
import Collapsable from "../atoms/Collapsable";
import ExecuteWhenOnScreen from "../atoms/ExecuteWhenOnScreen";
import EquipmentGroupSelector from "../selector/EquipmentGroupSelector";

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
    const [equipmentGroupFilter, setEquipmentGroupFilter] = useState<string[]>(
        [],
    );
    const page = useRef<number>(1);
    const isLoading = useRef<boolean>(false);
    const hasMore = useRef<boolean>(true);

    const freshSearch = () => {
        page.current = 1;
        isLoading.current = true;
        ExerciseBackend.fetch({
            muscleGroupIDs: muscleGroupFilter,
            nameQuery: nameQuery,
            page: page.current,
            equipmentIDs: equipmentGroupFilter,
            pageSize: 16,
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
        ExerciseBackend.fetch({
            muscleGroupIDs: muscleGroupFilter,
            nameQuery: nameQuery,
            page: page.current,
            equipmentIDs: equipmentGroupFilter,
            pageSize: 16,
        }).then((res) => {
            if (res.ok) {
                setShownExercises((prev) => [...prev, ...res.data]);
            } else {
                console.error("Failed to fetch exercises:", res.error);
            }
            isLoading.current = false;
        });
    }, [muscleGroupFilter, nameQuery, equipmentGroupFilter]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const timeout = setTimeout(() => {
            freshSearch();
        }, 300);
        return () => clearTimeout(timeout);
    }, [nameQuery, muscleGroupFilter, equipmentGroupFilter]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        freshSearch();
    }, []);

    return (
        <div className="@container">
            <div className="grid grid-cols-1 gap-4 mb-5">
                <Input
                    label="Search Exercises"
                    value={nameQuery}
                    onValueChange={setNameQuery}
                />
                <Collapsable title="Additional Filters">
                    <div className="flex flex-col gap-4 mt-4">
                        <MuscleGroupSelector
                            value={muscleGroupFilter}
                            onChange={setMuscleGroupFilter}
                        />
                        <EquipmentGroupSelector
                            value={equipmentGroupFilter}
                            onChange={setEquipmentGroupFilter}
                        />
                    </div>
                </Collapsable>
            </div>
            <div className="grid grid-cols-1 @lg:grid-cols-4 gap-4">
                {shownExercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        overrideOnPress={overrideOnPress}
                    />
                ))}
                <ExecuteWhenOnScreen onScreen={loadMore} />
            </div>
        </div>
    );
}
