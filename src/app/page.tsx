"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/client/components/contexts/AuthContext";

export default function Home() {
  const authContext = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">Lift On</h1>
        <p className="text-xl text-gray-400">Track your lifts.</p>
      </div>

      <div className="flex gap-4">
        {/* <Button as={Link} href="/auth" color="primary" size="lg">
          Get Started
        </Button> */}
        {
          authContext.user ? <Button as={Link} href="/track" color="primary" size="lg">
            Start Tracking
          </Button> : (
            <Button as={Link} href="/auth" color="primary" size="lg">
              Get Started
            </Button>
          )
        }
        <Button as={Link} href="/exercises" variant="bordered" size="lg">
          View Exercises
        </Button>
      </div>
    </div>
  );
}
