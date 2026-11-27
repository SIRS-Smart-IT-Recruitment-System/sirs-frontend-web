import api from "./api";
import type { RecruiterProfileResponse } from "../types/authTypes";

const profilePath = "/api/v1/recruiters/profile";

export async function getRecruiterProfile() {
    const response = await api.get<RecruiterProfileResponse>(profilePath);
    return response.data;
}

export async function getCompanyRecruiters(companyId: string) {
    const response = await api.get<RecruiterProfileResponse[]>(
        `${profilePath}/company/${encodeURIComponent(companyId)}`
    );
    return response.data;
}
