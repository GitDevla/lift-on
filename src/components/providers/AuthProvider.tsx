"use client";

import { useEffect, useState } from "react";
import type { User } from "@/generated/prisma/client";
import { Backend } from "@/lib/backend";
import { addToast } from "@/lib/heroui";
import { AuthContext } from "../contexts/AuthContext";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<null | User>(null);

    const login = async (username: string, password: string) => {
        const login = await Backend.login(username, password);
        if (!login.ok) {
            throw new Error(login.error);
        }

        localStorage.setItem("authToken", login.data.token);
        setUser({ id: "1", username, email: "" } as User);
        addToast({
            title: "Login successful!",
            color: "success",
        });
    };

    const logout = async () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };

    const register = async (
        username: string,
        password: string,
        email: string,
    ) => {
        const register = await Backend.register(username, password, email);
        if (!register.ok) {
            throw new Error(register.error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            Backend.getCurrentUser()
                .then((res) => {
                    if (res.ok) {
                        setUser(res.data.user);
                    } else {
                        localStorage.removeItem("authToken");
                    }
                })
                .catch(() => {
                    localStorage.removeItem("authToken");
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}
