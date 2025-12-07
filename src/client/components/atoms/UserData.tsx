import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function UserData() {
    const authContext = useContext(AuthContext);

    if (!authContext.user) {
        return <p>No user data available.</p>;
    }


    return <div className="mt-4">
        <p>
            <strong>Username:</strong> {authContext.user.username}
        </p>
        <p>
            <strong>Email:</strong> {authContext.user.email}
        </p>
        <p>
            <strong>Role:</strong> {authContext.user.role}
        </p>
    </div>
}