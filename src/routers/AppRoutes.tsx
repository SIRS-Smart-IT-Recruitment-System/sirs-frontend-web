import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import AuthPage from "../pages/auth-page/AuthPage.tsx";
import CompanyProfile from "../pages/profile-pages/company-profile/CompanyProfile.tsx";
import CandidateProfile from "../pages/profile-pages/candidate-profile/CandidateProfile.tsx";
import GitVerificationPage from "../pages/git-page/GitVerificationPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

import { ROLE } from "../constants/role";
import RecruiterWorkspace from "../features/recruiter/RecruiterWorkspace";
import CandidatesPage from "../pages/company/candidates/CandidatesPage";
import InterviewsPage from "../pages/company/interviews/InterviewsPage";
import DashboardPage from "../pages/company/dashboard/DashboardPage";

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

            <Route element={<ProtectedRoute requiredRole={ROLE.RECRUITER}><RecruiterWorkspace /></ProtectedRoute>}>
                <Route path={ROUTES.RECRUITER.CANDIDATES} element={<CandidatesPage />} />
                <Route path={ROUTES.RECRUITER.INTERVIEWS} element={<InterviewsPage />} />
                <Route path={ROUTES.RECRUITER.DASHBOARD} element={<DashboardPage />} />
            </Route>

            <Route
                path={ROUTES.NOT_FOUND}
                element={<NotFoundPage />}
            />
        </Routes>
    );
}

export default AppRoutes;
