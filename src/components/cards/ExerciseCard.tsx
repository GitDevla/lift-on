import { Card, CardBody, CardHeader, Image, useDisclosure } from "@/lib/heroui";
import type { ExerciseWithRelations } from "@/model/ExerciseModel";
import ExerciseModal from "../modal/ExerciseModal";

export default function ExerciseCard({
    exercise,
    overrideOnPress,
}: {
    exercise: ExerciseWithRelations;
    overrideOnPress?: (exercise: ExerciseWithRelations) => void;
}) {

    const modalDis = useDisclosure();

    const handlePress = () => {
        if (overrideOnPress) {
            overrideOnPress(exercise);
        } else {
            modalDis.onOpen();
        }
    };

    return (
        <Card onPress={handlePress} isPressable isHoverable>
            <ExerciseModal exercise={exercise} disclosure={modalDis} />
            <CardHeader>
                <h2 className="text-lg font-semibold">{exercise.name}</h2>
            </CardHeader>
            <CardBody>
                <Image src={exercise.imageUrl as string} alt={exercise.name} className="mt-2 rounded-md" />
            </CardBody>
        </Card>
    );
}
