import { createContext } from "react";
import type { User } from "@/generated/prisma/client";

export const AuthContext = createContext<{
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (
        username: string,
        password: string,
        email: string,
    ) => Promise<void>;
}>({
    user: null,
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
