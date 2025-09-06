"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    // Call API to store user
    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      }),
    }).catch(console.error);

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isSignedIn, isLoaded, user, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-semibold">Welcome, {user?.firstName} 🚀</h1>
      <p>We’re setting things up for you…</p>
      <p className="text-sm text-gray-500">Redirecting to homepage in 3s</p>
    </div>
  );
}
