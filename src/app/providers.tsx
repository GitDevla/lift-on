import { HeroUIProvider } from "@/lib/heroui";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            {children}
        </HeroUIProvider>
    )
}