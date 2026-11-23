import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import AuthPage from "../pages/auth-page/AuthPage.tsx";
import CompanyProfile from "../pages/profile-pages/company-profile/CompanyProfile.tsx";
import CandidateProfile from "../pages/profile-pages/candidate-profile/CandidateProfile.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

function NotFoundPage() {
    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h1>404</h1>
            <p>Trang bạn đang tìm kiếm không tồn tại.</p>
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route
                path={ROUTES.HOME}
                element={<Navigate to={ROUTES.LOGIN} replace />}
            />

            <Route
                path={ROUTES.LOGIN}
                element={<AuthPage />}
            />

            <Route
                path={ROUTES.REGISTER}
                element={<AuthPage />}
            />

            <Route
                path={ROUTES.CANDIDATE.PROFILE}
                element={
                    <ProtectedRoute>
                        <CandidateProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.RECRUITER.PROFILE}
                element={
                    <ProtectedRoute>
                        <CompanyProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.NOT_FOUND}
                element={<NotFoundPage />}
            />
        </Routes>
    );
}

export default AppRoutes;
