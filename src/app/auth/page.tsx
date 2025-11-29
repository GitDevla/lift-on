"use client";
import { redirect } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "@/components/contexts/AuthContext";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { Link } from "@/lib/heroui";

export default function AuthPage() {
    const authContext = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    if (authContext.user) {
        redirect("/");
    }

    return (
        <div>
            <h1>{isLogin ? "Login" : "Register"}</h1>
            {isLogin ? <LoginForm /> : <RegisterForm />}
            <Link onPress={() => setIsLogin(!isLogin)}>
                {isLogin ? "Switch to Register" : "Switch to Login"}
            </Link>
        </div>
    );
}
