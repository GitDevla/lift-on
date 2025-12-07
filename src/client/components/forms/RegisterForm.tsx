import { redirect, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { addToast, Button, Form, Input } from "@/client/lib/heroui";
import { registerSchema } from "@/validation/AuthSchema";
import { AuthContext } from "../contexts/AuthContext";

export default function RegisterForm() {
    const authContext = useContext(AuthContext);
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const result = registerSchema.safeParse(
            Object.fromEntries(new FormData(e.currentTarget)),
        );
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }
        authContext
            .register(result.data.username, result.data.password, result.data.email)
            .then(() => {
                addToast({
                    title: "Registration successful! You can now log in.",
                    color: "success",
                });
                router.push("/auth");
            })
            .catch((err) => {
                addToast({
                    title: "Registration failed",
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
                type="email"
                name="email"
                label="Email"
                labelPlacement="outside"
                placeholder="Enter your email"
            />
            <Input
                isRequired
                type="password"
                name="password"
                label="Password"
                labelPlacement="outside"
                placeholder="Enter your password"
            />
            <Button type="submit" color="primary">Register</Button>
        </Form>
    );
}
