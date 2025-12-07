import AuthProvider from "@/client/components/providers/AuthProvider";
import { HeroUIProvider, ToastProvider } from "@/client/lib/heroui";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider />
            <AuthProvider>{children}</AuthProvider>
        </HeroUIProvider>
    );
}
