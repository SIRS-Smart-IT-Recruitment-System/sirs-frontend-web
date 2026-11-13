import { ROLE } from "../constants/role";

export interface RegisterRequest {
    email: string;
    password: string;
    role: typeof ROLE[keyof typeof ROLE];
}

export interface CandidateProfileRequest {
    fullName: string;
    phone: string;
    bio: string;
    workStatus: string;
}

export interface CandidateRegisterRequest
    extends RegisterRequest,
        CandidateProfileRequest {}