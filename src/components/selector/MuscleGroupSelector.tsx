import { useEffect, useState } from "react";
import { Backend } from "@/lib/backend";
import { Select, SelectItem } from "@/lib/heroui";

export default function MuscleGroupSelector({
    value,
    onChange,
}: {
    value: string[];
    onChange: (newValue: string[]) => void;
}) {
    const [muscleGroups, setMuscleGroups] = useState<
        Array<{ id: number; name: string }>
    >([]);

    useEffect(() => {
        Backend.getMuscles().then((res) => {
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
            placeholder="Filter by Muscles"
            selectedKeys={value}
            onSelectionChange={(keys) => onChange(Array.from(keys) as string[])}
            isClearable
        >
            {muscleGroups.map((mg) => (
                <SelectItem key={mg.id.toString()} className="capitalize">{mg.name}</SelectItem>
            ))}
        </Select>
    );
}
