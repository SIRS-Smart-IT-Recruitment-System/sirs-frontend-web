import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import AuthPage from "../pages/auth-page/AuthPage.tsx";
import CompanyProfile from "../pages/profile-pages/company-profile/CompanyProfile.tsx";
import CandidateProfile from "../pages/profile-pages/candidate-profile/CandidateProfile.tsx";
import GitVerificationPage from "../pages/git-page/GitVerificationPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import CapyByte from "../components/common/CapyByte.tsx";

function NotFoundPage() {
    return (
        <div style={{ padding: "60px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <CapyByte size={180} mode="webp" />
            <h1 style={{ fontSize: 64, margin: 0, fontWeight: 800, color: "#4f46e5" }}>404</h1>
            <p style={{ fontSize: 18, color: "#6b7280", margin: 0 }}>Trang bạn đang tìm kiếm không tồn tại.</p>
            <a href="/" style={{ marginTop: 8, color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>← Về trang chủ</a>
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
                path={ROUTES.CANDIDATE.GIT_VERIFICATION}
                element={
                    <ProtectedRoute>
                        <GitVerificationPage />
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
