"use client";
import { createContext } from "react";
import type { Exercise } from "@/generated/prisma/client";
import type { SetType } from "@/generated/prisma/enums";

export interface Workout {
    id: number;
    startTime: Date;
    endTime: Date | null;
    exercises: ExerciseInWorkout[];
}

export interface ExerciseInWorkout {
    id: number;
    name: string;
    sets: SetInExercise[];
}

export interface SetInExercise {
    id: string;
    reps: number;
    weight: number;
    order: number;
    type: SetType;
    done: boolean;
}

export const WorkoutContext = createContext<{
    currentWorkout: Workout | null;
    readonly: boolean;
    startWorkout: () => Promise<void>;
    endWorkout: () => Promise<void>;
    addExercise: (exercise: Exercise) => Promise<void>;
    addSet: (
        exerciseId: number,
        reps: number,
        weight: number,
        type: SetType,
    ) => Promise<void>;
    updateSet: (
        exerciseId: number,
        setId: string,
        weight: number,
        reps: number,
        type: SetType,
        done: boolean,
    ) => Promise<void>;
}>({
    currentWorkout: null,
    readonly: false,
    startWorkout: async () => {
        console.log("startWorkout function not implemented");
    },
    endWorkout: async () => {
        console.log("endWorkout function not implemented");
    },
    addExercise: async () => {
        console.log("addExercise function not implemented");
    },
    addSet: async () => {
        console.log("addSet function not implemented");
    },
    updateSet: async () => {
        console.log("updateSet function not implemented");
    },
});
