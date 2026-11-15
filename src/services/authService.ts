import api from "./api";
import type { CandidateRegisterRequest } from "../types/authTypes";

export const register = async (data: CandidateRegisterRequest) => {
    const payload: CandidateRegisterRequest = {
        email: data.email.trim(),
        password: data.password,
        role: data.role,
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        bio: data.bio.trim(),
        workStatus: data.workStatus.trim(),
    };

    const response = await api.post(
        "/api/v1/auth/register",
        payload
    );

    return response.data;
};