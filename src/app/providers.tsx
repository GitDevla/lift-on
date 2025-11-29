import AuthProvider from "@/components/providers/AuthProvider";
import { HeroUIProvider, ToastProvider } from "@/lib/heroui";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider />
            <AuthProvider>
                {children}
            </AuthProvider>
        </HeroUIProvider>
    )
}