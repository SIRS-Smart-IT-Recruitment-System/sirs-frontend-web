import api from "./api";
import axios from "axios";

import type {
    CandidateProfileRequest,
    CandidateProfileResponse,
} from "../types/authTypes";

// Lấy hồ sơ ứng viên
export const getCandidateProfile =
    async (): Promise<CandidateProfileResponse> => {
        const response = await api.get<CandidateProfileResponse>(
            "/api/v1/candidates/profile"
        );

        return response.data;
    };

// Tạo hồ sơ ứng viên
export const createCandidateProfile = async (
    data: CandidateProfileRequest
): Promise<CandidateProfileResponse> => {
    console.log("Create candidate profile request:", data);

    const response = await api.post<CandidateProfileResponse>(
        "/api/v1/candidates/profile/create",
        data
    );

    console.log("Create candidate profile response:", response.data);

    return response.data;
};

// Cập nhật hồ sơ ứng viên
export const updateCandidateProfile = async (
    data: CandidateProfileRequest
): Promise<CandidateProfileResponse> => {
    console.log("Update candidate profile request:", data);

    try {
        const response = await api.put<CandidateProfileResponse>(
            "/api/v1/candidates/profile",
            data
        );

        console.log("Update candidate profile response:", response.data);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            console.error("Request URL:", error.config?.url);
            console.error("Request method:", error.config?.method);
            console.error("Request payload:", error.config?.data);
        }

        console.error("Update candidate profile failed:", error);

        throw error;
    }
};