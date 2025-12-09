import { cn } from "clsx-for-tailwind";
import { useContext } from "react";
import {
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Input,
    NumberInput,
    Select,
    SelectItem,
} from "@/client/lib/heroui";
import { SetType } from "@/server/generated/prisma/enums";
import ImageWithFallback from "../atoms/ImageWithFallback";
import { WorkoutContext } from "../contexts/WorkoutContext";
import ConfirmationModal from "../modal/ConfirmationModal";

export default function TrackExerciseForm({ id }: { id: string }) {
    const workoutContext = useContext(WorkoutContext);
    const exercise = workoutContext.currentWorkout?.exercises.find(
        (ex) => ex.name === id,
    )!;

    return (
        <div>
            <div key={exercise.id}>
                <div className="flex items-center bg-content2 rounded-md p-2 px-10 gap-10 relative">
                    <ImageWithFallback
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        width={180}
                        height={180}
                    />
                    <h3 className="capitalize text-lg">{exercise.name}</h3>
                    {workoutContext.readonly ? null : (
                        <div className="top-0 absolute right-0 m-2 aspect-square">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant="bordered">Open Menu</Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem
                                        key="move_up"
                                        onPress={() => workoutContext.moveExerciseUp(exercise.id)}
                                    >
                                        Move Up
                                    </DropdownItem>
                                    <DropdownItem
                                        key="move_down"
                                        onPress={() => workoutContext.moveExerciseDown(exercise.id)}
                                    >
                                        Move Down
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                        onPress={() => workoutContext.removeExercise(exercise.id)}
                                    >
                                        Delete Exercise
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    )}
                </div>
                <div>
                    <div
                        className={cn(
                            "grid font-bold gap-3 text-content4-foreground mb-2",
                            workoutContext.readonly ? "grid-cols-5" : "grid-cols-8",
                        )}
                    >
                        <div className="text-center">Type</div>
                        {workoutContext.readonly ? null : (
                            <div className="col-span-2 text-center">Prev</div>
                        )}
                        <div className="col-span-2 text-center">Weight</div>
                        <div className="col-span-2 text-center">Rep</div>
                        {workoutContext.readonly ? null : (
                            <div className="text-center">Done</div>
                        )}
                    </div>
                    {exercise.sets.map((set) => (
                        <div
                            key={set.id}
                            className={cn(
                                "grid gap-3 items-center justify-items-center p-2  rounded-md relative",
                                set.done && !workoutContext.readonly && "bg-green-500",
                                workoutContext.readonly ? "grid-cols-5" : "grid-cols-8",
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
                                    isRequired
                                    classNames={{
                                        popoverContent: "min-w-[200px] w-[300px]",
                                    }}
                                    renderValue={(items) => {
                                        return <p>{items.map((i) => i.textValue?.slice(0, 2))}</p>;
                                    }}
                                    isDisabled={workoutContext.readonly || set.done}
                                >
                                    {Object.values(SetType).map((type) => (
                                        <SelectItem key={type}>{type}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                            {workoutContext.readonly ? null : (
                                <div className="col-span-2 w-full">
                                    <Input
                                        label="Previous"
                                        placeholder="Previous"
                                        value={
                                            exercise.previousSets &&
                                                exercise.previousSets[set.order - 1]
                                                ? `${exercise.previousSets[set.order - 1].weight} kg x ${exercise.previousSets[set.order - 1].repetitions}`
                                                : "N/A"
                                        }
                                        readOnly
                                        isDisabled
                                    />
                                </div>
                            )}
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
                                    <div className="absolute top-0 right-0">
                                        <ConfirmationModal
                                            title="Confirm Deletion"
                                            message="You really wanna delete this Set"
                                            onConfirm={() =>
                                                workoutContext.removeSet(exercise.id, set.id)
                                            }
                                            trigger={(open) => (
                                                <Button
                                                    color="danger"
                                                    onPress={open}
                                                    isDisabled={set.done}
                                                    size="sm"
                                                    isIconOnly
                                                >
                                                    X
                                                </Button>
                                            )}
                                        ></ConfirmationModal>
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
        </div>
    );
}
