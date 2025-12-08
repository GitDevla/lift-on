import { Button } from "@heroui/react";
import { cn } from "clsx-for-tailwind";
import { useState } from "react";

export default function Collapsable({
    title,
    children,
    isOpenByDefault = false,
}: {
    title: string;
    children: React.ReactNode;
    isOpenByDefault?: boolean;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(isOpenByDefault);


    return (
        <div className="w-full">
            <Button
                className="w-full px-4 py-2 text-left"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex justify-between items-center">
                    <span className="font-medium">{title}</span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                </div>
            </Button>
            <div className={cn("transition-max-h duration-300 px-4 h-full  overflow-hidden",
                isOpen ? "max-h-[500px]" : "max-h-0"
            )}>{children}</div>
        </div>
    );
}