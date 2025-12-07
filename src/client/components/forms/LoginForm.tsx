import { redirect, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { addToast, Button, Form, Input } from "@/client/lib/heroui";
import { loginSchema } from "@/validation/AuthSchema";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginForm() {
    const authContext = useContext(AuthContext);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const router = useRouter();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const result = loginSchema.safeParse(
            Object.fromEntries(new FormData(e.currentTarget)),
        );
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }
        authContext
            .login(result.data.username, result.data.password)
            .then(() => {
                addToast({
                    title: "Login successful!",
                    color: "success",
                });
                router.push("/");
            })
            .catch((err) => {
                addToast({
                    title: "Login failed",
                    color: "danger",
                    description: err.message,
                });
            });
    }

    return (
        <Form
            validationBehavior="aria"
            validationErrors={errors}
            onSubmit={onSubmit}
        >
            <Input
                isRequired
                name="username"
                label="Username"
                labelPlacement="outside"
                placeholder="Enter your username"
            />
            <Input
                isRequired
                type="password"
                name="password"
                label="Password"
                labelPlacement="outside"
                placeholder="Enter your password"
            />
            <Button type="submit" color="primary">Login</Button>
        </Form>
    );
}
