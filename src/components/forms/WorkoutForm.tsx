import { useContext } from "react";
import { Button } from "@/lib/heroui";
import { WorkoutContext } from "../contexts/WorkoutContext";
import SelectExerciseTrack from "../selector/SelectExerciseTrack";
import TrackExerciseForm from "./TrackExerciseForm";

export default function WorkoutForm() {
    const workoutContext = useContext(WorkoutContext);


    return (
        <div>
            <h2>Workout Form</h2>
            {
                JSON.stringify(workoutContext.currentWorkout)
            }
            <Button onPress={workoutContext.startWorkout}>Start Workout</Button>
            <Button onPress={workoutContext.endWorkout}>End Workout</Button>
            <p>Started: {workoutContext.currentWorkout?.startTime.toDateString()}</p>
            <p>Ended: {workoutContext.currentWorkout?.endTime?.toDateString() || "In Progress"}</p>
            <SelectExerciseTrack />
            <div>
                {workoutContext.currentWorkout?.exercises.map((exercise) => (
                    <TrackExerciseForm key={exercise.id} id={exercise.name} />
                ))}
            </div>
        </div>
    );
}
