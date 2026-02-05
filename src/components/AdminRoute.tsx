import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface AdminRouteProps {
    children: ReactNode;
}

/**
 * AdminRoute component - Protects admin routes from unauthorized access
 * Redirects to login page if user is not authenticated or not an admin
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // Redirect to dashboard if authenticated but not admin
        return <Navigate to="/dashboard" replace />;
    }

    // User is authenticated and is admin, render children
    return <>{children}</>;
};

export default AdminRoute;
