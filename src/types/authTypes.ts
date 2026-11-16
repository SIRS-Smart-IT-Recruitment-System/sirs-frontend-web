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
