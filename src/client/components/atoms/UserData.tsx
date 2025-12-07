import { useContext } from "react";
import AuthBackend from "@/client/lib/backend/AuthBackend";
import { Button } from "@/client/lib/heroui";
import { AuthContext } from "../contexts/AuthContext";
import ConfirmationModal from "../modal/ConfirmationModal";

export default function UserData() {
    const authContext = useContext(AuthContext);

    if (!authContext.user) {
        return <p>No user data available.</p>;
    }

    return (
        <div className="mt-4">
            <p>
                <strong>Username:</strong> {authContext.user.username}
            </p>
            <p>
                <strong>Email:</strong> {authContext.user.email}
            </p>
            <p>
                <strong>Role:</strong> {authContext.user.role}
            </p>
            <ConfirmationModal
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone."
                onConfirm={() => AuthBackend.deleteCurrentUser()}
                trigger={(onOpen) => <Button color="danger" onPress={onOpen}>Delete Account</Button>}
            />
        </div>
    );
}
