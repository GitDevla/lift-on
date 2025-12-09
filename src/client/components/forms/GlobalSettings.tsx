import HeroText from "../layout/HeroText";
import { ThemeSwitcher } from "../selector/ThemeSelector";

export default function GlobalSettings() {
    return <div>
        <HeroText title="Global Settings" subtitle="" />
        <ThemeSwitcher />
    </div>;
}