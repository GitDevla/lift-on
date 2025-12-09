import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@/client/lib/heroui";

export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Select className="max-w-xs" label="Theme" placeholder="Select a theme" selectedKeys={[theme!]} onSelectionChange={(keys) => setTheme(Array.from(keys)[0])}>
            <SelectItem key="system">System</SelectItem>
            <SelectItem key="dark">Dark</SelectItem>
            <SelectItem key="light">Light</SelectItem>
        </Select>
    );
};
