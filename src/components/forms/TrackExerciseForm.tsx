import { cn } from "clsx-for-tailwind";
import { useContext } from "react";
import { SetType } from "@/generated/prisma/enums";
import {
    Button,
    Checkbox,
    Image,
    Input,
    NumberInput,
    Select,
    SelectItem,
} from "@/lib/heroui";
import { WorkoutContext } from "../contexts/WorkoutContext";

export default function TrackExerciseForm({ id }: { id: string }) {
    const workoutContext = useContext(WorkoutContext);
    const exercise = workoutContext.currentWorkout?.exercises.find(
        (ex) => ex.name === id,
    )!;

    return (
        <div>
            <div key={exercise.id}>
                <div className="flex items-center bg-content2 rounded-md p-2 px-10 gap-10">
                    <Image
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        width={100}
                        height={100}
                    />
                    <h3 className="capitalize text-lg">{exercise.name}</h3>
                </div>
                <div>
                    <div className="grid grid-cols-9 font-bold gap-3 text-content4-foreground mb-2">
                        <div className="text-center">Type</div>
                        <div className="col-span-2 text-center">Prev</div>
                        <div className="col-span-2 text-center">Weight</div>
                        <div className="col-span-2 text-center">Rep</div>
                        {workoutContext.readonly ? null : (
                            <>
                                <div className="text-center">Done</div>
                                <div className="text-center">Remove</div>
                            </>
                        )}
                    </div>
                    {exercise.sets.map((set) => (
                        <div
                            key={set.id}
                            className={cn(
                                "grid grid-cols-9 gap-3 items-center justify-items-center p-2  rounded-md",
                                set.done && "bg-green-500",
                            )}
                        >
                            <div className="w-full">
                                <Select
                                    label="Type"
                                    selectedKeys={[set.type]}
                                    onSelectionChange={(e) =>
                                        workoutContext.updateSet(
                                            exercise.id,
                                            set.id,
                                            set.weight,
                                            set.reps,
                                            e.currentKey as SetType,
                                            set.done,
                                        )
                                    }
                                    isDisabled={workoutContext.readonly || set.done}
                                >
                                    {Object.values(SetType).map((type) => (
                                        <SelectItem key={type}>{type}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-span-2 w-full">
                                <Input
                                    label="Previous"
                                    placeholder="Previous"
                                    value={set.weight + " x " + set.reps}
                                    isDisabled
                                />
                            </div>
                            <div className="col-span-2 w-full">
                                <NumberInput
                                    label="Weight"
                                    placeholder="Weight"
                                    value={set.weight}
                                    minValue={0}
                                    onValueChange={(e) =>
                                        workoutContext.updateSet(
                                            exercise.id,
                                            set.id,
                                            e,
                                            set.reps,
                                            set.type,
                                            set.done,
                                        )
                                    }
                                    formatOptions={{
                                        style: "unit",
                                        unit: "kilogram",
                                    }}
                                    isDisabled={workoutContext.readonly || set.done}
                                />
                            </div>
                            <div className="col-span-2 w-full">
                                <NumberInput
                                    label="Reps"
                                    placeholder="Reps"
                                    minValue={0}
                                    value={set.reps}
                                    onValueChange={(e) =>
                                        workoutContext.updateSet(
                                            exercise.id,
                                            set.id,
                                            set.weight,
                                            e,
                                            set.type,
                                            set.done,
                                        )
                                    }
                                    isDisabled={workoutContext.readonly || set.done}
                                />
                            </div>
                            {workoutContext.readonly ? null : (
                                <>
                                    <div>
                                        <Checkbox
                                            isSelected={set.done}
                                            onValueChange={(e) =>
                                                workoutContext.updateSet(
                                                    exercise.id,
                                                    set.id,
                                                    set.weight,
                                                    set.reps,
                                                    set.type,
                                                    e,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            color="danger"
                                            onPress={() => {
                                                // Remove set logic
                                            }}
                                            isDisabled={set.done}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                {workoutContext.readonly ? null : (
                    <Button
                        onPress={() => workoutContext.addSet(exercise.id, 0, 0, "WORKING")}
                    >
                        Add Set
                    </Button>
                )}
            </div>
        </div >
    );
}
