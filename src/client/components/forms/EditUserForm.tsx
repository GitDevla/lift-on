import { useContext, useState } from "react";
import AuthBackend from "@/client/lib/backend/AuthBackend";
import { addToast, Button, Divider, Form, Input } from "@/client/lib/heroui";
import { updateUserSchema } from "@/validation/AuthSchema";
import { AuthContext } from "../contexts/AuthContext";

export default function EditUserForm() {
    const authContext = useContext(AuthContext);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    if (!authContext.user) {
        return null;
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newUsername = e.currentTarget.username.value;
        const newEmail = e.currentTarget.email.value;
        const newPassword = e.currentTarget.newPassword.value;
        const confirmPassword = e.currentTarget.confirmPassword.value;

        const result = updateUserSchema.safeParse({
            username: newUsername || undefined,
            email: newEmail || undefined,
            newPassword: newPassword || undefined,
            confirmPassword: confirmPassword || undefined,
        });

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setErrors({
                confirmPassword: ["New password and confirmation do not match"],
            });
            return;
        }

        const updateData: Partial<{ username: string; email: string; password: string }> = {};
        if (newUsername) updateData.username = newUsername;
        if (newEmail) updateData.email = newEmail;
        if (newPassword) updateData.password = newPassword;

        const res = await AuthBackend.updateCurrentUser(updateData);
        if (res.ok && res.data.user) {
            addToast({
                title: "User updated successfully",
                color: "success",
            });
        } else {
            addToast({
                title: "Error updating user",
                color: "danger",
                description: res.ok ? undefined : res.error,
            });
        }
    }

    return (
        <Form
            className="flex flex-col gap-4 max-w-md"
            validationBehavior="aria"
            validationErrors={errors}
            onSubmit={onSubmit}
        >
            <Input
                name="username"
                label="Username"
                labelPlacement="outside"
                placeholder="Enter username"
                variant="bordered"
                defaultValue={authContext.user.username}
            />
            <Input
                name="email"
                label="Email"
                labelPlacement="outside"
                placeholder="Enter email"
                variant="bordered"
                type="email"
                defaultValue={authContext.user.email}
            />
            <Divider className="my-2" />
            <Input
                name="newPassword"
                label="New Password"
                labelPlacement="outside"
                placeholder="Enter new password"
                variant="bordered"
                type="password"
            />
            <Input
                name="confirmPassword"
                label="Confirm New Password"
                labelPlacement="outside"
                placeholder="Confirm new password"
                variant="bordered"
                type="password"
            />
            <Button type="submit" color="primary" size="lg" className="mt-2">
                Save Changes
            </Button>
        </Form>
    );
}
