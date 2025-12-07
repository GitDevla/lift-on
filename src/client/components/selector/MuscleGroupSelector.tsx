import { useEffect, useState } from "react";
import ExerciseBackend from "@/client/lib/backend/ExerciseBackend";
import { Select, SelectItem } from "@/client/lib/heroui";

export default function MuscleGroupSelector({
    value,
    onChange,
    overrideHint,
}: {
    value: string[];
    onChange: (newValue: string[]) => void;
    overrideHint?: string;
}) {
    const [muscleGroups, setMuscleGroups] = useState<
        Array<{ id: number; name: string }>
    >([]);

    useEffect(() => {
        ExerciseBackend.fetchMuscles().then((res) => {
            if (res.ok) {
                setMuscleGroups(res.data);
            } else {
                console.error("Failed to fetch muscle groups:", res.error);
            }
        });
    }, []);
    return (
        <Select
            label="Muscles"
            selectionMode="multiple"
            placeholder={overrideHint || "Filter by Muscles"}
            selectedKeys={value}
            onSelectionChange={(keys) => onChange(Array.from(keys) as string[])}
            isClearable
        >
            {muscleGroups.map((mg) => (
                <SelectItem key={mg.id.toString()} className="capitalize">
                    {mg.name}
                </SelectItem>
            ))}
        </Select>
    );
}
