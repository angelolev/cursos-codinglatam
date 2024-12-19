"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "../auth/auth-context";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.email}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
}
