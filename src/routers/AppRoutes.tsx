import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import AuthPage from "../pages/AuthPage/AuthPage.tsx";
import RecruiterProfile from "../pages/ProfilePages/recruiter-profile/RecruiterProfile.tsx";
import CandidateProfile from "../pages/ProfilePages/candidate-profile/CandidateProfile.tsx";

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
                element={<CandidateProfile />}
            />

            <Route
                path={ROUTES.RECRUITER.PROFILE}
                element={<RecruiterProfile />}
            />

            <Route
                path={ROUTES.NOT_FOUND}
                element={<NotFoundPage />}
            />
        </Routes>
    );
}

export default AppRoutes;
