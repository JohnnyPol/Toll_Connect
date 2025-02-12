import { Navigate, Outlet } from "react-router-dom";
import { UserLevel } from "@/types/auth.ts";
import { isAuthenticated } from "@/components/auth.tsx";

export function ProtectedRoute({
  requiredLevel,
}: {
  requiredLevel: UserLevel;
}) {
  if (!isAuthenticated(requiredLevel)) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render child components (e.g., /admin or /company)
  return <Outlet />;
}
