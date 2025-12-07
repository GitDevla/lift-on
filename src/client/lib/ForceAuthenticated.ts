"use client";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../components/contexts/AuthContext";

export function forceAuthenticated(): boolean {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    if (!authContext.loading && !authContext.user) {
        addToast({
            title: "You must be logged in to access your profile.",
            color: "warning",
        });
        router.push("/auth");
        return false;
    }
    return true;
}
