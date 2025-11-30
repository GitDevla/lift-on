"use client";
import { redirect } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/components/contexts/AuthContext";

export default function MePage() {
    const authContext = useContext(AuthContext);
    if (!authContext.loading && !authContext.user) {
        redirect("/login");
    }
    return (
        <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            {authContext.user && (
                <div className="mt-4">
                    <p>
                        <strong>Username:</strong> {authContext.user.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {authContext.user.email}
                    </p>
                </div>
            )}
        </div>
    );
}
