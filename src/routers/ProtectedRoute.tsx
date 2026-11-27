import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";

import { ROLE } from "../constants/role";
import type { SidebarRole } from "../constants/navigation";

interface ProtectedRouteProps {
    role: SidebarRole;
    children: ReactNode;
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    const accountRole = localStorage.getItem("role")?.toUpperCase();
    if (role === "company" && accountRole === ROLE.CANDIDATE) {
        return <Navigate to={ROUTES.CANDIDATE.DASHBOARD} replace />;
    }
    if (role === "candidate" && accountRole === ROLE.RECRUITER) {
        return <Navigate to={ROUTES.RECRUITER.PROFILE} replace />;
    }
    return <>{children}</>;
}

export default ProtectedRoute;
