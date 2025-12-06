"use client";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "@/components/contexts/AuthContext";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { Card, CardBody, CardHeader, Divider, Link } from "@/lib/heroui";

export default function AuthPage() {
    const authContext = useContext(AuthContext);
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    if (authContext.user) {
        router.push("/");
    }

    return (
        <div className="flex justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="flex flex-col gap-1 px-6 pt-6">
                    <h1 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h1>
                    <p className="text-sm text-gray-400">
                        {isLogin ? "Log in to track your workouts" : "Sign up to get started"}
                    </p>
                </CardHeader>
                <Divider />
                <CardBody className="gap-4 p-6">
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                    <div className="text-center text-sm">
                        <span className="text-gray-400">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <Link
                            className="cursor-pointer"
                            onPress={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </Link>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
