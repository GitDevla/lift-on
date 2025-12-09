import {
    Card,
    CardBody,
    CardHeader,
    Image,
    useDisclosure,
} from "@/client/lib/heroui";
import type { ExerciseWithRelations } from "@/server/model/ExerciseModel";
import ImageWithFallback from "../atoms/ImageWithFallback";
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

    const imageUrl = exercise.imageUrl
        ? exercise.imageUrl
        : "https://placehold.co/180";

    return (
        <Card onPress={handlePress} isPressable isHoverable>
            <ExerciseModal exercise={exercise} disclosure={modalDis} />
            <div className="flex flex-row justify-around items-center @lg:flex-col @lg:justify-center @lg:items-center p-4">
                <div className="w-1/4 @lg:w-full flex justify-center">
                    <ImageWithFallback
                        src={imageUrl}
                        alt={exercise.name}
                        height={180}
                        width={180}
                        className="mt-2 aspect-square object-contain"
                    />
                </div>
                <div className="flex justify-center w-3/4 @lg:w-full">
                    <h2 className="text-lg font-semibold line-clamp-1 capitalize">
                        {exercise.name}
                    </h2>
                </div>
            </div>
        </Card>
    );
}
