"use client";
import EditUserForm from "@/client/components/forms/EditUserForm";
import GlobalSettings from "@/client/components/forms/GlobalSettings";
import HeroText from "@/client/components/layout/HeroText";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <HeroText title="Settings" subtitle="Manage your settings" />
            <EditUserForm />
            <GlobalSettings />
        </div>
    );
}
