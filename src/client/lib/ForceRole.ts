import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import type { Role } from "@/server/generated/prisma/enums";
import { AuthContext } from "../components/contexts/AuthContext";
import { forceAuthenticated } from "./ForceAuthenticated";

export default function ForceRole(role: Role) {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    if (!forceAuthenticated()) {
        return;
    }

    if (!authContext.loading && authContext.user?.role !== role) {
        addToast({
            title: "Access Denied",
            description: "You do not have permission to access the admin panel.",
            color: "danger",
        });
        router.push("/");
        return false;
    }
    return true;
}
