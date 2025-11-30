"use client";
import { useEffect, useState } from "react";

export default function Timer({ startTime, endTime }: { startTime: Date; endTime?: Date | null }) {
    const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

    useEffect(() => {
        const calculateElapsedTime = () => {
            const end = endTime ? new Date(endTime) : new Date();
            const start = new Date(startTime);
            const diff = Math.max(0, end.getTime() - start.getTime());

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        };

        setElapsedTime(calculateElapsedTime());

        if (!endTime) {
            const interval = setInterval(() => {
                setElapsedTime(calculateElapsedTime());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [startTime, endTime]);

    return <div className="text-center font-mono text-lg">{elapsedTime}</div>;
}