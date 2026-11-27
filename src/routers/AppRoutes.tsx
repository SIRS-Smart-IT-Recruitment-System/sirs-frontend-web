import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import AuthPage from "../pages/auth-page/AuthPage.tsx";
import CompanyProfile from "../pages/profile-pages/company-profile/CompanyProfile.tsx";
import CandidateProfile from "../pages/profile-pages/candidate-profile/CandidateProfile.tsx";
import GitVerificationPage from "../pages/git-page/GitVerificationPage.tsx";
import MainLayout from "../layouts/templates/main-layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute.tsx";
import JobSearchPage from "../pages/candidate/jobs/JobSearchPage.tsx";
import JobDetailPage from "../pages/candidate/jobs/JobDetailPage.tsx";
import CompanyJobsPage from "../pages/company/jobs/CompanyJobsPage.tsx";

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
                element={<AuthPage key="login" />}
            />

            <Route
                path={ROUTES.REGISTER}
                element={<AuthPage key="register" />}
            />

            <Route
                element={
                    <ProtectedRoute role="candidate">
                        <MainLayout role="candidate" />
                    </ProtectedRoute>
                }
            >
                <Route
                    path={ROUTES.CANDIDATE.DASHBOARD}
                    element={<></>}
                />
                <Route
                    path={ROUTES.CANDIDATE.PROFILE}
                    element={<CandidateProfile />}
                />
                <Route
                    path={ROUTES.CANDIDATE.GIT_VERIFICATION}
                    element={<GitVerificationPage />}
                />
                <Route
                    path={ROUTES.CANDIDATE.JOBS}
                    element={<JobSearchPage />}
                />
                <Route
                    path={ROUTES.CANDIDATE.JOB_DETAIL}
                    element={<JobDetailPage />}
                />
            </Route>

            <Route
                element={
                    <ProtectedRoute role="company">
                        <MainLayout role="company" />
                    </ProtectedRoute>
                }
            >
                <Route
                    path={ROUTES.RECRUITER.JOBS}
                    element={<CompanyJobsPage />}
                />
                <Route
                    path={ROUTES.RECRUITER.JOB_CREATE}
                    element={<CompanyJobsPage />}
                />
                <Route
                    path={ROUTES.RECRUITER.PROFILE}
                    element={<CompanyProfile />}
                />
            </Route>

            <Route
                path={ROUTES.NOT_FOUND}
                element={<NotFoundPage />}
            />
        </Routes>
    );
}

export default AppRoutes;
