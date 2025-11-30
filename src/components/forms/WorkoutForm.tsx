import { useContext } from "react";
import { Button } from "@/lib/heroui";
import Timer from "../atoms/Timer";
import { WorkoutContext } from "../contexts/WorkoutContext";
import SelectExerciseTrack from "../selector/SelectExerciseTrack";
import TrackExerciseForm from "./TrackExerciseForm";

export default function WorkoutForm() {
    const workoutContext = useContext(WorkoutContext);

    return (
        <div>

            {!workoutContext.readonly &&
                (workoutContext.currentWorkout == null ? (
                    <Button onPress={workoutContext.startWorkout}>
                        Start New Workout
                    </Button>
                ) : (
                    <Button onPress={workoutContext.endWorkout}>End Workout</Button>
                ))}
            {workoutContext.currentWorkout && (
                <div className="my-4">
                    <h2 className="text-xl font-semibold mb-2">
                        Current Workout: {workoutContext.currentWorkout.name}
                    </h2>
                    <Timer
                        startTime={workoutContext.currentWorkout.startTime}
                        endTime={workoutContext.currentWorkout.endTime}
                    />
                </div>
            )}
            <div className="grid gap-10">
                {workoutContext.currentWorkout?.exercises.map((exercise) => (
                    <TrackExerciseForm key={exercise.id} id={exercise.name} />
                ))}
            </div>
            {!workoutContext.readonly && workoutContext.currentWorkout !== null && (
                <SelectExerciseTrack />
            )}
        </div>
    );
}
