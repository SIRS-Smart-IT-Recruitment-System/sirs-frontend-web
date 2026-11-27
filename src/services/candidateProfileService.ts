import api from "./api";

import type {
    CandidateProfileRequest,
    CandidateProfileResponse,
} from "../types/authTypes";

let cachedProfile: {
    token: string | null;
    request: Promise<CandidateProfileResponse>;
} | undefined;

export function clearCandidateProfileCache() {
    cachedProfile = undefined;
}

export function getCandidateProfile(): Promise<CandidateProfileResponse> {
    const token = localStorage.getItem("accessToken");

    if (cachedProfile?.token === token) {
        return cachedProfile.request;
    }

    const request = api
        .get<CandidateProfileResponse>("/api/v1/candidates/profile")
        .then((response) => response.data)
        .catch((error) => {
            if (cachedProfile?.request === request) {
                clearCandidateProfileCache();
            }

            throw error;
        });

    cachedProfile = { token, request };

    return request;
}

function cacheSavedProfile(
    token: string | null,
    profile: CandidateProfileResponse
) {
    if (token === localStorage.getItem("accessToken")) {
        cachedProfile = {
            token,
            request: Promise.resolve(profile),
        };
    }

    return profile;
}

export const createCandidateProfile = async (
    data: CandidateProfileRequest
): Promise<CandidateProfileResponse> => {
    const token = localStorage.getItem("accessToken");
    const response = await api.post<CandidateProfileResponse>(
        "/api/v1/candidates/profile/create",
        data
    );

    return cacheSavedProfile(token, response.data);
};

export const updateCandidateProfile = async (
    data: CandidateProfileRequest
): Promise<CandidateProfileResponse> => {
    const token = localStorage.getItem("accessToken");
    const response = await api.put<CandidateProfileResponse>(
        "/api/v1/candidates/profile",
        data
    );

    return cacheSavedProfile(token, response.data);
};
