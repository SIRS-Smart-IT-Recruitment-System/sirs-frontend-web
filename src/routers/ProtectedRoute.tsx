import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
