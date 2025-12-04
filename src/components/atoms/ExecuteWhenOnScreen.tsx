import { useEffect, useRef } from "react";

export default function ExecuteWhenOnScreen({
    children,
    onScreen,
}: {
    children?: React.ReactNode;
    onScreen: () => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onScreen();
                    }
                });
            },
            { threshold: 1 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [onScreen]);

    return <div ref={ref}>{children}</div>;
}