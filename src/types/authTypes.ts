export interface RegisterRequest {
    email: string;
    password: string;
    role: "CANDIDATE" | "RECRUITER";
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface CandidateProfileRequest {
    name: string;
    phoneNumber: string;
    bio: string;
    cvUrl: string;
    avatarUrl: string;
    jobStatus: string;
}