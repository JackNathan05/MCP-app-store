
import React from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export default function Dashboard() {
  const { user, loading } = useSupabaseAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user) return <div className="flex justify-center items-center min-h-screen">Not logged in.</div>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      <div className="max-w-lg rounded-xl shadow-md bg-card p-10 w-full space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">Your Dashboard</h1>
        <div className="text-center">
          <div className="text-xl mb-1">Welcome, <span className="font-semibold">{user.email}</span>!</div>
          <div className="text-gray-500 text-sm">User ID: {user.id}</div>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          This is your personalized dashboard. More features coming soon!
        </div>
      </div>
    </div>
  );
}
