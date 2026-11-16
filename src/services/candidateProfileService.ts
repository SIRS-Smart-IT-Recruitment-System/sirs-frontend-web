import candidateApi from "./candidateApi";
import type { CandidateProfileRequest } from "../types/authTypes";

// Tạo hồ sơ Candidate
export const createCandidateProfile = async (
    data: CandidateProfileRequest
) => {
    const response = await candidateApi.post(
        "/api/v1/candidates/profile/create",
        data
    );

    return response.data;
};

// Lấy hồ sơ Candidate
export const getCandidateProfile = async () => {
    const response = await candidateApi.get(
        "/api/v1/candidates/profile"
    );

    return response.data;
};