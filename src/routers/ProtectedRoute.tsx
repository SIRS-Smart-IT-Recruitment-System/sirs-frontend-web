import { Fragment, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
}

function subscribe(notify: () => void) {
    window.addEventListener("storage", notify);
    return () => window.removeEventListener("storage", notify);
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const token = useSyncExternalStore(subscribe, () => localStorage.getItem("accessToken"));
    const role = useSyncExternalStore(subscribe, () => localStorage.getItem("role"));

    if (!token || (requiredRole && requiredRole !== role)) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Fragment key={token}>{children}</Fragment>;
}

export default ProtectedRoute;
