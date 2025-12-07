import { createContext } from "react";
import type { User } from "@/server/generated/prisma/client";

export const AuthContext = createContext<{
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (
        username: string,
        password: string,
        email: string,
    ) => Promise<void>;
}>({
    user: null,
    loading: true,
    login: async () => {
        console.log("login function not implemented");
    },
    logout: async () => {
        console.log("logout function not implemented");
    },
    register: async () => {
        console.log("register function not implemented");
    },
});
