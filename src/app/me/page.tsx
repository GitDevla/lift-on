"use client";
import UserData from "@/client/components/atoms/UserData";
import UsersWorkoutsList from "@/client/components/atoms/UsersWorkoutsList";
import HeroText from "@/client/components/layout/HeroText";
import { forceAuthenticated } from "@/client/lib/ForceAuthenticated";
import { Divider } from "@/client/lib/heroui";

export default function MePage() {
    forceAuthenticated();

    return (
        <div className="space-y-6">
            <HeroText
                title="My Profile"
                subtitle="View and manage your account details"
            />
            <Divider />
            <UserData />
            <Divider />
            <UsersWorkoutsList />
        </div>
    );
}
