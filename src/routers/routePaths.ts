export const ROUTES = {
    HOME: "/",

    LOGIN: "/login",
    REGISTER: "/register",

    CANDIDATE: {
        DASHBOARD: "/candidate/dashboard",
        PROFILE: "/candidate/profile",
        GIT_VERIFICATION: "/candidate/git-verification",
        JOBS: "/candidate/jobs",
        JOB_DETAIL: "/candidate/jobs/:id",
    },

    RECRUITER: {
        DASHBOARD: "/company/dashboard",
        PROFILE: "/company/profile",
        JOBS: "/company/jobs",
        JOB_CREATE: "/company/jobs/create",
    },

    NOT_FOUND: "*",
};
