export interface RegisterRequest {
    email: string;
    password: string;
    role: "CANDIDATE" | "RECRUITER";
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Đồng bộ enum với Backend
export type CandidateJobStatus =
    | "OPEN_FOR_WORK"
    | "READY_FOR_OPPORTUNITY"
    | "NOT_LOOKING";

export interface CandidateProfileRequest {
    name: string;
    phoneNumber: string;
    bio: string;
    cvUrl?: string;
    avatarUrl?: string;
    jobStatus: CandidateJobStatus;
}

export interface CandidateProfileResponse {
    candidateId: string;
    userId: string;
    name: string;
    bio: string;
    phoneNumber: string;
    cvUrl?: string;
    jobStatus: CandidateJobStatus;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CompanyProfileRequest {
    companyName: string;
    headquartersAddress: string;
    businessRegistrationNumber: string;
    legalRepresentative: string;
}

export interface CompanyProfileResponse {
    companyId: string;
    userId: string;
    companyName: string;
    headquartersAddress: string;
    businessRegistrationNumber: string;
    legalRepresentative: string;
    createdAt?: string;
    updatedAt?: string;
}