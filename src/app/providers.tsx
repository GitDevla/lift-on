import { ThemeProvider as NextThemesProvider } from "next-themes";
import AuthProvider from "@/client/components/providers/AuthProvider";
import { HeroUIProvider, ToastProvider } from "@/client/lib/heroui";
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
                <ToastProvider />
                <AuthProvider>{children}</AuthProvider>
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
