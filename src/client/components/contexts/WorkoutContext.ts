"use client";
import { createContext } from "react";
import type { Exercise } from "@/server/generated/prisma/client";
import type { SetType } from "@/server/generated/prisma/enums";

export interface Workout {
    id: number;
    startTime: Date;
    endTime: Date | null;
    exercises: ExerciseInWorkout[];
}

export interface ExerciseInWorkout {
    id: number;
    name: string;
    imageUrl: string;
    sets: SetInExercise[];
    previousSets?: {
        repetitions: number;
        weight: number;
    }[];
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
    removeSet: (exerciseId: number, setId: string) => Promise<void>;
    removeExercise: (exerciseId: number) => Promise<void>;
    moveExerciseUp: (exerciseId: number) => Promise<void>;
    moveExerciseDown: (exerciseId: number) => Promise<void>;
    setEditable: (isEditable: boolean) => void;
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
    removeSet: async () => {
        console.log("removeSet function not implemented");
    },
    removeExercise: async () => {
        console.log("removeExercise function not implemented");
    },
    moveExerciseUp: async () => {
        console.log("moveExerciseUp function not implemented");
    },
    moveExerciseDown: async () => {
        console.log("moveExerciseDown function not implemented");
    },
    setEditable: () => {
        console.log("setEditable function not implemented");
    },
});
