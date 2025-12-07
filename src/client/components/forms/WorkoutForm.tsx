import { useContext } from "react";
import { Button } from "@/client/lib/heroui";
import Timer from "../atoms/Timer";
import { WorkoutContext } from "../contexts/WorkoutContext";
import ConfirmationModal from "../modal/ConfirmationModal";
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
                    <ConfirmationModal
                        title="Confirm End Workout"
                        message="You really wanna end this workout? This action will set all incomplete sets as done."
                        onConfirm={() => workoutContext.endWorkout()}
                        trigger={(open) => (
                            <Button color="danger" onPress={open}>
                                End Workout
                            </Button>
                        )}
                    ></ConfirmationModal>
                ))}
            {workoutContext.currentWorkout && (
                <div className="my-4">
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
