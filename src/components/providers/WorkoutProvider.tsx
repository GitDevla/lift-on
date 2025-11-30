"use client";
import { use, useEffect, useState } from "react";
import type { Exercise } from "@/generated/prisma/client";
import type { SetType } from "@/generated/prisma/enums";
import { Backend } from "@/lib/backend";
import { type Workout, WorkoutContext } from "../contexts/WorkoutContext";

export default function WorkoutProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
    const startWorkout = async () => {
        const serverWorkout = await Backend.startNewWorkout();
        if (!serverWorkout.ok) {
            throw new Error("Failed to start new workout");
        }
        setCurrentWorkout({
            id: serverWorkout.data.workout.id,
            startTime: new Date(serverWorkout.data.workout.startedAt),
            endTime: null,
            exercises: [],
        });
    };
    const endWorkout = async () => {
        if (currentWorkout) {
            setCurrentWorkout({
                ...currentWorkout,
                endTime: new Date(),
            });
        }
    };
    const addExercise = async (exercise: Exercise) => {
        if (currentWorkout?.exercises.find((ex) => ex.id === exercise.id)) {
            return;
        }
        if (currentWorkout) {
            const newExercise = {
                id: exercise.id,
                name: exercise.name,
                sets: [],
            };
            setCurrentWorkout({
                ...currentWorkout,
                exercises: [...currentWorkout.exercises, newExercise],
            });
        }
    };
    const addSet = async (
        exerciseId: number,
        reps: number,
        weight: number,
        type: SetType,
    ) => {
        if (currentWorkout) {
            const updatedExercises = currentWorkout.exercises.map((exercise) => {
                if (exercise.id === exerciseId) {
                    const newSet = {
                        id: `set${exercise.sets.length + 1}`,
                        reps,
                        weight,
                        order: exercise.sets.length + 1,
                        type,
                        done: false,
                    };
                    return {
                        ...exercise,
                        sets: [...exercise.sets, newSet],
                    };
                }
                return exercise;
            });
            setCurrentWorkout({
                ...currentWorkout,
                exercises: updatedExercises,
            });
        }
    };

    const updateSet = async (
        exerciseId: number,
        setId: string,
        weight: number,
        reps: number,
        type: SetType,
        done: boolean,
    ) => {
        if (currentWorkout) {
            const updatedExercises = currentWorkout.exercises.map((exercise) => {
                if (exercise.id === exerciseId) {
                    const updatedSets = exercise.sets.map((set) => {
                        if (set.id === setId) {
                            return {
                                ...set,
                                weight,
                                reps,
                                type,
                                done,
                            };
                        }
                        return set;
                    });
                    return {
                        ...exercise,
                        sets: updatedSets,
                    };
                }
                return exercise;
            });
            setCurrentWorkout({
                ...currentWorkout,
                exercises: updatedExercises,
            });
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (currentWorkout) {
                await Backend.updateWorkout(currentWorkout);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [currentWorkout]);

    return (
        <WorkoutContext.Provider
            value={{
                currentWorkout,
                startWorkout,
                endWorkout,
                addExercise,
                addSet,
                updateSet,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}
