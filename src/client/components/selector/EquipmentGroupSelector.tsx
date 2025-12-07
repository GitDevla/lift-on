import { useEffect, useState } from "react";
import ExerciseBackend from "@/client/lib/backend/ExerciseBackend";
import { Select, SelectItem } from "@/client/lib/heroui";

export default function EquipmentGroupSelector({
    value,
    onChange,
}: {
    value: string[];
    onChange: (newValue: string[]) => void;
}) {
    const [equipmentGroups, setEquipmentGroups] = useState<
        Array<{ id: number; name: string }>
    >([]);

    useEffect(() => {
        ExerciseBackend.fetchEquipment().then((res) => {
            if (res.ok) {
                setEquipmentGroups(res.data);
            } else {
                console.error("Failed to fetch equipment groups:", res.error);
            }
        });
    }, []);
    return (
        <Select
            label="Equipment"
            placeholder="Filter by Equipments"
            selectedKeys={value}
            onSelectionChange={(keys) => onChange(Array.from(keys) as string[])}
            isClearable
        >
            {equipmentGroups.map((mg) => (
                <SelectItem key={mg.id.toString()} className="capitalize">
                    {mg.name}
                </SelectItem>
            ))}
        </Select>
    );
}
